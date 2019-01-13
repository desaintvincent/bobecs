const { System, ECS } = require('bobecs');

module.exports = class RenderSystem extends System {
    constructor(canvas, ctx) {
        super();
        this.canvas = canvas;
        this.ctx = ctx;
        this.ctx.font = '30px Comic Sans MS';
    }

    smiley(ctx, x, y, r, color = 'black') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true); // Outer circle
        ctx.moveTo(x + 4 * r / 6, y);
        ctx.arc(x, y, 2 * r / 3, 0, Math.PI, false); // Mouth (clockwise)
        ctx.moveTo(x - r / 3 + r / 4, y - r / 3);
        ctx.arc(x - r / 3, y - r / 3, r / 4, 0, Math.PI * 2, true); // Left eye
        ctx.moveTo(x + r / 3 + r / 4, y - r / 3);
        ctx.arc(x + r / 3, y - r / 3, r / 4, 0, Math.PI * 2, true); // Right eye
        ctx.stroke();
    }

    preUpdate(deltaTime) {
        this.canvas.width = this.canvas.width; // reset the canvas - harsh way.
    }

    postUpdate(deltaTime) {
        this.ctx.font = '30px Comic Sans MS';
        ECS._entities.filter(e => e.has('score')).forEach((e, i) => {
            this.ctx.fillStyle = e.get('color').color;
            this.ctx.fillText(`Score: ${e.get('score').get()}`, 15, 20 + i * 20);
        });
    }

    update(e, deltaTime) {
        if (e.has('player')) {
            this.smiley(this.ctx, e.get('position').x, e.get('position').y, e.get('radius').r, e.get('color').color);
        } else {
            this.ctx.fillStyle = e.get('color').color;
            this.ctx.beginPath();
            this.ctx.arc(e.get('position').x, e.get('position').y, e.get('radius').r, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
};
