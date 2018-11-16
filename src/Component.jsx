export default class Component {
    constructor() {
        this._dirty = true;
    }
    setDirty(dirty = true) {
        this._dirty = dirty;
    }

    isDirty() {
        return this._dirty;
    }

    serialize() {
        const s = {};
        Object.getOwnPropertyNames(this).forEach((key) => {
            if (key !== '_dirty') {
                s[key] =  this[key];
            }
        });
        return s;
    }

    build(data) {
        Object.assign(this, data);
    }

    clone() {
        const obj = Object.create(this);
        this.constructor.apply(obj);
        obj.build(this.serialize());
        return obj;
    }
}
