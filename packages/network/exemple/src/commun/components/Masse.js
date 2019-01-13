const { Component } = require('bobecs');

module.exports = class Masse extends Component {
    constructor(masse = 1) {
        super();
        this._masse = masse;
        this._inf = false;
    }

    set(m) {
        this._masse = m;
    }

    get() {
        return this._masse;
    }

    get inf() {
        return this._inf;
    }

    setInf(value = true) {
        this._inf = value;
        return this;
    }
};