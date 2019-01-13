const { System, ECS } = require('bobecs');
const ClientNetwork = require('../service/ClientNetwork');

module.exports = class Network extends System {
    constructor() {
        super();
    }

    updateEntity(entity, data) {
        if (data.remove) {
            entity.remove();
        } else {
            entity.build(data);
        }
    }

    updateNetwork() {
        while (ClientNetwork._queue.length > 0) {
            const data = ClientNetwork._queue.shift();
            const entity = ECS._entities.find(e => e._id === data._id);
            if (entity) {
                this.updateEntity(entity, data);
            } else if (!data.remove) {
                const newEntity = ECS.createEntity(data._id);
                data._systems.forEach(system => newEntity.addToSystem(system));
                newEntity.build(data);
            }
        }
    }

    postUpdate(deltaTime) {
        ClientNetwork._timer += deltaTime;
        if (ClientNetwork._timer >= 1) {
            ClientNetwork._totalDownSize += ClientNetwork._currentDownSize;
            ClientNetwork._downSpeed = ClientNetwork._currentDownSize;
            ClientNetwork._currentDownSize = 0;
            ClientNetwork._timer = 0;
        }
    }

    updateAll(deltaTime) {
        this._deltaTime += deltaTime;
        if (this._deltaTime >= this._frequency) {
            this.preUpdate(this._deltaTime);
            this.updateNetwork();
            this.postUpdate(this._deltaTime);
            this._deltaTime = 0;
        }
    }
};
