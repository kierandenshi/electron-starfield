'use strict';

const _ = require('lodash');

const MAX_DEPTH = 30;
const NUM_STARS = 800;
const START_RADIUS = 50; // where to initially position stars relative to centre
const MOVE_RADIUS = 200; // how far stars move per tick
const MOVE_SPEED = 0.2; // how fast to decrease depth per tick (best between 0 and 1)
const RENDER_TICK = 33; // 30fps ~ 33ms
const STAR_RADIUS = 5;

class StarField {

  constructor(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext("2d");
    this.stars = new Array(NUM_STARS);
    _.forEach(this.stars, (val, i, stars) => {
      stars[i] = this.init_star(true);
    })
    setInterval(this.render.bind(this), RENDER_TICK);
  }

  init_star(starting) {
    return {
      x: _.random(-START_RADIUS, START_RADIUS),
      y: _.random(-START_RADIUS, START_RADIUS),
      z: starting ? _.random(1, MAX_DEPTH) : MAX_DEPTH
    }
  }

  render() {
    let halfWidth  = this.width / 2;
    let halfHeight = this.height / 2;
    let ctx = this.ctx;

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, this.width, this.height);

    _.forEach(this.stars, (val, i, stars) => {
      stars[i].z -= MOVE_SPEED;

      if(stars[i].z <= 0) {
        stars[i] = this.init_star();
      }

      // divide move by current z to get parallax effect
      let mv  = MOVE_RADIUS / stars[i].z;

      // get new pixel coords
      let px = stars[i].x * mv + halfWidth;
      let py = stars[i].y * mv + halfHeight;

      // draw the star if it's still within the canvas bounds
      if( px >= 0 && px <= this.width && py >= 0 && py <= this.height ) {

        // make further stars smaller
        let size = STAR_RADIUS * (1 - stars[i].z / MAX_DEPTH);

        // make further stars darker
        let colour = parseInt((1 - stars[i].z / MAX_DEPTH) * 255);

        ctx.fillStyle = `rgb(${colour},${colour},${colour})`;
        ctx.fillRect(px, py, size, size);
      }

    })
  }

}

module.exports = StarField;
