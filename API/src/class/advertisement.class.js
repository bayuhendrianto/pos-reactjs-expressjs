const { List } = require("./list.class");

class AdvertisementClass {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.name = model.name || null;
    this.description = model.description || null;
    this.expiredAt = model.expiredAt || null;
    this.photoUrl = model.photoUrl || null;
    this.url = model.url || null;
    this.isActive = model.isActive == 1 ? true : false || false;

    this.createdBy = model.createdBy || null;
    this.updatedBy = model.updatedBy || null;
    this.createdAt = model.createdAt || null;
    this.updatedAt = model.updatedAt || null;
    this.deletedAt = model.deletedAt || null;
    
  }
}

class AdvertisementList extends List {
  get model() {
    return AdvertisementClass;
  }
}

module.exports = {
  AdvertisementClass,
  AdvertisementList,
};
