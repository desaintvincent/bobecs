const componentfactory = class ComponentFactory {
    static components() {
        if (!this._components) {
            this._components = new Map();
        }
        return this._components;
    }

    static add(component) {
        this.components().set(component.name.toLowerCase(), component);
    }

    static create(componentName) {
        if (!this.components().has(componentName.toLowerCase())) {
            throw new Error(`"${componentName}" is not declared in the ComponentFactory`);
        }
        const component = this.components().get(componentName.toLowerCase());
        return new component();
    }
};

module.exports = componentfactory;