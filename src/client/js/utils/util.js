/* eslint-disable no-unused-vars */
/* global window */
export const isInt = n => n % 1 === 0;

export const TRANSITIONEND = 'transitionend webkitTransitionEnd oTransitionEnd';

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

export const isIntersecting = (rectOne, rectTwo) => (
  rectTwo.left > rectOne.right
  || rectTwo.right < rectOne.left
  || rectTwo.top > rectOne.bottom
  || rectTwo.bottom < rectOne.top
);
