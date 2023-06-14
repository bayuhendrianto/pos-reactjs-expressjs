const { List } = require("./list.class");

class PermissionClass {
  constructor(model) {
    model = model || {};
    this.permissionName = model.permissionName || "";
    this.permissionCreate = model.permissionCreate || false;
    this.permissionEdit = model.permissionEdit || false;
    this.permissionDelete = model.permissionDelete || false;
  }
}

class PermissionList extends List {
  get model() {
    return PermissionClass;
  }
}

function GenerateDefaultRolePermission() {
  return {
    name: "Administrator",
    description: "Administrator",
    isDefault: false,
    isActive: true,
    permissions: JSON.stringify(
      [{"permissionName":"Dashboard","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true},{"permissionName":"Employee","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionRole":true},{"permissionName":"Driver","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true},{"permissionName":"Schedule","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true},{"permissionName":"Booking","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true},{"permissionName":"Wallet","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"BankAccount","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Income","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Withdrawal","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Finance","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true},{"permissionName":"Role","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true},{"permissionName":"Vehicle","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true}]
    ),
  };
}



function PermissionDefaultList() {
  return new PermissionList([
    {
      permissionName: "Dashboard",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
    {
      permissionName: "Employee",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
      permissionRole: false,
    },
    {
      permissionName: "Driver",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
    {
      permissionName: "Schedule",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
    {
      permissionName: "Booking",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
    {
      permissionName: "Finance",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
    {
      permissionName: "Role",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
    {
      permissionName: "Vehicle",
      permissionView: false,
      permissionCreate: false,
      permissionEdit: false,
      permissionDelete: false,
    },
  ]);
}

module.exports = {
  PermissionClass,
  PermissionList,
  GenerateDefaultRolePermission,
  PermissionDefaultList,
};
