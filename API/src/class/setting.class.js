const { List } = require("./list.class");

class SettingClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.companyId = model.companyId || null;
        this.adminFeeServices = model.adminFeeServices || null;
        this.adminFeeServicesPercent = model.adminFeeServicesPercent || null;
        this.adminFeeInsurance = model.adminFeeInsurance || null;
        this.adminFeeInsurancePercent = model.adminFeeInsurancePercent || null;
        this.premiInsurance = model.premiInsurance || null;
        this.premiInsurancePercent = model.premiInsurancePercent || null;
        this.costPerKilometer = model.costPerKilometer || null;
        this.paymentPeriodExpired = model.paymentPeriodExpired || null;
        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
    }
}

class SettingClassList extends List {
    get model() {
        return SettingClass;
    }
}

module.exports = {
    SettingClass,
    SettingClassList,
};
