(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define("angularjs-async-filter", ["angular"], factory);
	else if(typeof exports === 'object')
		exports["angularjs-async-filter"] = factory(require("angular"));
	else
		root["angularjs-async-filter"] = factory(root["angular"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__) {
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var angular = __webpack_require__(1);
function isObservable(obj) {
    return obj && typeof obj.subscribe === 'function';
}
function isPromise(obj) {
    return obj && typeof obj.then === 'function';
}
var ObservableStrategy = /** @class */ (function () {
    function ObservableStrategy() {
    }
    ObservableStrategy.prototype.createSubscription = function (async, updateLatestValue) {
        this._subscription = async.subscribe({ next: updateLatestValue, error: function (e) { throw e; } });
        return this._subscription;
    };
    ObservableStrategy.prototype.dispose = function () {
        this._subscription.unsubscribe();
        this.latestValue = null;
    };
    ObservableStrategy.prototype.onDestroy = function () { this._subscription.unsubscribe(); };
    return ObservableStrategy;
}());
var PromiseStrategy = /** @class */ (function () {
    function PromiseStrategy() {
    }
    PromiseStrategy.prototype.createSubscription = function (async, updateLatestValue) {
        this._subscription = async.then(updateLatestValue, function (e) { throw e; });
        return this._subscription;
    };
    PromiseStrategy.prototype.dispose = function () {
        this.latestValue = null;
    };
    PromiseStrategy.prototype.onDestroy = function () { };
    return PromiseStrategy;
}());
var AsyncFilterClass = /** @class */ (function () {
    function AsyncFilterClass() {
        this.transform = this.transform.bind(this);
        this._subscriptionMap = new WeakMap();
    }
    AsyncFilterClass.prototype._selectStrategy = function (obj) {
        if (isPromise(obj)) {
            return new PromiseStrategy();
        }
        if (isObservable(obj)) {
            return new ObservableStrategy();
        }
        throw new TypeError("AsyncFilter: expect an async type but received: " + typeof obj);
    };
    AsyncFilterClass.prototype._subscribe = function (obj, scope) {
        var _this = this;
        var strategy = this._selectStrategy(obj);
        strategy.createSubscription(obj, function (value) {
            strategy.latestValue = value;
            _this._updateLatestValue(obj, value, scope);
        });
        this._subscriptionMap.set(obj, strategy);
        scope.$on('$destroy', function () {
            strategy.dispose();
            _this._subscriptionMap.delete(obj);
        });
    };
    AsyncFilterClass.prototype._updateLatestValue = function (async, value, scope) {
        if (this._subscriptionMap.has(async)) {
            scope.$applyAsync();
        }
    };
    AsyncFilterClass.prototype.transform = function (obj, scope) {
        if (!scope) {
            throw new SyntaxError('AsyncFilter: Scope object is expected. Please make sure you have correct syntax `{{ your_binding_value | async:this }}`');
        }
        if (!this._subscriptionMap.has(obj)) {
            if (obj) {
                this._subscribe(obj, scope);
            }
        }
        return this._subscriptionMap.get(obj).latestValue;
    };
    return AsyncFilterClass;
}());
exports.default = angular
    .module('asyncFilterModule', [])
    .filter('async', function () { return new AsyncFilterClass().transform; })
    .name;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map