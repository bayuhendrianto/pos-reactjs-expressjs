class List {
    constructor(model = []) {
        return model.map(item => new this.model(item))
    }
}

export default List;