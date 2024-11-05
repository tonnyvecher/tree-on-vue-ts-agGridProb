import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export type TreeNode = {
  id: string | number;
  parent: string | number | null;
  label: string;
};

export class Tree {
  items: TreeNode[];
  private history: TreeNode[][] = [];
  private future: TreeNode[][] = [];

  constructor(items: TreeNode[]) {
    this.items = items;
  }

  getAll(): TreeNode[] {
    return this.items;
  }

  getItem(id: string | number): TreeNode | undefined {
    return this.items.find((item) => item.id === id);
  }

  getChildren(id: string | number): TreeNode[] {
    return this.items.filter((item) => item.parent === id);
  }

  getAllChildren(id: string | number): TreeNode[] {
    const children = this.getChildren(id);
    return children.reduce((acc, child) => {
      return acc.concat(child, this.getAllChildren(child.id));
    }, [] as TreeNode[]);
  }

  getAllParents(id: string | number): TreeNode[] {
    const item = this.getItem(id);
    if (!item) return [];

    if (item.parent == null) return [item];

    const parent = this.getItem(item.parent);
    return parent ? [item, ...this.getAllParents(parent.id)] : [];
  }

  // Добавляет новый элемент и сохраняет в историю для возможности отмены
  addItem(newItem: TreeNode): void {
    this.items = [...this.items, newItem];
    this.history.push([...this.items]);
    this.future = [];
  }

  // Удаляет элемент и всех его дочерних элементов по id и сохраняет в историю
  removeItem(id: string | number): void {
    const itemToRemove = this.getItem(id);

    if (!itemToRemove) return;

    const itemsToRemove = [itemToRemove, ...this.getAllChildren(id)];
    this.history.push([...this.items]);
    this.items = this.items.filter(
      (item) => !itemsToRemove.some((el) => el.id === item.id)
    );
    this.future = [];
  }

  get canUndo() {
    return this.history.length > 0;
  }

  undo() {
    if (!this.canUndo) return;

    this.future.push([...this.items]);
    this.items = this.history.pop()!;
  }

  get canRedo() {
    return this.future.length > 0;
  }

  redo() {
    if (!this.canRedo) return;

    this.history.push([...this.items]);
    this.items = this.future.pop()!;
  }
}

const fakeData = [
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "2", parent: 1, label: "Айтем 2" },
  { id: 3, parent: 1, label: "Айтем 3" },
  { id: 4, parent: "2", label: "Айтем 4" },
  { id: 5, parent: "2", label: "Айтем 5" },
  { id: 6, parent: "2", label: "Айтем 6" },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" },
];

export const useTreeStore = defineStore("tree", () => {
  const mode = ref<"VIEW" | "EDIT">("VIEW");

  const tree = reactive(new Tree(fakeData));

  return {
    tree,
    mode,
  };
});
