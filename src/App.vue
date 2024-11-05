<template>
  <div>
    <button v-if="treeStore.mode === 'VIEW'" @click="treeStore.mode = 'EDIT'">
      В режим просмотра
    </button>
    <button v-if="treeStore.mode === 'EDIT'" @click="treeStore.mode = 'VIEW'">
      В режим редактирования
    </button>
    <button @click="undo" :disabled="!treeStore.tree.canUndo">Назад</button>
    <button @click="redo" :disabled="!treeStore.tree.canRedo">Вперед</button>

    <AgGridVue
      :columnDefs="columnDefs"
      :rowData="rowData"
      style="height: 500px; border: 1px solid black; border-collapse: collapse"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import SomeComp from "./components/SomeComp.vue";
import { useTreeStore, type TreeNode } from "./stores/tree";

const treeStore = useTreeStore();

const rowData = computed(() => treeStore.tree.items);

const columnDefs = ref([
  {
    headerName: "№ п/п",
    valueGetter: ({ data }: { data: TreeNode }) => data.id,
  },
  {
    headerName: "Категория",
    cellRenderer: SomeComp,
  },
  { headerName: "Название", field: "label" },
]);

function undo() {
  treeStore.tree.undo();
}

function redo() {
  treeStore.tree.redo();
}
</script>
