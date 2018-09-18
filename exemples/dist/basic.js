(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bobecs = require('../../lib/bobecs');

var _stats = require('stats.js');

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// stats
var stats = new _stats2.default();
var xPanel = stats.addPanel(new _stats2.default.Panel('Entities', '#ff8', '#221'));
stats.showPanel(3);
document.body.appendChild(stats.dom);
document.body.appendChild(stats.domElement);

function randMinMax(min, max) {}

// Components

var Position = function (_Component) {
    _inherits(Position, _Component);

    function Position(x, y) {
        _classCallCheck(this, Position);

        var _this = _possibleConstructorReturn(this, (Position.__proto__ || Object.getPrototypeOf(Position)).call(this));

        _this.x = x;
        _this.y = y;
        return _this;
    }

    return Position;
}(_bobecs.Component);

var Velocity = function (_Component2) {
    _inherits(Velocity, _Component2);

    function Velocity(x, y) {
        _classCallCheck(this, Velocity);

        var _this2 = _possibleConstructorReturn(this, (Velocity.__proto__ || Object.getPrototypeOf(Velocity)).call(this));

        _this2.x = x;
        _this2.y = y;
        return _this2;
    }

    return Velocity;
}(_bobecs.Component);

var Size = function (_Component3) {
    _inherits(Size, _Component3);

    function Size(w, h) {
        _classCallCheck(this, Size);

        var _this3 = _possibleConstructorReturn(this, (Size.__proto__ || Object.getPrototypeOf(Size)).call(this));

        _this3.w = w;
        _this3.h = h;
        return _this3;
    }

    return Size;
}(_bobecs.Component);

var Color = function (_Component4) {
    _inherits(Color, _Component4);

    function Color() {
        _classCallCheck(this, Color);

        var _this4 = _possibleConstructorReturn(this, (Color.__proto__ || Object.getPrototypeOf(Color)).call(this));

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        _this4.color = color;
        return _this4;
    }

    return Color;
}(_bobecs.Component);

// Systems


var MoveSystem = function (_System) {
    _inherits(MoveSystem, _System);

    function MoveSystem() {
        _classCallCheck(this, MoveSystem);

        return _possibleConstructorReturn(this, (MoveSystem.__proto__ || Object.getPrototypeOf(MoveSystem)).apply(this, arguments));
    }

    _createClass(MoveSystem, [{
        key: 'update',
        value: function update(entity, deltaTime) {
            var pos = entity.get('position');
            var vel = entity.get('velocity');
            pos.x += vel.x * deltaTime;
            pos.y += vel.y * deltaTime;
        }
    }]);

    return MoveSystem;
}(_bobecs.System);

var OutSystem = function (_System2) {
    _inherits(OutSystem, _System2);

    function OutSystem() {
        _classCallCheck(this, OutSystem);

        return _possibleConstructorReturn(this, (OutSystem.__proto__ || Object.getPrototypeOf(OutSystem)).apply(this, arguments));
    }

    _createClass(OutSystem, [{
        key: 'update',
        value: function update(entity, deltaTime) {
            var pos = entity.get('position');
            var size = entity.get('size');
            if (pos.x + size.w > 500 || pos.y + size.h > 500 || pos.x < 0 || pos.y < 0) {
                entity.remove();
                _bobecs.ECS.createEntity().addComponent(new Position(200, 200)).addComponent(new Color()).addComponent(new Size(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))).addComponent(new Velocity(Math.floor(Math.random() * 1001) - 500, Math.floor(Math.random() * 1001) - 500)).addToSystem('MoveSystem').addToSystem('OutSystem').addToSystem('RenderSystem');
            }
        }
    }]);

    return OutSystem;
}(_bobecs.System);

