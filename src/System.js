module.exports = class System {
    constructor(frequency = 0) {
        this._frequency = frequency;
        this._deltaTime = 0;
        this._entities = [];
    }

    addEntity(entity) {
        this._entities.push(entity);
        this.postAdd(entity);
    }

    removeEntity(entity) {
        let index = this._entities.indexOf(entity);

        if (~index) {
            this._entities.splice(index, 1);
            this.postRemove(entity);
        }
    }

    updateAll(deltaTime) {
        this._deltaTime += deltaTime;
        if (this._deltaTime >= this._frequency) {
            this.preUpdate(this._deltaTime);

            for (let i = 0; i < this._entities.length; i += 1) {
                this.update(this._entities[i], this._deltaTime);
            }

            this.postUpdate(this._deltaTime);
            this._deltaTime = 0;
        }
    }

    update(entity, deltaTime) {}
    preUpdate(deltaTime) {}
    postUpdate(deltaTime) {}
    postAdd(entity) {}
    postRemove(entity) {}
};
