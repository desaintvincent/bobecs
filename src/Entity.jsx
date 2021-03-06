import ComponentFactory from './ComponentFactory';

export default class Entity {
    constructor(id = null) {
        this._id = (id === null ?(+new Date()).toString(16) +
            (Math.random() * 100000000 | 0).toString(16) +
            Entity.count() : id);
        this._tags = [];
        this._manager = null;
        this._components = {};
    }

    static count() {
        if (!this._count) {
            this._count = 0;
        }
        this._count = this._count + 1;
        return this._count;
    }

    setManager(manager) {
        this._manager = manager;
    }

    addComponent(component) {
        component._dirty = true;
        this._components[component.constructor.name.toLowerCase()] = component;
        return this;
    }

    removeComponent(componentName) {
        delete this._components[componentName.toLowerCase()];
        return this;
    }

    hasComponent(componentName) {
        return this._components.hasOwnProperty(componentName.toLowerCase());
    }

    getComponent(componentName) {
        if (!this.hasComponent(componentName)) {
            throw new Error(`Tried to get unexisting component "${componentName}" in entity ${this._id}`);
        }
        return this._components[componentName.toLowerCase()];
    }

    addTag(tag) {
        this._tags.push(tag);
        return this;
    }

    removeTag(tag) {
        let index = this._tags.indexOf(tag);

        if (~index) {
            this._tags.splice(index, 1);
        }
        return this;
    }

    hasTag(tag) {
        return this._tags.indexOf(tag) > -1;
    }

    remove() {
        this._manager.removeEntity(this);
    }

    addToSystem(systemName) {
        this._manager.addEntityToSystem(this, systemName);
        return this;
    }

    get(componentName) {
        return this.getComponent(componentName);
    }

    add(component) {
        return this.addComponent(component);
    }

    has(componentName) {
        return this.hasComponent(componentName);
    }

    serialize() {
        const obj = {
            _tags: this._tags,
            _components: {}
        };
        Object.keys(this._components).forEach((key) => {
            obj._components[key] = this._components[key].serialize();
        });
        return obj;
    }

    build(data) {
        Object.assign(this._tags, data._tags);
        Object.keys(data._components).forEach((key) => {
            this._components[key] = ComponentFactory.create(key);
            this._components[key].build(data._components[key]);
        });
    }

    clone() {
        const e = this._manager.createEntity();
        e.build(this.serialize());
        return e;
    }
}
