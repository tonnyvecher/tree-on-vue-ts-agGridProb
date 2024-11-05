<template>
  <div>
    <div>{{ text }}</div>
    <div v-if="treeStore.mode === 'EDIT'">
      <button @click="add">add</button>
      <button @click="remove">delete</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTreeStore } from "@/stores/tree";
import { computed } from "vue";

const props = defineProps(["params"]);

const treeStore = useTreeStore();

const text = computed(() => {
  if (!props.params) return "-";

  const hasChildren =
    treeStore.tree.getChildren(props.params.data.id).length > 0;

  return hasChildren ? "Группа" : "Элемент";
});

const add = () => {
  treeStore.tree.addItem({
    id: crypto.randomUUID(),
    label: "Иной айтем",
    parent: props.params.data.id,
  });
};

const remove = () => {
  treeStore.tree.removeItem(props.params.data.id);
};
</script>
