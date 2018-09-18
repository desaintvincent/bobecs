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
}
