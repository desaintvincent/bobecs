const { Component } = require('bobecs');

module.exports = class Player extends Component {
    constructor(id) {
        super();
        this._id = id;
    }
};