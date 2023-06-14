const { List } = require("./list.class");

class UnitClass {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.name = model.name || null;
    this.code = model.code || null;

    this.createdBy = model.createdBy || null;
    this.updatedBy = model.updatedBy || null;
    this.createdAt = model.createdAt || null;
    this.updatedAt = model.updatedAt || null;
    this.deletedAt = model.deletedAt || null;
    
  }
}

class UnitList extends List {
  get model() {
    return UnitClass;
  }
}

module.exports = {
    UnitClass,
    UnitList,
};
