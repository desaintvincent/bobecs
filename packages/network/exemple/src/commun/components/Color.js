const { Component } = require('bobecs');

module.exports = class Color extends Component {
    constructor(color = null) {
        super();

        if (!color) {
            let letters = '0123456789ABCDEF';
            color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * (15 + 1))];
            }
        }

        this.color = color;
    }

    set(value) {
        this.color = value;
        this.setDirty(true);
        return this;
    }

    get() {
        return this.color;
    }
};