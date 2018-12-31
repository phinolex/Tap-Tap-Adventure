(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["styles"] = factory();
	else
		root["styles"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./css/main.css");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/img/1/border.png":
/*!*********************************!*\
  !*** ./assets/img/1/border.png ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "border.png";

/***/ }),

/***/ "./assets/img/2/border.png":
/*!*********************************!*\
  !*** ./assets/img/2/border.png ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "border.png";

/***/ }),

/***/ "./assets/img/3/border.png":
/*!*********************************!*\
  !*** ./assets/img/3/border.png ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "border.png";

/***/ }),

/***/ "./assets/img/common/hud-modal.png":
/*!*****************************************!*\
  !*** ./assets/img/common/hud-modal.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "hud-modal.png";

/***/ }),

/***/ "./css/main.css":
/*!**********************!*\
  !*** ./css/main.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/lib/loader.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js!./css/main.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js!./css/main.css":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js!./css/main.css ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Imports
var urlEscape = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/url-escape.js */ "./node_modules/css-loader/dist/runtime/url-escape.js");
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(/*! ../assets/img/common/hud-modal.png */ "./assets/img/common/hud-modal.png"));
var ___CSS_LOADER_URL___1___ = urlEscape(__webpack_require__(/*! ../assets/img/3/border.png */ "./assets/img/3/border.png"));
var ___CSS_LOADER_URL___2___ = urlEscape(__webpack_require__(/*! ../assets/img/2/border.png */ "./assets/img/2/border.png"));
var ___CSS_LOADER_URL___3___ = urlEscape(__webpack_require__(/*! ../assets/img/1/border.png */ "./assets/img/1/border.png"));

