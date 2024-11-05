var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var items = [
    { id: 1, parent: null, label: "Айтем 1" },
    { id: "2", parent: 1, label: "Айтем 2" },
    { id: 3, parent: 1, label: "Айтем 3" },
    { id: 4, parent: "2", label: "Айтем 4" },
    { id: 5, parent: "2", label: "Айтем 5" },
    { id: 6, parent: "2", label: "Айтем 6" },
    { id: 7, parent: 4, label: "Айтем 7" },
    { id: 8, parent: 4, label: "Айтем 8" },
];
var TreeStore = /** @class */ (function () {
    function TreeStore(items) {
        this.history = [];
        this.future = [];
        this.items = items;
    }
    TreeStore.prototype.getAll = function () {
        return this.items;
    };
    TreeStore.prototype.getItem = function (id) {
        return this.items.find(function (item) { return item.id === id; });
    };
    TreeStore.prototype.getChildren = function (id) {
        return this.items.filter(function (item) { return item.parent === id; });
    };
    TreeStore.prototype.getAllChildren = function (id) {
        var _this = this;
        var children = this.getChildren(id);
        return children.reduce(function (acc, child) {
            return acc.concat(child, _this.getAllChildren(child.id));
        }, []);
    };
    TreeStore.prototype.getAllParents = function (id) {
        var item = this.getItem(id);
        if (!item)
            return [];
        if (item.parent == null)
            return [item];
        var parent = this.getItem(item.parent);
        return parent ? __spreadArray([item], this.getAllParents(parent.id), true) : [];
    };
    // Добавляет новый элемент и сохраняет в историю для возможности отмены
    TreeStore.prototype.addItem = function (newItem) {
        this.items.push(newItem);
        this.history.push(__spreadArray([], this.items, true));
        this.future = [];
    };
    // Удаляет элемент и всех его дочерних элементов по id и сохраняет в историю
    TreeStore.prototype.removeItem = function (id) {
        var itemToRemove = this.getItem(id);
        if (!itemToRemove)
            return;
        var itemsToRemove = __spreadArray([itemToRemove], this.getAllChildren(id), true);
        this.history.push(__spreadArray([], this.items, true));
        this.items = this.items.filter(function (item) { return !itemsToRemove.includes(item); });
        this.future = [];
    };
    Object.defineProperty(TreeStore.prototype, "canUndo", {
        get: function () {
            return this.history.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    TreeStore.prototype.undo = function () {
        if (!this.canUndo)
            return;
        this.future.push(__spreadArray([], this.items, true));
        this.items = this.history.pop();
    };
    Object.defineProperty(TreeStore.prototype, "canRedo", {
        get: function () {
            return this.future.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    // Повтор последнего отмененного изменения
    TreeStore.prototype.redo = function () {
        if (!this.canRedo)
            return;
        this.history.push(__spreadArray([], this.items, true));
        this.items = this.future.pop();
    };
    return TreeStore;
}());
var treeStore = new TreeStore(items);
treeStore.removeItem("2");
console.log(treeStore.getAll());
treeStore.undo();
console.log(treeStore.getAll());
