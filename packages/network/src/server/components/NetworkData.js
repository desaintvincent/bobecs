const { Component } = require('bobecs');

module.exports = class NetworkData extends Component {
    constructor(components = [], systems = []) {
        super();
        this._components = components.map(c => c.toLowerCase());
        this._systems = systems.map(s => s.toLowerCase());
    }
};
