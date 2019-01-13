const Vector2Component = require('./Vector2Component');

module.exports = class Acceleration extends Vector2Component {
    constructor(max, x = 0, y = 0) {
        super(x, y);
        this._max = max;
    }

    set max(value) {
        this._max = value;
    }

    get max() {
        return this._max;
    }
};