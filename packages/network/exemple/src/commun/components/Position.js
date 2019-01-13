const Vector2Component = require('./Vector2Component');
const { ComponentFactory } = require('bobecs');

class Position extends Vector2Component {
}

ComponentFactory.add(Position);
module.exports = Position;
