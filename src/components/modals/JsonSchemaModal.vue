<template>
  <div class="json-modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="json-modal" :class="{ 'app-dark': isDarkMode }" @click.stop>
      <div class="modal-header">
        <h3>JSON Schema 配置</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <div class="schema-controls">
          <button class="add-btn" @click="addRootObject">初始化根对象</button>
          <button class="add-btn" @click="addProperty" :disabled="!schema.properties">添加属性</button>
        </div>

        <div v-if="schema.properties" class="schema-tree">
          <SchemaNode
              v-for="prop in schema.properties"
              :key="prop.key"
              :node="prop"
              :depth="0"
              @add-child="addNestedProperty"
              @remove="removeProperty"
              @type-change="handleTypeChange"
          />
        </div>

        <div v-else class="empty-state">
          请点击"初始化根对象"开始配置
        </div>

        <div class="schema-preview">
          <h4>预览:</h4>
          <pre class="preview-code">{{ formattedSchema }}</pre>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button
            class="confirm-btn"
            @click="handleConfirm"
            :disabled="!schema.properties"
        >
          确认插入
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SchemaNode from './SchemaNode.vue';
import { keyGenerator } from '../../utils/keyGenerator.ts';

interface SchemaProperty {
  key: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  properties?: SchemaProperty[];
}

interface JsonSchema {
  type: 'object';
  properties?: SchemaProperty[];
  required?: string[];
}

const props = defineProps<{
  visible: boolean;
  isDarkMode: boolean;
  defaultSchema?: JsonSchema;
}>();

const emit = defineEmits(['close', 'confirm', 'error']);

const schema = ref<JsonSchema>({
  type: 'object',
  properties: undefined,
  required: []
});

const addRootObject = () => {
  if (!schema.value.properties) {
    schema.value.properties = [];
    schema.value.required = [];
  }
};

const addProperty = () => {
  if (!schema.value.properties) return;

  const newKey = keyGenerator();
  const newProp: SchemaProperty = {
    key: newKey,
    name: `prop${schema.value.properties.length + 1}`,
    type: 'string',
    required: true
  };

  schema.value.properties.push(newProp);
  updateRequiredArray(newKey, true);
};

const addNestedProperty = (parentProp: SchemaProperty) => {
  if (!parentProp.properties) {
    parentProp.properties = [];
  }

  const newKey = keyGenerator();
  const newProp: SchemaProperty = {
    key: newKey,
    name: `subProp${parentProp.properties.length + 1}`,
    type: 'string',
    required: true
  };

  parentProp.properties.push(newProp);
};

const removeProperty = (key: string) => {
  if (!schema.value.properties) return;

  const removeRecursive = (props: SchemaProperty[]): SchemaProperty[] => {
    return props.filter(prop => {
      if (prop.key === key) return false;
      if (prop.properties) {
        prop.properties = removeRecursive(prop.properties);
      }
      return true;
    });
  };

  schema.value.properties = removeRecursive(schema.value.properties);
  updateRequiredArray(key, false);
};

const handleTypeChange = (prop: SchemaProperty) => {
  if (prop.type === 'object' && !prop.properties) {
    prop.properties = [];
  }
};

const updateRequiredArray = (key: string, shouldAdd: boolean) => {
  if (!schema.value.required) return;

  if (shouldAdd && !schema.value.required.includes(key)) {
    schema.value.required.push(key);
  } else if (!shouldAdd) {
    schema.value.required = schema.value.required.filter(k => k !== key);
  }
};

const formattedSchema = computed(() => {
  if (!schema.value.properties) return '{}';

  const formatProperties = (props: SchemaProperty[]): Record<string, any> => {
    return props.reduce((acc, prop) => {
      acc[prop.name] = { type: prop.type };

      if (prop.type === 'object' && prop.properties) {
        acc[prop.name].properties = formatProperties(prop.properties);

        if (prop.properties.some(p => p.required)) {
          acc[prop.name].required = prop.properties
              .filter(p => p.required)
              .map(p => p.name);
        }
      }

      return acc;
    }, {} as Record<string, any>);
  };

  const result = {
    type: 'object',
    properties: formatProperties(schema.value.properties),
    required: schema.value.properties
        .filter(prop => prop.required)
        .map(prop => prop.name)
  };

  return JSON.stringify(result, null, 2);
});

const handleConfirm = () => {
  if (!schema.value.properties) {
    emit('error', '请先配置JSON Schema');
    return;
  }
  const markdownCodeBlock = `\n\`\`\`js\n${formattedSchema.value}\n\`\`\``;

  emit('confirm', markdownCodeBlock);
};

const handleClose = () => {
  emit('close');
};

const handleMaskClick = () => {
  emit('close');
};

watch(() => props.visible, (newVal) => {
  if (newVal && props.defaultSchema) {
    schema.value = JSON.parse(JSON.stringify(props.defaultSchema));
  } else if (!newVal) {
    schema.value = {
      type: 'object',
      properties: undefined,
      required: []
    };
  }
});
</script>

<style scoped>
@import '../../styles/jsonSchemaModal.css';
</style>
