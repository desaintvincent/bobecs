const path = require('path');
const express = require('express');
const Game = require('./Game');
const Message = require('../../../src/commun/services/Message');
const ServerNetwork = require('../../../src/server/services/ServerNetwork');
const Util = require('../commun/Util');
const Position = require('../commun/components/Position');
const Acceleration = require('../commun/components/Acceleration');
const Player = require('../commun/components/Player');
const Velocity = require('../commun/components/Velocity');
const Color = require('../commun/components/Color');
const Masse = require('../commun/components/Masse');
const Radius = require('../commun/components/Radius');
const Score = require('../commun/components/Score');
const NetworkData = require('../../../src/server/components/NetworkData');
const Controls = require('./components/Controls');
const { ECS } = require('bobecs');

const app = express();

app.use('/dist', express.static(__dirname + '/../../dist'));
app.use('/src', express.static(__dirname + '/../../src'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/exemple.html'));
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

const game = new Game();
game.init();
game.loop();

Message.declare('control');
ServerNetwork.start(8080);
ServerNetwork.onConnection((id) => {
    const player = ECS.createEntity()
        .addTag('player')
        .addComponent(new Position(Util.randMinMax(20, 480), Util.randMinMax(20, 480)))
        .addComponent(new Color())
        .addComponent(new Velocity(0, 0))
        .addComponent(new Acceleration(1000))
        .addComponent(new Radius(15))
        .addComponent(new Player(id))
        .addComponent(new Controls())
        .addComponent(new Masse(5))
        .addComponent(new Score(0))
        .addComponent(new NetworkData(['position', 'color', 'player', 'radius', 'score'], ['RenderSystem']))
        .addToSystem('Network')
        .addToSystem('MoveSystem')
        .addToSystem('ControlsSystem')
        .addToSystem('AccelerationSystem')
        .addToSystem('OutSystem')
        .addToSystem('frictionsystem')
        .addToSystem('ColliderSystem');
    ServerNetwork.listen(id, (type, data) => {
        if (type === 'control') {
            player.get('controls').setKey(data.key, data.down);
        }
    });
    ServerNetwork.onClose(id, (code) => {
        player.remove();
    });
});
