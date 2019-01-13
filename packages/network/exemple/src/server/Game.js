const { ECS, ComponentFactory } = require('bobecs');

const Util = require('../commun/Util');
// components
const Position = require('../commun/components/Position');
const Color = require('../commun/components/Color');
const Velocity = require('../commun/components/Velocity');
const Player = require('../commun/components/Player');
const Size = require('../commun/components/Radius');
const Masse = require('../commun/components/Masse');
const NetworkData = require('../../../src/server/components/NetworkData');

// Systems
const FrictionSystem = require('../commun/systems/FrictionSystem');
const MoveSystem = require('../commun/systems/MoveSystem');
const OutSystem = require('../commun/systems/OutSystem');
const ColliderSystem = require('../commun/systems/ColliderSystem');
const AccelerationSystem = require('../commun/systems/AccelerationSystem');
const Network = require('../../../src/server/systems/Network');
const ControlsSystem = require('./systems/ControlsSystem');

module.exports = class Game {
    constructor(fps = 60) {
        this.fps = fps;
        this.tickLengthMs = 1000 / this.fps;
        this.previousTick = Date.now();
        this.actualTicks = 0;
        this.run = true;
    }

    init() {
        ECS.addSystem(new ControlsSystem());
        ECS.addSystem(new AccelerationSystem());
        ECS.addSystem(new FrictionSystem());
        ECS.addSystem(new MoveSystem());
        ECS.addSystem(new ColliderSystem());
        ECS.addSystem(new OutSystem(500));
        ECS.addSystem(new Network());

        ComponentFactory.add(Position);
        ComponentFactory.add(Color);
        ComponentFactory.add(Size);
        ComponentFactory.add(Velocity);
        ComponentFactory.add(NetworkData);
        ComponentFactory.add(Player);
        ComponentFactory.add(Masse);

        [
            {x: 0, y: 0},
            {x: 0, y: 500},
            {x: 500, y: 500},
            {x: 500, y: 0},
        ].forEach(p => {
            ECS.createEntity()
                .addTag('corner')
                .addComponent(new Position(p.x, p.y))
                .addComponent(new Color('black'))
                .addComponent(new Size(50))
                .addComponent(new Masse().setInf())
                .addComponent(new NetworkData(['position', 'color', 'radius'], ['RenderSystem']))
                .addToSystem('Network')
                .addToSystem('ColliderSystem');
        });

        for (let i = 0; i < 10; i++) {
            ECS.createEntity()
                .addTag('ball')
                .addComponent(new Position(Util.randMinMax(20, 480), Util.randMinMax(20, 480)))
                .addComponent(new Color('black'))
                .addComponent(new Size(15))
                .addComponent(new Masse(1))
                .addComponent(new Velocity(Util.randMinMax(-50, 50), Util.randMinMax(-50, 50)))
                .addComponent(new NetworkData(['position', 'color', 'radius'], ['RenderSystem']))
                .addToSystem('MoveSystem')
                .addToSystem('Network')
                .addToSystem('ColliderSystem')
                .addToSystem('FrictionSystem')
                .addToSystem('OutSystem');
        }
    }

    loop() {
        if (!this.run) {
            return;
        }
        const now = Date.now();

        this.actualTicks++;
        if (this.previousTick + this.tickLengthMs <= now) {
            const delta = (now - this.previousTick) / 1000;
            this.previousTick = now;
            this.update(delta);
            this.actualTicks = 0;
        }

        if (Date.now() - this.previousTick < this.tickLengthMs/* - 4*/) {
            setTimeout(() => { this.loop(); });
        } else {
            setImmediate(() => { this.loop(); });
        }
    }

    update(delta) {
        ECS.update(delta);
    }
};
