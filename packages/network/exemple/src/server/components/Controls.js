const { Component } = require('bobecs');

module.exports = class Controls extends Component {
    constructor() {
        super();
        this._top = false;
        this._bottom = false;
        this._left = false;
        this._right = false;
    }

    set top(bool) {
        this._top = bool;
        if (bool) this._bottom = false;
    }

    set bottom(bool) {
        this._bottom = bool;
        if (bool) this._top = false;
    }

    set left(bool) {
        this._left = bool;
        if (bool) this._right = false;
    }

    set right(bool) {
        this._right = bool;
        if (bool) this._left = false;
    }

    setKey(keycode, active) {
        switch (keycode) {
        case 37:
            this.left = active;
            break;
        case 38:
            this.top = active;
            break;
        case 39:
            this.right = active;
            break;
        case 40:
            this.bottom = active;
            break;
        }
    }

    get left() { return this._left; }
    get top() { return this._top; }
    get right() { return this._right; }
    get bottom() { return this._bottom; }
};
