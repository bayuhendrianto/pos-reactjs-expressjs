
function dateId(d) {
    const today = d !== undefined ? new Date(d) : new Date(),
        year = today.getFullYear().toString(),
        month = ('0' + (today.getMonth() + 1)).slice(-2),
        date = ('0' + (today.getDate())).slice(-2),
        yearly = `${year}`,
        monthly = `${year}_${month}`,
        daily = `${year}_${month}_${date}`,
        number = `${year}${month}${date}00001`;

    return {
        year: year,
        month: month,
        date: date,
        yearly: yearly,
        monthly: monthly,
        daily: daily,
        number: number
    }
}

function sortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

function generateEntityChange(before, after) {
    return new Promise((resolve, reject) => {
        before = sortObj(before);
        after = sortObj(after);

        let result = new Array();
        for (let key in before) {
            if (before[key] !== after[key] && key !== "createdAt" && key !== "deletedAt"&& key !== "updatedAt") {
                result.push({
                    before: { field: key, value: before[key] },
                    after: { field: key, value: after[key] }
                })
            }

            if (key === Object.keys(before)[Object.keys(before).length - 1]) {

                let data = {
                    before: {},
                    after: {}
                }

                result.forEach((item, index) => {
                    data.before[`${item.before.field}`] = item.before.value;
                    data.after[`${item.after.field}`] = item.after.value;

                    if (index === (result.length - 1)) {
                        resolve(JSON.stringify(data))
                    }
                })
            }
        }
    })
}

function randomNumbersLetters(length) {
    var text = '',
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function randomNumbersLettersForPassword(length) {
    var text = '',
        possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = {
    dateId,
    generateEntityChange,
    randomNumbersLetters,
    randomNumbersLettersForPassword
}