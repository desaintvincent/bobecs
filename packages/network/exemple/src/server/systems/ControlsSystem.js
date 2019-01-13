const { System } = require('bobecs');

module.exports = class ControlsSystem extends System {
    update(entity, deltaTime) {
        const c = entity.get('controls');
        const a = entity.get('acceleration');

        a.x = c.left ? -a.max : c.right ? a.max : 0;
        a.y = c.top ? -a.max : c.bottom ? a.max : 0;
        a.setDirty(true);
    }
};
