const { Component } = require('bobecs');

module.exports = class Vector2Component extends Component {
    constructor(x = 0, y = 0) {
        super();
        this._x = x;
        this._y = y;
    }

    set(v) {
        this.x = v.x;
        this.y = v.y;
    }

    get() {
        return { x: this.x, y: this.y };
    }

    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    add(v) {
        if (v instanceof Vector2Component) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    }

    sub(v) {
        if (v instanceof Vector2Component) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    }

    multiply(v) {
        if (v instanceof Vector2Component) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    divide(v) {
        if (v instanceof Vector2Component) {
            if(v.x !== 0) this.x /= v.x;
            if(v.y !== 0) this.y /= v.y;
        } else {
            if(v !== 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    }

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.divide(this.length());
    }

    min() {
        return Math.min(this.x, this.y);
    }

    max() {
        return Math.max(this.x, this.y);
    }

    toAngles() {
        return -Math.atan2(-this.y, this.x);
    }

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n) {
        return [this.x, this.y].slice(0, n || 2);
    }

    clone() {
        return new Vector2Component(this.x, this.y);
    }
};