class WalletModel {
    constructor(model) {
        model = model || {}
        this.id = model.id || null;
        this.companyId = model.companyId || null;
        this.totalAmount = model.totalAmount || 0;
        this.totalWithdrawal = model.totalWithdrawal || 0;
        this.firstCredit = model.firstCredit || 0;
        this.lastCredit = model.lastCredit || 0;
        this.firstDebit = model.firstDebit || 0;
        this.lastDebit = model.lastDebit || 0;
        this.withdrawalByUserId = model.withdrawalByUserId || null;
        this.withdrawalBy = model.withdrawalBy || null;
        this.withdrawalCreatedAt = model.withdrawalCreatedAt || null;
    }
}

export { WalletModel }
