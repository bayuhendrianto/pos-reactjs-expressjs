const { List } = require("./list.class");

class CategoryClass {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.name = model.name || null;
    this.code = model.code || null;
    this.normalizeCode = model.normalizeCode || null;
    this.normalizeName = model.normalizeName || null;
    this.thumb = model.thumb || null;

    this.createdBy = model.createdBy || null;
    this.updatedBy = model.updatedBy || null;
    this.createdAt = model.createdAt || null;
    this.updatedAt = model.updatedAt || null;
    this.deletedAt = model.deletedAt || null;
    
  }
}

class CategoryList extends List {
  get model() {
    return CategoryClass;
  }
}

module.exports = {
    CategoryClass,
    CategoryList,
};
