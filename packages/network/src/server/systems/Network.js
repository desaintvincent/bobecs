const ServerNetwork = require('../services/ServerNetwork');

const { System } = require('bobecs');

module.exports = class Network extends System {
    constructor() {
        super();
    }

    serializeEntity(entity) {
        const networkData = entity.get('NetworkData');
        const obj = {
            _id: entity._id,
            _tags: entity._tags,
            _components: {},
            _systems: networkData._systems
        };
        networkData._components.forEach((key) => {
            obj._components[key] = entity._components[key].serialize();
        });
        networkData.setDirty(false);
        return obj;
    }

    lightSerializeEntity(entity) {
        const networkData = entity.get('NetworkData');
        const obj = {
            _id: entity._id,
            _components: {},
        };
        networkData._components.filter(key => entity.get(key).isDirty()).forEach((key) => {
            obj._components[key] = entity.get(key).serialize();
            entity.get(key).setDirty(false);
        });
        return obj;
    }

    update(e, deltaTime) {
        if (!e.has('NetworkData')) {
            return;
        }

        const isNewEntity = e.get('NetworkData').isDirty();
        let serialized = null;
        let lightSerialized = null;

        ServerNetwork.getClients().forEach((ws, id) => {
            if (ServerNetwork.isNew(id) || isNewEntity) {
                if (!serialized) {
                    serialized = this.serializeEntity(e);
                }
                ServerNetwork.sendQueue(id, 'ecs', serialized);
            } else {
                if (!lightSerialized) {
                    lightSerialized = this.lightSerializeEntity(e);
                }
                if (Object.keys(lightSerialized._components).length > 0) {
                    ServerNetwork.sendQueue(id, 'ecs', lightSerialized);
                }
            }
        });
        e.get('NetworkData').setDirty(false);
    }

    postUpdate(deltaTime) {
        ServerNetwork.getClients().forEach((ws, id) => {
            ServerNetwork.emptyQueue(id);
        });
        ServerNetwork.getClients().forEach((ws, id) => {
            if (ServerNetwork.isNew(id)) {
                ServerNetwork.setNew(id, false);
            }
        });
    }

    postRemove(e) {
        ServerNetwork.sendAllQueue('ecs', { _id: e._id, remove: true });
    }
};

