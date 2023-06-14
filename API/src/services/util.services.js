function GetPagingData(data, limit) {
    const { count: totalItems, rows: result } = data;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages, result };
};

function GetPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

module.exports = {
    GetPagingData,
    GetPagination
}