var RenderSystem = function (_System3) {
    _inherits(RenderSystem, _System3);

    function RenderSystem(canvas, ctx) {
        _classCallCheck(this, RenderSystem);

        var _this7 = _possibleConstructorReturn(this, (RenderSystem.__proto__ || Object.getPrototypeOf(RenderSystem)).call(this));

        _this7.canvas = canvas;
        _this7.ctx = ctx;
        return _this7;
    }

    _createClass(RenderSystem, [{
        key: 'preUpdate',
        value: function preUpdate() {
            this.canvas.width = this.canvas.width; // reset the canvas - harsh way.
        }
    }, {
        key: 'update',
        value: function update(e, deltaTime) {
            this.ctx.fillStyle = e.getComponent('color').color;
            this.ctx.fillRect(e.getComponent('position').x, e.getComponent('position').y, e.getComponent('size').w, e.getComponent('size').h);
        }
    }]);

    return RenderSystem;
}(_bobecs.System);

// Add Systems to ECS


_bobecs.ECS.addSystem(new MoveSystem());
_bobecs.ECS.addSystem(new OutSystem());
_bobecs.ECS.addSystem(new RenderSystem(canvas, ctx));

// Create 1000 entities
for (var i = 0; i < 1000; i++) {
    _bobecs.ECS.createEntity().addComponent(new Position(200, 200)).addComponent(new Color()).addComponent(new Velocity(Math.floor(Math.random() * 1001) - 500, Math.floor(Math.random() * 1001) - 500)).addComponent(new Size(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))).addToSystem('MoveSystem').addToSystem('OutSystem').addToSystem('RenderSystem');
}

// Main Loop
var oldTime = 0;
function gameLoop() {
    var time = performance.now() / 1000;
    var ElapsedTime = time - oldTime;
    stats.begin();
    _bobecs.ECS.update(ElapsedTime);
    stats.end();
    xPanel.update(_bobecs.ECS._entities.length, 1200);
    oldTime = time;
    requestAnimationFrame(gameLoop);
}

gameLoop();

},{"../../lib/bobecs":6,"stats.js":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Component = function () {
    function Component() {
        _classCallCheck(this, Component);

        this.setDirty();
    }

    _createClass(Component, [{
        key: "setDirty",
        value: function setDirty() {
            var dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this._dirty = dirty;
        }
    }, {
        key: "isDirty",
        value: function isDirty() {
            return this._dirty;
        }
    }]);

    return Component;
}();

exports.default = Component;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ECS = function () {
    function ECS() {
        _classCallCheck(this, ECS);
    }

    _createClass(ECS, null, [{
        key: 'createEntity',
        value: function createEntity() {
            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var entity = new _Entity2.default(id);
            entity.setManager(this);
            ECS._entities.push(entity);
            return entity;
        }
    }, {
        key: 'removeEntity',
        value: function removeEntity(entity) {
            var index = this._entities.indexOf(entity);
            if (!~index) {
                throw new Error('Tried to remove entity not in list');
            }
            this.removeEntityFromAllSystems(entity);
            this._entities.splice(index, 1);
        }
    }, {
        key: 'addSystem',
        value: function addSystem(system) {
            ECS._systems[system.constructor.name.toLowerCase()] = system;
        }
    }, {
        key: 'removeSystem',
        value: function removeSystem(system) {
            var index = this._systems.indexOf(system);
            if (!~index) {
                throw new Error('Tried to remove system not in list');
            }
            this._systems.splice(index, 1);
        }
    }, {
        key: 'update',
        value: function update() {
            var deltaTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            for (var systemName in ECS._systems) {
                if (ECS._systems.hasOwnProperty(systemName)) {
                    ECS._systems[systemName].updateAll(deltaTime);
                }
            }
        }
    }, {
        key: 'addEntityToSystem',
        value: function addEntityToSystem(entity, systemName) {
            if (!ECS._systems.hasOwnProperty(systemName.toLowerCase())) {
                throw new Error('Tried to add entity to unexisting system ' + systemName);
            }
            ECS._systems[systemName.toLowerCase()].addEntity(entity);
        }
    }, {
        key: 'removeEntityFromSystem',
        value: function removeEntityFromSystem(entity, systemName) {
            ECS._systems[systemName.toLowerCase()].removeEntity(entity);
        }
    }, {
        key: 'removeEntityFromAllSystems',
        value: function removeEntityFromAllSystems(entity) {
            for (var systemName in ECS._systems) {
                if (ECS._systems.hasOwnProperty(systemName)) {
                    this.removeEntityFromSystem(entity, systemName);
                }
            }
        }
    }]);

    return ECS;
}();

ECS._entities = [];
ECS._systems = [];

exports.default = ECS;

},{"./Entity":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Entity = function () {
    function Entity() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, Entity);

        this._id = id === null ? (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity.count() : id;
        this._tags = [];
        this._manager = null;
        this._components = {};
    }

    _createClass(Entity, [{
        key: "setManager",
        value: function setManager(manager) {
            this._manager = manager;
        }
    }, {
        key: "addComponent",
        value: function addComponent(component) {
            component._dirty = true;
            this._components[component.constructor.name.toLowerCase()] = component;
            return this;
        }
    }, {
        key: "removeComponent",
        value: function removeComponent(componentName) {
            delete this._components[componentName.toLowerCase()];
            return this;
        }
    }, {
        key: "hasComponent",
        value: function hasComponent(componentName) {
            return this._components.hasOwnProperty(componentName.toLowerCase());
        }
    }, {
        key: "getComponent",
        value: function getComponent(componentName) {
            if (!this.hasComponent(componentName)) {
                throw new Error("Tried to get unexisting component in entity " + this._id);
            }
            return this._components[componentName.toLowerCase()];
        }
    }, {
        key: "addTag",
        value: function addTag(tag) {
            this.tags.push(tag);
            return this;
        }
    }, {
        key: "removeTag",
        value: function removeTag(tag) {
            delete this.tags[tag];
            return this;
        }
    }, {
        key: "hasTag",
        value: function hasTag(tag) {
            return this.tags.indexOf(tag) > -1;
        }
    }, {
        key: "remove",
        value: function remove() {
            this._manager.removeEntity(this);
        }
    }, {
        key: "addToSystem",
        value: function addToSystem(systemName) {
            this._manager.addEntityToSystem(this, systemName);
            return this;
        }
    }, {
        key: "get",
        value: function get(component) {
            return this.getComponent(component);
        }
    }, {
        key: "add",
        value: function add(component) {
            return this.addComponent(component);
        }
    }, {
        key: "has",
        value: function has() {
            return this.hasComponent();
        }
    }], [{
        key: "count",
        value: function count() {
            if (!this._count) {
                this._count = 0;
            }
            this._count = this._count + 1;
            return this._count;
        }
    }]);

    return Entity;
}();

