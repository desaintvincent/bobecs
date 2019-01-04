class Component {
    /**
     * @constructor
     */
    constructor() {
        this._dirty = true;
    }

    /**
     * Set the dirtyness of the Component
     * @param {boolean} dirty
     */
    setDirty(dirty = true) {
        this._dirty = dirty;
    }

    /**
     * Return if the Component is dirty
     * @return {boolean}
     */
    isDirty() {
        return this._dirty;
    }

    /**
     * Serialize all Component data
     * @return {Object}
     */
    serialize() {
        const s = {};
        Object.getOwnPropertyNames(this).forEach((key) => {
            if (key !== '_dirty') {
                s[key] =  this[key];
            }
        });
        return s;
    }

    /**
     * Set data to the Component
     * @param {Object} data
     */
    build(data) {
        Object.assign(this, data);
    }

    /**
     * Clone the Component
     * @return {Component}
     */
    clone() {
        const obj = Object.create(this);
        this.constructor.apply(obj);
        obj.build(this.serialize());
        return obj;
    }
}

module.exports = Component;
