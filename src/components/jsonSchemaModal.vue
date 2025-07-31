<template>
  <!-- 模板部分基本不变，主要修改绑定逻辑 -->
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
          <div class="schema-root">
            <div class="property-header">
              <span class="property-name">根对象</span>
              <span class="property-type">object</span>
            </div>

            <div class="properties-list">
              <!-- 遍历改为使用 key 作为唯一标识 -->
              <div
                  v-for="(prop) in schema.properties"
                  :key="prop.key"
                  class="property-item"
              >
                <div class="property-controls">
                  <input
                      type="text"
                      v-model="prop.name"
                      class="property-input"
                      placeholder="属性名"
                  >

                  <select
                      v-model="prop.type"
                      class="property-select"
                      @change="handleTypeChange(prop)"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                    <option value="array">array</option>
                  </select>

                  <label class="checkbox-label">
                    必选字段
                    <input
                        type="checkbox"
                        v-model="prop.required"
                        class="property-checkbox"
                        @change="handleRequiredChange(prop)"
                    >
                  </label>

                  <button
                      class="remove-btn"
                      @click="removeProperty(prop.key)"
                  >
                    删除
                  </button>
                </div>

                <!-- 嵌套对象支持 -->
                <div v-if="prop.type === 'object'" class="nested-object">
                  <button
                      class="nested-add-btn"
                      @click="addNestedProperty(prop)"
                  >
                    + 添加子属性
                  </button>
                  <div
                      v-if="prop.properties && prop.properties.length > 0"
                      v-for="(nestedProp) in prop.properties"
                      :key="nestedProp.key"
                      class="nested-property-item"
                  >
                    <input
                        type="text"
                        v-model="nestedProp.name"
                        class="nested-property-input"
                        placeholder="子属性名"
                    >
                    <select
                        v-model="nestedProp.type"
                        class="nested-property-select"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="array">array</option>
                    </select>
                    <button
                        class="nested-remove-btn"
                        @click="removeNestedProperty(prop, nestedProp.key)"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import {keyGenerator} from "../utils/keyGenerator.ts";

// 定义属性结构类型 - 新增 key 字段（固定不变）
interface SchemaProperty {
  key: string; // 内部唯一标识，创建后不变
  name: string; // 显示名称，可修改
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  properties?: SchemaProperty[]; // 嵌套属性
  nestedRequired?: string[]; // 嵌套属性的 required 数组（存储 key）
}

// 定义Schema结构类型 - properties 改为数组（方便遍历）
interface JsonSchema {
  type: 'object';
  properties?: SchemaProperty[]; // 改为数组，用 key 标识
  required?: string[]; // 存储 key 而非 name
}

// 接收父组件参数
const props = defineProps<{
  visible: boolean;
  isDarkMode: boolean;
  defaultSchema?: JsonSchema;
}>();

// 内部状态
const schema = ref<JsonSchema>({
  type: 'object',
  properties: undefined,
  required: []
});

// 初始化根对象
const addRootObject = () => {
  if (!schema.value.properties) {
    schema.value.properties = [];
    schema.value.required = [];
  }
};

// 添加属性 - 使用 uuid 作为 key
const addProperty = () => {
  if (!schema.value.properties) return;

  const newKey = keyGenerator(); // 生成唯一 key
  const newProp = {
    key: newKey,
    name: `prop${schema.value.properties.length + 1}`,
    type: 'string',
    required: true
  };

  schema.value.properties.push(newProp as SchemaProperty);

  // required 数组存储 key
  if (!schema.value.required?.includes(newKey)) {
    schema.value.required?.push(newKey);
  }
};

// 处理类型变更
const handleTypeChange = (prop: SchemaProperty) => {
  if (prop.type === 'object' && !prop.properties) {
    prop.properties = [];
  }
};

// 处理必填状态变更 - 基于 key 操作 required 数组
const handleRequiredChange = (prop: SchemaProperty) => {
  if (!schema.value.required) return;

  if (prop.required && !schema.value.required.includes(prop.key)) {
    schema.value.required.push(prop.key);
  } else if (!prop.required && schema.value.required.includes(prop.key)) {
    schema.value.required = schema.value.required.filter(key => key !== prop.key);
  }
};

// 添加嵌套属性
const addNestedProperty = (parentProp: SchemaProperty) => {
  if (!parentProp.properties) {
    parentProp.properties = [];
  }

  const newKey = keyGenerator();
  parentProp.properties.push({
    key: newKey,
    name: `subProp${parentProp.properties.length + 1}`,
    type: 'string',
    required: true
  });

  // 更新嵌套属性的 required 数组
  if (!parentProp.nestedRequired) {
    parentProp.nestedRequired = [];
  }
  parentProp.nestedRequired.push(newKey);
};

// 删除嵌套属性
const removeNestedProperty = (parentProp: SchemaProperty, nestedKey: string) => {
  if (!parentProp.properties) return;

  // 删除属性
  parentProp.properties = parentProp.properties.filter(prop => prop.key !== nestedKey);

  // 更新嵌套 required 数组
  if (parentProp.nestedRequired) {
    parentProp.nestedRequired = parentProp.nestedRequired.filter(key => key !== nestedKey);
  }
};

// 删除属性
const removeProperty = (key: string) => {
  if (!schema.value.properties) return;

  // 删除属性
  schema.value.properties = schema.value.properties.filter(prop => prop.key !== key);

  // 更新 required 数组
  schema.value.required = schema.value.required?.filter(propKey => propKey !== key);
};

// 格式化Schema用于预览 - 最终输出使用 name
const formattedSchema = computed(() => {
  if (!schema.value.properties) return '{}';

  const finalSchema = {
    type: 'object',
    properties: {} as Record<string, any>,
    required: schema.value.required?.map(key => {
      // 将 required 中的 key 映射为对应的 name
      const prop = schema.value.properties?.find(p => p.key === key);
      return prop?.name || key;
    })
  };

  // 处理顶级属性
  schema.value.properties.forEach(prop => {
    finalSchema.properties[prop.name] = {
      type: prop.type
    };

    // 处理嵌套对象
    if (prop.type === 'object' && prop.properties) {
      finalSchema.properties[prop.name].properties = {};
      prop.properties.forEach(nestedProp => {
        finalSchema.properties[prop.name].properties![nestedProp.name] = {
          type: nestedProp.type
        };
      });

      // 处理嵌套对象的 required（映射为 name）
      if (prop.nestedRequired && prop.nestedRequired.length > 0) {
        finalSchema.properties[prop.name].required = prop.nestedRequired.map(key => {
          const nestedProp = prop.properties?.find(p => p.key === key);
          return nestedProp?.name || key;
        });
      }
    }
  });

  return JSON.stringify(finalSchema, null, 2);
});

// 向父组件传递事件
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', schema: string): void;
  (e: 'error', message: string): void;
}>();

// 处理确认
const handleConfirm = () => {
  if (!schema.value.properties) {
    emit('error', '请先配置JSON Schema');
    return;
  }
  const schemaStr = formattedSchema.value;
  const codeBlock = `\n\`\`\`json\n${schemaStr}\n\`\`\``;
  emit('confirm', codeBlock);
};

// 处理关闭
const handleClose = () => {
  emit('close');
};

// 点击遮罩层关闭
const handleMaskClick = () => {
  emit('close');
};

// 监听可见性变化
watch(() => props.visible, (newVal) => {
  if (newVal && props.defaultSchema) {
    schema.value = { ...props.defaultSchema };
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
@import '../styles/jsonSchemaModal.css';
</style>
