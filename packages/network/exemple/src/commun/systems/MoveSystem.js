const { System } = require('bobecs');

module.exports = class MoveSystem extends System {
    update(entity, deltaTime) {
        const pos = entity.get('position');
        const vel = entity.get('velocity');
        if (vel.x !== 0 || vel.y !== 0) {
            pos.x += vel.x * deltaTime;
            pos.y += vel.y * deltaTime;
            pos.setDirty(true);
        }
    }
};
