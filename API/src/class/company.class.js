const { List } = require("./list.class");


class CompanyClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.name = model.name || null;
        this.brand = model.brand || null;
        this.code = model.code || null;
        this.email = model.email || null;
        this.address = model.address || null;
        this.subDistrict = model.subDistrict || null;
        this.subDistrictId = model.subDistrictId || null;
        this.district = model.district || null;
        this.districtId = model.districtId || null;
        this.city = model.city || null;
        this.cityId = model.cityId || null;
        this.province = model.province || null;
        this.provinceId = model.provinceId || null;
        this.postalCode = model.postalCode || null;
        this.countryId = model.countryId || null;
        this.countryName = model.countryName || null;
        this.lat = model.lat || null;
        this.lng = model.lng || null;
        this.phoneNumber = model.phoneNumber || null;
        this.phoneNumberVerification = model.phoneNumberVerification || false;
        this.fax = model.fax || null;
        this.npwp = model.npwp || null;
        this.officeTelp = model.officeTelp || null;
        this.website = model.website || null;

        this.linkedIn = model.linkedIn || null;
        this.facebook = model.facebook || null;
        this.twitter = model.twitter || null;
        this.instagram = model.instagram || null;
        this.tiktok = model.tiktok || null;

        this.deviceTokenId = model.deviceTokenId || null;
        this.photoUrl = model.photoUrl || null;
        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.scheduleMadeBefore = model.scheduleMadeBefore || null;
        this.status = model.status || 'active'
        this.deletedAt = model.deletedAt || null;
        this.documents = model.documents || []
    }
}

class CompanyList extends List {
    get model() {
        return CompanyClass;
    }
}

module.exports = {
    CompanyClass,
    CompanyList
}