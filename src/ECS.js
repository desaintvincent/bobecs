const Entity = require('./Entity');

const ecs = class ECS {
    static entities() {
        if (!this._entities) {
            this._entities = new Map();
        }
        return this._entities;
    }

    static entity(id) {
        if (!this._entities) {
            this._entities = new Map();
        }
        return this._entities.get(id);
    }

    static systems() {
        if (!this._systems) {
            this._systems = new Map();
        }
        return this._systems;
    }

    static system(name) {
        if (!this._systems) {
            this._systems = new Map();
        }
        return this._systems.get(name.toLowerCase());
    }

    static createEntity(id = null) {
        const entity = new Entity(id);
        entity.setManager(this);
        this.entities().set(entity._id, entity);
        return entity;
    }

    static removeEntity(entity) {
        const id = (entity instanceof Entity) ? entity._id : entity;
        this.removeEntityFromAllSystems((entity instanceof Entity) ? entity : this.entity(id));
        this.entities().delete(id);
    }

    static addSystem(system, name = null) {
        this.systems().set((name ? name : system.constructor.name).toLowerCase(), system);
    }

    static removeSystem(name) {
        this.systems().delete(name.toLowerCase());
    }

    static hasSystem(name) {
        return this.systems().has(name.toLowerCase());
    }

    static update(deltaTime = 0) {
        this.systems().forEach(s => s.updateAll(deltaTime));
    }

    static addEntityToSystem(entity, systemName) {
        if (!ECS.hasSystem(systemName)) {
            throw new Error(`Tried to add entity to unexisting system ${systemName}`);
        }
        this.system(systemName.toLowerCase()).addEntity(entity);
    }

    static removeEntityFromSystem(entity, systemName) {
        if (!ECS.hasSystem(systemName)) {
            throw new Error(`Tried to remove entity from unexisting system ${systemName}`);
        }
        this.system(systemName.toLowerCase()).removeEntity(entity);
    }

    static removeEntityFromAllSystems(entity) {
        this.systems().forEach(s => s.removeEntity(entity));
    }
};

module.exports = ecs;