exports.default = Entity;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var System = function () {
    function System() {
        var frequency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        _classCallCheck(this, System);

        this._frequency = frequency;
        this._entities = [];
    }

    _createClass(System, [{
        key: "updateAll",
        value: function updateAll(deltaTime) {
            this.preUpdate();

            for (var i = 0; i < this._entities.length; i += 1) {
                this.update(this._entities[i], deltaTime);
            }

            this.postUpdate();
        }
    }, {
        key: "addEntity",
        value: function addEntity(entity) {
            this._entities.push(entity);
            this.postAdd(entity);
        }
    }, {
        key: "removeEntity",
        value: function removeEntity(entity) {
            var index = this._entities.indexOf(entity);

            if (~index) {
                this._entities.splice(index, 1);
                this.postRemove(entity);
            }
        }
    }, {
        key: "update",
        value: function update(entity, deltaTime) {}
    }, {
        key: "preUpdate",
        value: function preUpdate() {}
    }, {
        key: "postUpdate",
        value: function postUpdate() {}
    }, {
        key: "postAdd",
        value: function postAdd(entity) {}
    }, {
        key: "postRemove",
        value: function postRemove(entity) {}
    }]);

    return System;
}();

exports.default = System;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.System = exports.Component = exports.Entity = exports.ECS = undefined;

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _ECS = require('./ECS');

var _ECS2 = _interopRequireDefault(_ECS);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.ECS = _ECS2.default;
exports.Entity = _Entity2.default;
exports.Component = _Component2.default;
exports.System = _System2.default;

},{"./Component":2,"./ECS":3,"./Entity":4,"./System":5}],7:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

},{}]},{},[1]);
