const { System } = require('bobecs');

const Velocity = require('../components/Velocity');

module.exports = class FrictionSystem extends System {
    update(entity, deltaTime) {
        const v = entity.get('velocity');
        if (v.x !== 0) {
            v.x *= 0.99;
            if (Math.abs(v.x) <= 1) {
                v.x = 0;
            }
            v.setDirty(true);
        }
        if (v.y !== 0) {
            v.y *= 0.99;
            if (Math.abs(v.y) <= 1) {
                v.y = 0;
            }
            v.setDirty(true);
        }
    }
};