const { List } = require("./list.class");

class DocumentClass {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.name = model.name || null;
    this.companyId = model.companyId || null;
    this.userId = model.userId || null;
    this.employeeId = model.employeeId || null;
    this.customerId = model.customerId || null;
    this.supplierId = model.supplierId || null;
    this.url = model.url || null;
    this.path = model.path || null;
    this.status = model.status || null;
    this.comment = model.comment || null;
    this.isActive = model.isActive == 1 ? true : false || false;
    this.exifData = model.exifData || null;
  }
}

class DocumentClassList extends List {
  get model() {
    return DocumentClass;
  }
}

module.exports = {
  DocumentClass,
  DocumentClassList,
};
