const { List } = require("./list.class")

class UserClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.email = model.email || null;
        this.password = null;
        this.photoUrl = model.photoUrl || "https://storage.dayanatura.com/assets/users/user.png";
        this.providerId = model.providerId || null;
        this.emailVerified = model.emailVerified || null;
        this.documentVerified = model.documentVerified || "reviewed"
        this.disable = model.disable || false;
        this.firstSignInAt = model.firstSignInAt || null;
        this.lastSignInAt = model.lastSignInAt || null;
        this.group = model.group || "others";
        this.role = model.role || null;
        this.deviceTokenId = model.deviceTokenId || null;
        this.fullName = model.fullName || null;
        this.firstName = model.firstName || null;
        this.lastName = model.lastName || null;
        this.motherName = model.motherName || null;
        this.birthDate = model.birthDate || null;
        this.birthPlace = model.birthPlace || null;
        this.gender = model.gender || null;
        this.religion = model.religion || null;
        this.npwp = model.npwp || null;
        this.identityType = model.identityType || "KTP";
        this.identityNumber = model.identityNumber || null;
        this.userNumber = model.userNumber || null;
        this.phoneNumber = model.phoneNumber || null;
        this.phoneNumberVerification = model.phoneNumberVerification || false;
        this.address = model.address || null;
        this.subDistrict = model.subDistrict || null;
        this.subDistrictId = model.subDistrictId || null;
        this.districtId = model.districtId || null;
        this.district = model.district || null;
        this.city = model.city || null;
        this.cityId = model.cityId || null;
        this.province = model.province || null;
        this.provinceId = model.provinceId || null;
        this.postalCode = model.postalCode || null;
        this.countryId = model.countryId || null;
        this.countryName = model.countryName || null;
        this.lat = model.lat || null;
        this.lng = model.lng || null;
        this.companyId = model.companyId || null;
        this.companyName = model.companyName || null;
        this.scheduleId = model.scheduleId || null;
        this.tenantId = model.tenantId || null;
        this.cardNumber = model.cardNumber || null;
        this.cardType = model.cardType || null;
        this.cardPointReward = model.cardPointReward || null;
        this.cardPointReedem = model.cardPointReedem || null;
        this.cardPointBalance = model.cardPointBalance || null;
        this.financeBalance = model.financeBalance || null;
        this.financeBalanceLastUsed = model.financeBalanceLastUsed || null;
        this.totalRating = model.totalRating || null;
        this.transactionFirstAt = model.transactionFirstAt || null;
        this.transactionLastAt = model.transactionLastAt || null;
        this.transactionTotal = model.transactionTotal || null;

        this.linkedIn = model.linkedIn || null;
        this.facebook = model.facebook || null;
        this.twitter = model.twitter || null;
        this.instagram = model.instagram || null;
        this.tiktok = model.tiktok || null;

        this.sendEmailRegister = model.sendEmailRegister || false;
        this.status = model.status || 'active';

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;

        this.refresh_token = model.refresh_token || null;

        this.documents = model.documents || []
    }
}

class UserList extends List {
    get model() {
        return UserClass;
    }
}

module.exports = {
    UserClass,
    UserList
}