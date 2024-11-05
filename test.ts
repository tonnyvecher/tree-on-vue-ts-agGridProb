type TreeNode = {
  id: string | number;
  parent: string | number | null;
  label: string;
};

export class TreeStore {
  private items: TreeNode[];
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
    this.items.push(newItem);
    this.history.push([...this.items]);
    this.future = [];
  }

  // Удаляет элемент и всех его дочерних элементов по id и сохраняет в историю
  removeItem(id: string | number): void {
    const itemToRemove = this.getItem(id);

    if (!itemToRemove) return;

    const itemsToRemove = [itemToRemove, ...this.getAllChildren(id)];
    this.history.push([...this.items]);
    this.items = this.items.filter((item) => !itemsToRemove.includes(item));
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
