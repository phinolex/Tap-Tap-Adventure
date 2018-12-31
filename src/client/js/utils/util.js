/* eslint-disable no-unused-vars */
/* global window */
const isInt = n => n % 1 === 0;

const TRANSITIONEND = 'transitionend webkitTransitionEnd oTransitionEnd';

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = () => (
  window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || ((callback, element) => {
    window.setTimeout(callback, 20);
  })
);
