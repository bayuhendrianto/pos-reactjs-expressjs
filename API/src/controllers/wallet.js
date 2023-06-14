const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Wallets, Withdrawals, IncomeHistories, BankAccounts } = require("../models/wallet.model");
const { Companies } = require("../models/company.model");

router.get("/core", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const wallets = await Wallets.findAndCountAll({
            order: [["withdrawalCreatedAt", "ASC"]],
            limit: limit,
            offset: offset,
        });

        const response = GetPagingData(wallets, limit);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.get("/all", async (req, res) => {
    const companyId = req.headers["companyid"];

    if (companyId == null || companyId == undefined) {
        return res.status(404).json("Not found !");
    }

    try {
        const wallets = await Wallets.findOne({
            where: {
                companyId: companyId
            }
        });
        res.json(wallets);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/income-core", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const incomes = await IncomeHistories.findAndCountAll({
            order: [["createdAt", "DESC"]],
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(incomes, limit);
        res.json(response);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/income", async (req, res) => {
    const companyId = req.headers["companyid"];
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    if (companyId == null || companyId == undefined) {
        return res.status(404).json("Not found !");
    }

    try {
        const incomes = await IncomeHistories.findAndCountAll({
            order: [["createdAt", "DESC"]],
            where: {
                companyId: companyId
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(incomes, limit);
        res.json(response);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/withdrawal-core", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const withdrawals = await Withdrawals.findAndCountAll({
            order: [["createdAt", "DESC"]],
            where: {
                [Op.or]: [
                    {
                        status: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    }
                ],
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(withdrawals, limit);
        res.json(response);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/withdrawal-all", async (req, res) => {
    const companyId = req.headers["companyid"];
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    if (companyId == null || companyId == undefined) {
        return res.status(404).json("Not found !");
    }

    try {
        const withdrawals = await Withdrawals.findAndCountAll({
            order: [["createdAt", "DESC"]],
            where: {
                companyId: companyId,
                [Op.or]: [
                    {
                        status: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    }
                ],
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(withdrawals, limit);
        res.json(response);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/withdrawal/:id/:companyId", async (req, res) => {
    const { id, companyId } = req.params;

    try {
        const withdrawal = await Withdrawals.findByPk(id);
        const company = await Companies.findByPk(companyId, { attributes: ['id', 'name', 'brand', 'code', 'email', 'phoneNumber'] });

        res.status(200).json({
            withdrawal: withdrawal,
            company: company
        })

    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/bank-account-core", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const withdrawals = await BankAccounts.findAndCountAll({
            order: [["bank", "ASC"]],
            where: {
                [Op.or]: [
                    {
                        bank: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    }
                ],
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(withdrawals, limit);
        res.json(response);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/bank-account-all", async (req, res) => {
    const companyId = req.headers["companyid"];
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    if (companyId == null || companyId == undefined) {
        return res.status(404).json("Not found !");
    }

    try {
        const bankAccount = await BankAccounts.findAndCountAll({
            order: [["bank", "ASC"]],
            where: {
                companyId: companyId,
                [Op.or]: [
                    {
                        bank: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    }
                ],
            },
            limit: limit,
            offset: offset,
        });

        const response = GetPagingData(bankAccount, limit);
        res.json(response);

    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.post("/new-withdrawal", async (req, res) => {
    let withdrawalData = req.body;
    withdrawalData['id'] = uuid();

    let _transactionWithdrawal = await Withdrawals.sequelize.transaction(),
        _transactionWallet = await Wallets.sequelize.transaction();

    try {
        const wallets = await Wallets.findOne({
            where: {
                companyId: withdrawalData['companyId']
            }
        });

        let walletData = wallets['dataValues'];
        walletData['totalAmount'] = parseInt(walletData['totalAmount']) - parseInt(withdrawalData['totalWithdrawal']);
        walletData['totalWithdrawal'] = parseInt(walletData['totalWithdrawal']) + parseInt(withdrawalData['totalWithdrawal']);
        walletData['lastCredit'] = parseInt(withdrawalData['totalWithdrawal']);

        Withdrawals.create(withdrawalData, _transactionWithdrawal);
        Wallets.update(walletData, { where: { id: walletData['id'] } }, _transactionWallet);


        await Promise.all([
            _transactionWallet.commit(),
            _transactionWithdrawal.commit()
        ])

        res.status(200).json({ meesage: 'Request withdrawal successfully' })
    } catch (error) {
        await Promise.all([
            _transactionWallet.rollback(),
            _transactionWithdrawal.rollback()
        ])

        res.status(400).json({ meesage: 'Error request withdrawal', error: error })
    }
})

router.put("/update-withdrawal", async (req, res) => {
    let withdrawalData = req.body;

    let _transactionWithdrawal = await Withdrawals.sequelize.transaction(),
        _transactionWallet = await Wallets.sequelize.transaction();

    try {

        const wallets = await Wallets.findOne({
            where: {
                companyId: withdrawalData['companyId']
            }
        });
        let walletData = wallets['dataValues'];

        switch (withdrawalData["status"]) {
            case "success":
                walletData['firstCredit'] = isNaN(parseInt(walletData['firstCredit'])) || parseInt(walletData['firstCredit']) === 0 ? parseInt(withdrawalData['totalWithdrawal']) : parseInt(walletData['firstCredit']);
                break;

            case "reject":
                walletData['totalAmount'] = parseInt(walletData['totalAmount']) + parseInt(withdrawalData['totalWithdrawal']);
                walletData['totalWithdrawal'] = parseInt(walletData['totalWithdrawal']) - parseInt(withdrawalData['totalWithdrawal']);
                walletData['lastCredit'] = parseInt(walletData['lastCredit']) - parseInt(withdrawalData['totalWithdrawal']);
                break;

            default:
                break;
        }

        Withdrawals.update(withdrawalData, {
            where: { id: withdrawalData['id'] }
        }, _transactionWithdrawal)
        Wallets.update(walletData, { where: { id: walletData['id'] } }, _transactionWallet);

        await Promise.all([
            _transactionWallet.commit(),
            _transactionWithdrawal.commit()
        ])

        return res.status(200).json({ meesage: 'Update withdrawal successfully' });

    } catch (error) {
        await Promise.all([
            _transactionWallet.rollback(),
            _transactionWithdrawal.rollback()
        ])
        res.status(400).json({ meesage: 'Error update withdrawal' })
    }
})

router.post("/new-bank-account", async (req, res) => {
    let accountNumberData = req.body;
    accountNumberData['id'] = uuid();

    try {
        await BankAccounts.create(accountNumberData);
        res.status(200).json({ meesage: 'Bank account created' })
    } catch (error) {
        res.status(400).json({ meesage: 'Error create bank account' })
    }
})

router.put("/update-bank-account", async (req, res) => {
    let accountNumberData = req.body;

    try {
        await BankAccounts.update(accountNumberData, {
            where: {
                id: accountNumberData['id']
            }
        });
        res.status(200).json({ meesage: 'Update bank account successfully' })
    } catch (error) {
        res.status(400).json({ meesage: 'Error update bank account' })
    }
})

router.get("/totalAmount", async (req, res) => {
    try {
        const totalAmount = await Wallets.sum("totalAmount");
        const totalAdminFee = await IncomeHistories.sum("adminFee");
        const withdrawal = await Withdrawals.sum("totalWithdrawal", {
            where: {
                status: {
                    [Op.ne]: "reject"
                }
            }
        });

        const response = {
            totalAmount: parseInt(totalAmount),
            totalAllAmount: totalAmount + totalAdminFee + withdrawal,
            totalAdminFee: totalAdminFee,
            withdrawal: withdrawal
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ meesage: 'error get total amount' })
    }
})

module.exports = router;
