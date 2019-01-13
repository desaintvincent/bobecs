const { Component } = require('bobecs');

module.exports = class Score extends Component {
    constructor(score = 0) {
        super();
        this._score = score;
    }

    set(value) {
        this._score = value;
        this.setDirty(true);
        return this;
    }

    add(value) {
        this._score += value;
        this.setDirty(true);
        return this;
    }

    sub(value) {
        this._score -= value;
        this.setDirty(true);
        return this;
    }

    get() {
        return this._score;
    }
};