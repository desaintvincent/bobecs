const { System, ECS } = require('bobecs');

const Position = require('../components/Position');
const Color = require('../components/Color');
const Velocity = require('../components/Velocity');
const Size = require('../components/Radius');

const Util = require('../Util');
const NetworkData = require('../../../../src/server/components/NetworkData');

module.exports = class OutSystem extends System {
    constructor(limit) {
        super();
        this.limit = limit;
    }

    update(entity, deltaTime) {
        const pos = entity.get('position');
        const radius = entity.get('radius').r;
        if (pos.x + radius >= this.limit || pos.x <= radius) {
            const v = entity.get('velocity');
            v.x = -v.x;
            pos.x = pos.x <= radius ? radius : this.limit - radius;
            v.setDirty(true);
            pos.setDirty(true);
        }
        if (pos.y + radius >= this.limit || pos.y <= radius) {
            const v = entity.get('velocity');
            v.y = -v.y;
            pos.y = pos.y <= radius ? radius : this.limit - radius;
            v.setDirty(true);
            pos.setDirty(true);
        }
    }
};