'use strict';

const StarField = require('./app/starfield');

window.onload = function() {
  let starfield = new StarField(document.getElementById('canvas'));
}
