class List {
    constructor(model = []) {
        return model.map(item => new this.model(item))
    }
}

module.exports = { List }