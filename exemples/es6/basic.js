import { ECS, Entity, Component, System } from '../../lib/bobecs';
import Stats from 'stats.js';

// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// stats
var stats = new Stats();
var xPanel = stats.addPanel( new Stats.Panel('Entities', '#ff8', '#221' ));
stats.showPanel(3);
document.body.appendChild( stats.dom );
document.body.appendChild( stats.domElement );


function randMinMax(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Components
class Position extends Component {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
}

class Velocity extends Component {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
}

class Size extends Component {
    constructor(w, h) {
        super();
        this.w = w;
        this.h = h;
    }
}

class Color extends Component {
    constructor(color = null) {
        super();

        if (!color) {
            let letters = '0123456789ABCDEF';
            color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[randMinMax(0, 15)];
            }
        }

        this.color = color;
    }
}

// Systems
class MoveSystem extends System {
    update(entity, deltaTime) {
        const pos = entity.get('position');
        const vel = entity.get('velocity');
        pos.x += vel.x * deltaTime;
        pos.y += vel.y * deltaTime;
    }
}

class OutSystem extends System {
    update(entity, deltaTime) {
        const pos = entity.get('position');
        const size = entity.get('size');
        if (pos.x + size.w > 500
        || pos.y + size.h > 500
        || pos.x < 0
        || pos.y < 0) {
            entity.remove();
            ECS.createEntity()
                .addComponent(new Position(200, 200))
                .addComponent(new Color())
                .addComponent(new Size(randMinMax(0, 100), randMinMax(0, 100)))
                .addComponent(new Velocity(randMinMax(-500, 500), randMinMax(-500, 500)))
                .addToSystem('MoveSystem')
                .addToSystem('OutSystem')
                .addToSystem('RenderSystem');
        }
    }
}

class RenderSystem extends System {
    constructor(canvas, ctx) {
        super();
        this.canvas = canvas;
        this.ctx = ctx;
    }

    preUpdate(deltaTime) {
        this.canvas.width = this.canvas.width; // reset the canvas - harsh way.
    }

    update(e, deltaTime) {
        this.ctx.fillStyle=e.getComponent('color').color;
        this.ctx.fillRect(e.getComponent('position').x,
            e.getComponent('position').y,
            e.getComponent('size').w,
            e.getComponent('size').h);
    }
}

// Add Systems to ECS
ECS.addSystem(new MoveSystem());
ECS.addSystem(new OutSystem());
ECS.addSystem(new RenderSystem(canvas, ctx));

// Create 1000 entities
for (let i = 0; i < 1000; i++) {
    ECS.createEntity()
        .addComponent(new Position(200, 200))
        .addComponent(new Color())
        .addComponent(new Size(randMinMax(0, 100), randMinMax(0, 100)))
        .addComponent(new Velocity(randMinMax(-500, 500), randMinMax(-500, 500)))
        .addToSystem('MoveSystem')
        .addToSystem('OutSystem')
        .addToSystem('RenderSystem');
}

// Main Loop
var oldTime = 0;
function gameLoop() {
    const time = performance.now() / 1000;
    const ElapsedTime = time - oldTime;
    stats.begin();
    ECS.update(ElapsedTime);
    stats.end();
    xPanel.update(ECS._entities.length, 1200);
    oldTime = time;
    requestAnimationFrame(gameLoop);
}

gameLoop();

