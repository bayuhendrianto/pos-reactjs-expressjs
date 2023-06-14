const { List } = require("./list.class")

class RoleClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.name = model.name || null;
        this.description = model.description || null;
        this.isDefault = model.isDefault == 1 ? true : false;
        this.isActive = model.isActive == 1 ? true : false;
        this.permissions = JSON.parse(model.permissions) || null;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;
    }
}

class RoleList extends List {
    get model() {
        return RoleClass;
    }
}

module.exports = {
    RoleClass,
    RoleList
}