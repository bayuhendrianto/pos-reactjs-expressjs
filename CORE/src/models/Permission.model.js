class PermissionModel {
  constructor(model) {
    model = model || {}
    this.permissionName = model.permissionName || null
    this.permissionView = model.permissionView || false
    this.permissionCreate = model.permissionCreate || false
    this.permissionEdit = model.permissionEdit || false
    this.permissionDelete = model.permissionDelete || false
    this.permissionRole = model.permissionRole || false
    this.permissionPartnerEdit = model.permissionPartnerEdit || false
    this.permissionStatus = model.permissionStatus || false
  }
}

export { PermissionModel }
