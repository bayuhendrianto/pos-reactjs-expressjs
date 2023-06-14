const { List } = require("./list.class");

class NotificationClass {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.userId = model.userId || null;
    this.companyId = model.companyId || null;
    this.name = model.name || null;
    this.messages = model.messages || null;
    this.url = model.url || null;
    this.type = model.type || null;
    this.dataId = model.dataId || null;
    this.photoUrl = model.photoUrl || null;
    this.isOpen = model.isOpen == 1 ? true : false || false;
  }
}

class NotificationClassList extends List {
  get model() {
    return NotificationClass;
  }
}

module.exports = {
  NotificationClass,
  NotificationClassList,
};
