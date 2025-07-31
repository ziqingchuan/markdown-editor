<template>
  <div class="schema-node" :style="{ marginLeft: `${depth * 20}px` }">
    <div class="node-controls">
      <input
          v-model="node.name"
          placeholder="属性名"
          class="property-input"
      >
      <select
          v-model="node.type"
          class="property-select"
          @change="handleTypeChange"
      >
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="boolean">boolean</option>
        <option value="object">object</option>
        <option value="array">array</option>
      </select>

      <label class="checkbox-label">
        必填
        <input
            type="checkbox"
            v-model="node.required"
            class="property-checkbox"
        >
      </label>

      <button
          v-if="node.type === 'object'"
          class="add-child-btn"
          @click="addChild"
      >
        + 子属性
      </button>

      <button
          class="remove-btn"
          @click="remove"
      >
        ×
      </button>
    </div>

    <!-- 递归渲染子节点 -->
    <template v-if="node.type === 'object' && node.properties">
      <SchemaNode
          v-for="child in node.properties"
          :key="child.key"
          :node="child"
          :depth="depth + 1"
          @add-child="handleAddChild"
          @remove="handleRemoveChild"
          @type-change="handleChildTypeChange"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  node: any;
  depth?: number;
}>();

const emit = defineEmits(['add-child', 'remove', 'type-change']);

const depth = ref(props.depth || 0);

const addChild = () => {
  emit('add-child', props.node);
};

const remove = () => {
  emit('remove', props.node.key);
};

const handleTypeChange = () => {
  if (props.node.type === 'object' && !props.node.properties) {
    props.node.properties = [];
  }
  emit('type-change', props.node);
};

const handleAddChild = (parentNode: any) => {
  emit('add-child', parentNode);
};

const handleRemoveChild = (key: string) => {
  emit('remove', key);
};

const handleChildTypeChange = (node: any) => {
  emit('type-change', node);
};
</script>

<style scoped>
@import '../styles/jsonSchemaModal.css';
</style>
