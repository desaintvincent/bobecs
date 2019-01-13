const { System } = require('bobecs');

module.exports = class AccelerationSystem extends System {
    update(entity, deltaTime) {
        const v = entity.get('velocity');
        const a = entity.get('acceleration');
        v.x += deltaTime * a.x;
        v.y += deltaTime * a.y;
        v.setDirty(true);
    }
};