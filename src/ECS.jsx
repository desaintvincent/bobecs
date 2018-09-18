import Entity from './Entity';

class ECS {
    static createEntity(id = null) {
        const entity = new Entity(id);
        entity.setManager(this);
        ECS._entities.push(entity);
        return entity;
    }

    static removeEntity(entity) {
        let index = this._entities.indexOf(entity);
        if (!~index) {
            throw new Error('Tried to remove entity not in list');
        }
        this.removeEntityFromAllSystems(entity);
        this._entities.splice(index, 1);
    }

    static addSystem(system) {
        ECS._systems[system.constructor.name.toLowerCase()] = system;
    }

    static removeSystem(systemName) {
        delete ECS._systems[systemName.toLowerCase()];
    }

    static hasSystem(systemName) {
        return ECS._systems.hasOwnProperty(systemName.toLowerCase());
    }

    static update(deltaTime = 0) {
        for (let systemName in ECS._systems) {
            if (ECS._systems.hasOwnProperty(systemName)) {
                ECS._systems[systemName].updateAll(deltaTime);
            }
        }
    }

    static addEntityToSystem(entity, systemName) {
        if (!ECS.hasSystem(systemName)) {
            throw new Error(`Tried to add entity to unexisting system ${systemName}`);
        }
        ECS._systems[systemName.toLowerCase()].addEntity(entity);
    }

    static removeEntityFromSystem(entity, systemName) {
        if (!ECS.hasSystem(systemName)) {
            throw new Error(`Tried to remove entity from unexisting system ${systemName}`);
        }
        ECS._systems[systemName.toLowerCase()].removeEntity(entity);
    }

    static removeEntityFromAllSystems(entity) {
        for (let systemName in ECS._systems) {
            if (ECS._systems.hasOwnProperty(systemName)) {
                this.removeEntityFromSystem(entity, systemName);
            }
        }
    }
}

ECS._entities = [];
ECS._systems = {};

export default ECS;
