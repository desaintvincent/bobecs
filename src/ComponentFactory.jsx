class ComponentFactory {
    static add(component) {
        this._components[component.name.toLowerCase()] = component;
    }

    static create(componentName) {
        if (!this._components.hasOwnProperty(componentName)) {
            throw new Error(`"${componentName}" is not declared in the ComponentFactory`);
        }
        return new this._components[componentName.toLowerCase()]();
    }
}

ComponentFactory._components = {};

export default ComponentFactory;