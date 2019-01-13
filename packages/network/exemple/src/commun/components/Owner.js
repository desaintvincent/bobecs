const { Component, ECS, Entity } = require('bobecs');

module.exports = class Owner extends Component {
    constructor(id) {
        super();
        this._id = (id instanceof Entity) ? id._id : id;
    }

    get() {
        return ECS._entities.find((e => e._id === this._id));
    }
};