// Module
exports.push([module.i, "html,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nfont,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  font-size: 100%;\n  vertical-align: baseline;\n  background: transparent; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmenu,\nnav,\nsection {\n  display: block; }\n\ncanvas {\n  position: absolute;\n  image-rendering: optimizeSpeed; }\n\n#background,\n#textCanvas,\n#foreground,\n#cursor {\n  margin: 0;\n  padding: 0; }\n\n#wrapper,\n#createCharacter,\n#loadCharacter,\n#error {\n  width: 90%;\n  height: 40%; }\n\n#container {\n  z-index: 100;\n  background: rgba(0, 0, 0, 0.2); }\n\nfooter {\n  font-family: sans-serif;\n  position: absolute;\n  bottom: 5%;\n  left: 0;\n  text-align: center;\n  width: 100%;\n  color: #ffffff;\n  font-size: 16px; }\n\n.sub-forum-link {\n  color: #ffffff; }\n\n.link:hover {\n  cursor: pointer;\n  color: #d83939; }\n\n#about-link span:hover,\n#credits-link span:hover,\n#git-link span:hover,\n#forums-link span:hover,\n.sub-forum-link:hover {\n  color: #ffffff;\n  cursor: pointer; }\n\n.game footer {\n  color: #fcda5c; }\n\n.game footer {\n  opacity: 0; }\n\nfooter div {\n  display: inline-block; }\n\n#canvas,\n#foreground,\n#background,\n#textCanvas,\n#container,\n#border,\n#footer,\n#cursor {\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none; }\n\n#foreground,\n#background,\n#entities,\n#cursor {\n  -webkit-transform: translatez(0);\n  -moz-transform: translatez(0);\n  -ms-transform: translatez(0);\n  -o-transform: translatez(0);\n  transform: translatez(0); }\n\n#death p {\n  margin-top: 10%; }\n\n#respawn {\n  margin-top: 5%; }\n\n#wrapper,\n#wrapper input,\n#wrapper select {\n  font-family: sans-serif; }\n\n#wrapper input {\n  width: 50%;\n  background: rgba(54, 42, 59, 0.9);\n  text-align: center;\n  color: #000; }\n\n#wrapper input:focus {\n  border-color: #000;\n  background: rgba(54, 42, 59, 0.7);\n  color: #fff; }\n\n#wrapper input.field-error {\n  background: rgba(255, 0, 0, 0.1);\n  border-color: #f84444; }\n\n#wrapper select {\n  width: 25%;\n  background: rgba(0, 0, 0, 0.05);\n  text-align: center;\n  color: black; }\n\n#alert {\n  height: 50px;\n  width: 100%;\n  background: #d83939;\n  color: #eee;\n  font-size: 20px;\n  font-family: sans-serif;\n  text-align: center;\n  line-height: 50px;\n  border-bottom: 1px solid #000; }\n\n#wrapper p {\n  font-family: sans-serif;\n  line-height: 1.2em; }\n\n#credits,\n#git,\n#about,\n#loadCharacter,\n#createCharacter,\n#death,\n#welcome,\n#error {\n  opacity: 0;\n  pointer-events: none; }\n\n#credits,\n#about,\n#git,\n#death,\n#welcome,\n#error,\n#loadCharacter,\n#createCharacter {\n  position: absolute;\n  left: 50%;\n  text-align: center;\n  font-family: sans-serif;\n  z-index: 1000; }\n\n.credits #credits,\n.about #about,\n.git #git,\n.death #death,\n.welcomeMessage #welcome,\n.error #error,\n.createCharacter #createCharacter,\n.loadCharacter #loadCharacter {\n  opacity: 1;\n  pointer-events: auto; }\n\n#credits,\n#about,\n#death,\n#welcome,\n#git {\n  top: 50%; }\n\n#wtf {\n  margin-right: auto;\n  margin-left: auto;\n  width: 40%;\n  margin-top: -12%;\n  z-index: 100;\n  position: relative;\n  display: block; }\n\n#adventure {\n  display: block;\n  margin-right: auto;\n  margin-left: auto;\n  width: 40%;\n  margin-top: -1%;\n  z-index: 1;\n  position: relative; }\n\n#createCharacter form {\n  position: relative; }\n\n.loader {\n  position: relative;\n  margin-top: 25%; }\n\n#container {\n  top: 48%;\n  left: 50%; }\n\n#wrapper,\n#respawn {\n  background-image: url(" + ___CSS_LOADER_URL___0___ + ");\n  background-repeat: no-repeat;\n  background-size: cover; }\n\n#wrapper-footer {\n  height: 160px;\n  width: 100%;\n  color: #fff;\n  background-image: url(" + ___CSS_LOADER_URL___0___ + ");\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: bottom;\n  top: 100%;\n  position: relative; }\n\n@media only screen and (min-width: 1501px) {\n  #credits,\n  #about,\n  #death,\n  #welcome,\n  #git {\n    width: 1266px;\n    height: 546px;\n    margin-left: -633px;\n    margin-top: -273px;\n    font-size: 30px; }\n  #border {\n    position: absolute;\n    width: 1470px;\n    height: 780px;\n    left: 50%;\n    top: 0;\n    margin-left: -735px;\n    border: 0;\n    padding: 15px;\n    background: url(" + ___CSS_LOADER_URL___1___ + ") no-repeat 0 0; }\n  #container {\n    width: 1470px;\n    height: 798px;\n    margin: -378px auto auto -735px;\n    position: absolute; }\n  #loginButton,\n  #createCharacter,\n  #loadCharacter,\n  #error {\n    position: absolute;\n    top: 48%;\n    left: 50%;\n    margin-left: -633px;\n    margin-top: -273px;\n    font-size: 20px;\n    text-align: center;\n    z-index: 1000; }\n  #wrapper input,\n  #wrapper select {\n    padding: 0 15px;\n    border: 3px solid #000;\n    font-size: 30px;\n    border-radius: 9px; }\n  #wrapper input {\n    margin-top: 10px;\n    height: 60px; }\n  #wrapper select {\n    margin-top: 24px;\n    height: 48px;\n    width: 23%; }\n  #wrapper.createCharacter input {\n    margin-top: 24px;\n    height: 45px; }\n  #respawn {\n    background-size: 1266px auto; }\n  .game.death {\n    width: 1038px;\n    margin-left: -519px;\n    background-position: -114px -882px; }\n  #respawn {\n    width: 375px;\n    height: 153px;\n    margin: 63px auto 0 auto;\n    background-position: 0 -1428px; }\n  #respawn:active {\n    background-position: -375px -1428px; }\n  .loader {\n    margin-top: 27%;\n    font-size: 26px; } }\n\n@media only screen and (max-width: 1500px), only screen and (max-height: 870px) {\n  #wrapper-footer {\n    height: 100px; }\n  #credits,\n  #about,\n  #death,\n  #git {\n    width: 844px;\n    height: 364px;\n    margin-left: -422px;\n    margin-top: -182px;\n    font-size: 20px; }\n  #welcome {\n    width: 644px;\n    height: 364px;\n    margin-left: -322px;\n    margin-top: -152px;\n    font-size: 18px; }\n  #border {\n    position: absolute;\n    width: 980px;\n    height: 520px;\n    left: 50%;\n    top: 0;\n    margin-left: -490px;\n    border: 0;\n    padding: 10px;\n    background: url(" + ___CSS_LOADER_URL___2___ + ") no-repeat 0 0; }\n  #container {\n    width: 980px;\n    height: 532px;\n    margin: -252px auto auto -490px;\n    position: absolute; }\n  #wrapper,\n  #createCharacter,\n  #loadCharacter,\n  #error {\n    position: absolute;\n    top: 48%;\n    left: 50%;\n    margin-left: -422px;\n    margin-top: -182px;\n    font-size: 20px;\n    text-align: center;\n    z-index: 2; }\n  #wrapper input,\n  #wrapper select {\n    padding: 0 10px;\n    border: 2px solid #000;\n    font-size: 20px;\n    border-radius: 6px; }\n  #wrapper input {\n    margin-top: 20px;\n    height: 41px; }\n  #wrapper select {\n    margin-top: 16px;\n    height: 32px;\n    width: 23%; }\n  #wrapper.createCharacter input {\n    margin-top: 15px;\n    height: 30px; }\n  #respawn {\n    background-size: 844px auto; }\n  #respawn {\n    width: 250px;\n    height: 102px;\n    margin: 42px auto 0 auto;\n    background-position: 0 -952px; }\n  #respawn:active {\n    background-position: -250px -952px; } }\n\n@media only screen and (max-width: 1000px) {\n  #wrapper-footer {\n    height: 60px; }\n  #credits,\n  #about,\n  #death,\n  #git {\n    width: 422px;\n    height: 182px;\n    margin-left: -211px;\n    margin-top: -91px;\n    font-size: 10px; }\n  #welcome {\n    width: 322px;\n    height: 182px;\n    margin-left: -161px;\n    margin-top: -76px;\n    font-size: 10px; }\n  #border {\n    position: absolute;\n    width: 490px;\n    height: 260px;\n    left: 50%;\n    top: 0;\n    margin-left: -245px;\n    border: 0;\n    padding: 5px;\n    background: url(" + ___CSS_LOADER_URL___3___ + ") no-repeat 0 0; }\n  #container {\n    width: 490px;\n    height: 266px;\n    margin: -126px auto auto -245px;\n    position: absolute; }\n  #wrapper,\n  #createCharacter,\n  #loadCharacter,\n  #error {\n    position: absolute;\n    top: 48%;\n    left: 50%;\n    margin-left: -211px;\n    margin-top: -91px;\n    font-size: 10px;\n    text-align: center;\n    z-index: 2; }\n  #wrapper input,\n  #wrapper select {\n    padding: 0 5px;\n    border: 1px solid #000;\n    font-size: 10px;\n    border-radius: 3px; }\n  #wrapper input {\n    margin-top: 10px;\n    height: 20px; }\n  #wrapper select {\n    margin-top: 8px;\n    height: 16px;\n    width: 23%; }\n  #wrapper.createCharacter input {\n    margin-top: 8px;\n    height: 15px; }\n  #respawn {\n    background-size: 422px auto; }\n  #respawn {\n    width: 125px;\n    height: 51px;\n    margin: 21px auto 0 auto;\n    background-position: 0 -476px; }\n  #respawn:active {\n    background-position: -125px -476px; } }\n\n.align-center {\n  margin: auto; }\n", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/url-escape.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/url-escape.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function escape(url, needQuotes) {
  if (typeof url !== 'string') {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || needQuotes) {
    return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
  }

  return url;
};

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })

/******/ });
});
//# sourceMappingURL=styles.js.map