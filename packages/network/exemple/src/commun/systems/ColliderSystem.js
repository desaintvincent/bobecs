const { System } = require('bobecs');
const Velocity = require('../components/Velocity');
const Owner = require('../components/Owner');

module.exports = class ColliderSystem extends System {
    updateAll(deltaTime) {
        // don't do like that
        const balls = this._entities.filter(e => !e.has('player'));
        this._entities.filter(e => e.has('player')).forEach(e => {
            const p1 = e.get('position');
            const r1 = e.get('radius').r;
            const collider = balls.find(b => {
                const p2 = b.get('position');
                const r2 = b.get('radius').r;
                return Math.pow(p1._x - p2._x, 2) + Math.pow(p1._y - p2._y, 2) <= Math.pow(r1 + r2, 2);
            });
            if (collider && !collider.hasTag('corner')) {
                collider.add(new Owner(e));
                collider.get('color').set(e.get('color').color);
                collider.get('color').setDirty();
            }
        });

        this._entities.forEach(e1 => {
            const p1 = e1.get('position');
            const r1 = e1.get('radius').r;
            const e2 = this._entities.find(b => {
                if (b._id === e1._id)  {
                    return false;
                }
                const p2 = b.get('position');
                const r2 = b.get('radius').r;
                return Math.pow(p1._x - p2._x, 2) + Math.pow(p1._y - p2._y, 2) <= Math.pow(r1 + r2, 2);
            });
            if (e2) {
                const p2 = e2.get('position');
                const r2 = e2.get('radius').r;
                const v1 = e1.has('velocity') ? e1.get('velocity') : new Velocity(0, 0);
                const v2 = e2.has('velocity') ? e2.get('velocity') : new Velocity(0, 0);
                const m1 = e1.has('masse') ? e1.get('masse').get() : 1;
                const m2 = e2.has('masse') ? e2.get('masse').get() : 1;

                const vxTotal = v1.x - v2.x;
                const vyTotal = v1.y - v2.y;
                const newVelX1 = (v1.x * (m1 - m2) + (2 * m2 * v2.x)) / (m1 + m2);
                const newVelY1 = (v1.y * (m1 - m2) + (2 * m2 * v2.y)) / (m1 + m2);
                const newVelX2 = vxTotal + newVelX1;
                const newVelY2 = vyTotal + newVelY1;

                // Move the circles so that they don't overlap
                const midpointX = (p1.x + p2.x) / 2;
                const midpointY = (p1.y + p2.y) / 2;
                const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (!e1.hasTag('corner') && !e2.hasTag('corner')) {
                    // update pos
                    p1.x = midpointX + r1 * (p1.x - p2.x)/dist;
                    p1.y = midpointY + r1 * (p1.y - p2.y)/dist;
                    // Update the velocities
                    v1.x = newVelX1;
                    v1.y = newVelY1;
                    v1.setDirty(true);
                    p1.setDirty(true);

                    // update pos
                    p2.x = midpointX + r2 * (p2.x - p1.x)/dist;
                    p2.y = midpointY + r2 * (p2.y - p1.y)/dist;
                    // Update the velocities
                    v2.x = newVelX2;
                    v2.y = newVelY2;

                    v2.setDirty(true);
                    p2.setDirty(true);
                } else {
                    const ball = e1.hasTag('corner') ? e2 : e1;
                    if (ball.has('owner')) {
                        ball.get('color').set('black');
                        const player = ball.get('owner').get();
                        if (player) {
                            player.get('score').add(10);
                        }
                        ball.removeComponent('owner');
                    }
                }
            }
        });
    }
};
