const { ComponentFactory, ECS } = require('bobecs');
const Stats = require('stats.js');
const Message = require('../../../src/commun/services/Message');
const ClientNetwork = require('../../../src/client/service/ClientNetwork');

// components
const Position = require('../commun/components/Position');
const Color = require('../commun/components/Color');
const Velocity = require('../commun/components/Velocity');
const Radius = require('../commun/components/Radius');
const Player = require('../commun/components/Player');
const Score = require('../commun/components/Score');

// Systems
const RenderSystem = require('./systems/RenderSystem');
const Network = require('../../../src/client/systems/Network');
const MoveSystem = require('../commun/systems/MoveSystem');

// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// stats
const stats = new Stats();
const xPanel = stats.addPanel( new Stats.Panel('⬇ Ko/s', '#ff8', '#221' ));
stats.showPanel(3);
stats.dom.style.left = 'auto';
stats.dom.style.right = 0;
document.body.appendChild(stats.dom);
document.body.appendChild(stats.domElement);

// Add Systems to ECS
ECS.addSystem(new Network());
ECS.addSystem(new MoveSystem());
ECS.addSystem(new RenderSystem(canvas, ctx));

// Add components to componentFactory

ComponentFactory.add(Color);
ComponentFactory.add(Radius);
ComponentFactory.add(Velocity);
ComponentFactory.add(Player);
ComponentFactory.add(Score);

// Main Loop
var oldTime = 0;
function gameLoop() {
    const time = performance.now() / 1000;
    const ElapsedTime = time - oldTime;
    stats.begin();
    ECS.update(ElapsedTime);
    stats.end();
    xPanel.update(Math.floor(ClientNetwork._downSpeed / 1000), 400);
    oldTime = time;
    requestAnimationFrame(gameLoop);
}

ClientNetwork.connect(`ws://${ window.location.hostname }:8080`)
    .then((e) => {
        console.log('ok', e);
        ClientNetwork.onMessage((type, data) => {
            console.log('recieve', type, data);
        });
    })
    .catch((e) => console.log('ko', e));



// Declare to Message that we will use mesage type 'controls'
Message.declare('control');

// send events
document.addEventListener('keydown', (e) => {
    ClientNetwork.send('control', {
        key: e.keyCode,
        down: true
    });
}, false);

document.addEventListener('keyup', (e) => {
    ClientNetwork.send('control', {
        key: e.keyCode,
        down: false
    });
}, false);

gameLoop();