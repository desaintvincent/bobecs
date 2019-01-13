const { Component } = require('bobecs');

module.exports = class Radius extends Component {
    constructor(r) {
        super();
        this.r = r;
    }
};