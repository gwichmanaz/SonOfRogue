(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";

/**
 * This will be the main application.  For now, just require all our pieces for browserify
 */
var Clock = require('./class/Clock.es6');

var Event = require('./class/Event.es6');

var RNG = require('./class/RNG.es6');

var Persist = require('./class/Persist.es6');

console.log("App.js setting module exports");
var rng = new RNG();
console.log(rng.roll("3d6"));
module.exports = {
  Clock: Clock,
  Event: Event,
  RNG: RNG,
  Persist: Persist
};

if (typeof window != "undefined") {
  window.App = module.exports;
}

},{"./class/Clock.es6":3,"./class/Event.es6":4,"./class/Persist.es6":5,"./class/RNG.es6":6}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Event = require('./Event.es6');

module.exports =
/*#__PURE__*/
function (_Event) {
  _inherits(Clock, _Event);

  /**
   * resolution: number of milliseconds between ticks of the clock
   * eventName: event for clock to fire when it ticks
   * running: clock can be started and stopped like a football clock.
   */
  function Clock() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$resolution = _ref.resolution,
        resolution = _ref$resolution === void 0 ? 1000 : _ref$resolution,
        _ref$eventName = _ref.eventName,
        eventName = _ref$eventName === void 0 ? "tick" : _ref$eventName,
        _ref$running = _ref.running,
        running = _ref$running === void 0 ? false : _ref$running;

    _classCallCheck(this, Clock);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Clock).call(this));
    var count = 0;
    Object.assign(_assertThisInitialized(_this), {
      resolution: resolution,
      eventName: eventName,
      running: running
    });
    setInterval(function () {
      if (_this.running) {
        _this.fire(_this.eventName, count++);
      }
    }, _this.resolution);
    return _this;
  }
  /**
   * call this handler every time the clock ticks
   */


  _createClass(Clock, [{
    key: "tick",
    value: function tick(handler) {
      this.on(this.eventName, handler);
    }
    /**
     * set the running state of the clock (clock only ticks when it is running
     */

  }, {
    key: "run",
    value: function run(bool) {
      this.running = bool;
    }
  }, {
    key: "start",
    value: function start() {
      this.running = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
    }
    /**
     * return a Promise that resolves when a particular point has been reached
     *
     * clock.at(100).then(() => { console.log("clock reached 100 seconds"); });
     */

  }, {
    key: "at",
    value: function at(tick) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var checktick = function checktick(count) {
          if (count >= tick) {
            resolve(count);

            _this2.off(_this2.eventName, checktick);
          }
        };

        _this2.on(_this2.eventName, checktick);
      });
    }
  }]);

  return Clock;
}(Event);

},{"./Event.es6":4}],4:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Basic event firing and listening functionality
 */
{
  /*
   * utility function for promise-mode cases where no handler is passed in
   * (in that case, the hander is the resolver of the promise we will return)
   */
  var promiseHandler = function promiseHandler() {
    var handler;
    var promise = new Promise(function (resolve, reject) {
      handler = resolve;
    });
    return {
      promise: promise,
      handler: handler
    };
  };
  /*
   * given a function that may or may not return a promise,
   * return a function that does return a promise
   */


  var promisify = function promisify(func) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return Promise.resolve().then(function () {
        return func.apply(func, args);
      });
    };
  };
  /**
   * take a handler and make it remove itself once it gets called
   */


  var onceify = function onceify(event, eventName, func) {
    var oncefunc = function oncefunc() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var rval = func.apply(func, args);
      event.off(eventName, oncefunc);
      return rval;
    };

    return oncefunc;
  };

  module.exports =
  /*#__PURE__*/
  function () {
    function Event() {
      _classCallCheck(this, Event);

      Object.assign(this, {
        handlers: {},
        payloads: {}
      });
    }
    /**
     * fire the named event, along with optional payload
     * return a promise that resolves when all handlers have completed
     */


    _createClass(Event, [{
      key: "fire",
      value: function fire(eventName, payload) {
        this.payloads[eventName] = payload;

        if (!(this.handlers[eventName] && this.handlers[eventName].length)) {
          return Promise.resolve();
        }

        return Promise.all(this.handlers[eventName].map(function (handler) {
          handler = promisify(handler);
          return handler(payload);
        }));
      }
      /**
       * add a handler for an event
       */

    }, {
      key: "on",
      value: function on(eventName, handler) {
        // make sure we replace if called multiple
        this.off(eventName, handler);
        this.handlers[eventName] = this.handlers[eventName] || [];
        this.handlers[eventName].push(handler);
      }
      /**
       * remove a handler for an event
       */

    }, {
      key: "off",
      value: function off(eventName, handler) {
        if (this.handlers[eventName]) {
          var position = this.handlers[eventName].indexOf(handler);

          if (position != -1) {
            this.handlers[eventName].splice(position, 1);
          }
        }
      }
      /*
       * add a one-time handler for an event
       * handler: optional callback function, but can also be used inpromise mode
       *
       * event.once("tick", function...)
       * event.once("tick").then(function...)
       */

    }, {
      key: "once",
      value: function once(eventName, h) {
        var p;

        var _promiseHandler = promiseHandler(),
            promise = _promiseHandler.promise,
            handler = _promiseHandler.handler;

        if (!h) {
          p = promise;
          h = handler;
        }

        this.on(eventName, onceify(this, eventName, h));
        return p;
      }
      /*
       * replay the most recent firing of this event, or if it hasn't fired at all yet, wait for it
       * (fixes "late listener" problems)
       *
       * handler: optional callback function, but can also be used in promise mode
       *
       * event.last("login", function....)
       * event.last("login").then(function...)
       */

    }, {
      key: "last",
      value: function last(eventName, handler) {
        var payload = this.payloads[eventName];

        if (payload) {
          var promise = Promise.resolve(payload);
          console.log("**HANDLER**", !!handler);
          return handler ? promise.then(handler) : promise;
        }

        return this.once(eventName, handler);
      }
    }]);

    return Event;
  }();
}

},{}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Base class for any persistent object
 */
{
  /*
   * if we are not in a browser, get ourselves some local storage
   */
  if (typeof localStorage == "undefined") {
    var Storage = require("../lib/localStorage.js");

    var localStorage = new Storage("./persist.txt"); // TODO: some way to configure
  }
  /*
   * Default persister.  Persister is a singleton that can save/restore/delete
   * a string to long-term storage
   */


  var persister = {
    /**
     * given an @id {String} and a @value {String}, return a {Promise} that fulfills
     * when the value has been successfully saved to long term storage
     */
    setItem: function setItem(id, value) {
      localStorage.setItem(id, value);
      return Promise.resolve(value);
    },

    /**
     * given an @id {String}, return a {Promise<String>} resolved with the value of the ID
     * if it is in storage.
     *
     * If it is NOT in storage, and dflt {String} is defined, then store the default and return that
     *
     * If it is NOT in storage, ad dflt is NOT defined, @return rejected promise
     */
    getItem: function getItem(id, dflt) {
      if (localStorage.hasOwnProperty(id)) {
        return Promise.resolve(localStorage.getItem(id));
      }

      if (typeof dflt == "string") {
        return persister.setItem(id, dflt);
      }

      return Promise.reject(new Error("storage has no item " + id));
    },

    /**
     * given an @id {String}, remove item from storage with that id, if it exists.
     * return {Promise<boolean>} that resolves when item has been removed.  resolves false
     * if the item was not in storage
     */
    removeItem: function removeItem(id) {
      var removed = false;

      if (localStorage.hasOwnProperty(id)) {
        localStorage.removeItem(id);
        removed = true;
      }

      return Promise.resolve(removed);
    }
  };

  module.exports =
  /*#__PURE__*/
  function () {
    _createClass(Persist, null, [{
      key: "setPersister",
      value: function setPersister(ps) {
        // TODO: Sanity check that this is a valid persister
        // TODO: Throw an error if anything has been persisted already (or else implement re-persist)
        persister = ps;
      }
      /**
       * create a new persistent object. @id {String} must be globally unique
       */

    }]);

    function Persist(id) {
      var _this = this;

      var dflt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Persist);

      Object.defineProperty(this, 'id', {
        value: id,
        writable: false,
        enumerable: false
      });
      this.ready = persister.getItem(id, this.serialize(dflt)).then(function (r) {
        return _this.persistent = _this.deserialize(r);
      });
    }
    /**
     * turn our persistent values into a string.  Done as a public member function so subclasses
     * can override if they want to do it a different way
     */


    _createClass(Persist, [{
      key: "serialize",
      value: function serialize(obj) {
        return JSON.stringify(obj);
      }
    }, {
      key: "deserialize",
      value: function deserialize(str) {
        return JSON.parse(str);
      }
      /**
       * persist our current values to long-term storage
       * @return {Promise} that resolves when we are saved.
       */

    }, {
      key: "persist",
      value: function persist() {
        var _this2 = this;

        return this.ready.then(function () {
          persister.setItem(_this2.id, _this2.serialize(_this2.persistent));
        });
      }
    }]);

    return Persist;
  }();
}

},{"../lib/localStorage.js":8}],6:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * general purpose random number generator class.
 * wrapper around MersenneTwister with some nice D&D dice functions
 */
var MersenneTwister = require("../lib/MersenneTwister.js");

module.exports =
/*#__PURE__*/
function () {
  function RNG(seed) {
    _classCallCheck(this, RNG);

    this.mersenne = new MersenneTwister(seed);
  }
  /**
   * @return a random integer between @lo and @hi
   * be forgiving if they get the order wrong
   */


  _createClass(RNG, [{
    key: "between",
    value: function between(lo, hi) {
      var rlo = Math.min(lo, hi);
      var rhi = Math.max(lo, hi);
      return this.mersenne.random_int() % (rhi - rlo + 1) + rlo;
    }
    /**
     * Roll @dice number of @sides-sided dice, or pass it in as a string if you prefer
     * this.roll(3, 6)
     * this.roll("3d6")
     * this.roll(6) is the same as this.roll(1, 6)
     */

  }, {
    key: "roll",
    value: function roll(dice, sides) {
      var _this = this;

      /*
       * roll 1 s-sided die
       */
      var roll1 = function roll1(s) {
        return _this.between(1, s);
      };

      if (typeof dice == "string") {
        var m = dice.match(/(\d+)d(\d+)/i);

        if (m) {
          return this.roll(+m[1], +m[2]);
        }

        throw new Error("RNG.roll: malformed string " + dice);
      }

      if (!sides) {
        sides = dice;
        dice = 1;
      }

      if (!dice) {
        throw new Error("RNG.roll: no dice to roll");
      }

      var total = 0;

      while (dice--) {
        total += roll1(sides);
      }

      return total;
    }
    /**
     * test how fair our dice are by rolling a bunch of times and seeing how close the results are to perfect
     * @sides the number of sides on our test die
     * @rolls the number of times to roll the test die
     * @return an array with a value for each result, showing how close to "perfect" we are (1.0 means exactly as expected)
     */

  }, {
    key: "test",
    value: function test() {
      var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      var rolls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
      var results = [];
      var result;
      var perfect = 1 / sides;
      var count = rolls;

      while (count--) {
        result = this.roll(sides);
        results[result] = results[result] || 0;
        results[result]++;
      }

      return results.map(function (n) {
        return n / rolls / perfect;
      });
    }
  }]);

  return RNG;
}();

},{"../lib/MersenneTwister.js":7}],7:[function(require,module,exports){
/*
  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  var m = new MersenneTwister();
  var randomNumber = m.random();
  You can also call the other genrand_{foo}() methods on the instance.
  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:
  var m = new MersenneTwister(123);
  and that will always produce the same random sequence.
  Sean McCullough (banksean@gmail.com)
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
   Before using, initialize the state by using init_seed(seed)
   or init_by_array(init_key, key_length).
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

var MersenneTwister = function(seed) {
	if (seed == undefined) {
		seed = new Date().getTime();
	}

	/* Period parameters */
	this.N = 624;
	this.M = 397;
	this.MATRIX_A = 0x9908b0df;   /* constant vector a */
	this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

	this.mt = new Array(this.N); /* the array for the state vector */
	this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

	if (seed.constructor == Array) {
		this.init_by_array(seed, seed.length);
	}
	else {
		this.init_seed(seed);
	}
}

/* initializes mt[N] with a seed */
/* origin name init_genrand */
MersenneTwister.prototype.init_seed = function(s) {
	this.mt[0] = s >>> 0;
	for (this.mti=1; this.mti<this.N; this.mti++) {
		var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
		+ this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect   */
		/* only MSBs of the array mt[].                        */
		/* 2002/01/09 modified by Makoto Matsumoto             */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
}

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
	var i, j, k;
	this.init_seed(19650218);
	i=1; j=0;
	k = (this.N>key_length ? this.N : key_length);
	for (; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
		+ init_key[j] + j; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++; j++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		if (j>=key_length) j=0;
	}
	for (k=this.N-1; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
		- i; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	}

	this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
}

/* generates a random number on [0,0xffffffff]-interval */
/* origin name genrand_int32 */
MersenneTwister.prototype.random_int = function() {
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A  for x=0,1 */

	if (this.mti >= this.N) { /* generate N words at one time */
		var kk;

		if (this.mti == this.N+1)  /* if init_seed() has not been called, */
			this.init_seed(5489);  /* a default initial seed is used */

		for (kk=0;kk<this.N-this.M;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		for (;kk<this.N-1;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
		this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	/* Tempering */
	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return y >>> 0;
}

/* generates a random number on [0,0x7fffffff]-interval */
/* origin name genrand_int31 */
MersenneTwister.prototype.random_int31 = function() {
	return (this.random_int()>>>1);
}

/* These real versions are due to Isaku Wada, 2002/01/09 added */
/* generates a random number on [0,1]-real-interval */
/* origin name genrand_real1 */
MersenneTwister.prototype.random_incl = function() {
	return this.random_int()*(1.0/4294967295.0);
	/* divided by 2^32-1 */
}

/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.random = function() {
	return this.random_int()*(1.0/4294967296.0);
	/* divided by 2^32 */
}

/* generates a random number on [0,1]-real-interval */
/* origin name genrand_real3 */
MersenneTwister.prototype.random_excl = function() {
	return (this.random_int() + 0.5)*(1.0/4294967296.0);
	/* divided by 2^32 */
}

/* generates a random number on [0,1] with 53-bit resolution*/
/* origin name genrand_res53 */
MersenneTwister.prototype.random_long = function() {
	var a=this.random_int()>>>5, b=this.random_int()>>>6;
	return(a*67108864.0+b)*(1.0/9007199254740992.0);
}

module.exports = MersenneTwister;

},{}],8:[function(require,module,exports){
// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

// NOTE:
// this varies from actual localStorage in some subtle ways

(function () {
	"use strict";

	// Don't attempt to require this until constructor is called
	var fs;

	function Storage(path, opts) {
		opts = opts || {};
		var db;
		fs = require('fs');

		Object.defineProperty(this, '___priv_bk___', {
			value: {
				path: path
			}
		, writable: false
		, enumerable: false
		});

		Object.defineProperty(this, '___priv_strict___', {
			value: !!opts.strict
		, writable: false
		, enumerable: false
		});

		Object.defineProperty(this, '___priv_ws___', {
			value: opts.ws || '  '
		, writable: false
		, enumerable: false
		});

		try {
			db = JSON.parse(fs.readFileSync(path));
		} catch(e) {
			db = {};
		}

		Object.keys(db).forEach(function (key) {
			this[key] = db[key];
		}, this);
	}

	Storage.prototype.getItem = function (key) {
		if (this.hasOwnProperty(key)) {
			if (this.___priv_strict___) {
				return String(this[key]);
			} else {
				return this[key];
			}
		}
		return null;
	};

	Storage.prototype.setItem = function (key, val) {
		if (val === undefined) {
			this[key] = null;
		} else if (this.___priv_strict___) {
			this[key] = String(val);
		} else {
			this[key] = val;
		}
		this.___save___();
	};

	Storage.prototype.removeItem = function (key) {
		delete this[key];
		this.___save___();
	};

	Storage.prototype.clear = function () {
		var self = this;
		// filters out prototype keys
		Object.keys(self).forEach(function (key) {
			self[key] = undefined;
			delete self[key];
		});
	};

	Storage.prototype.key = function (i) {
		i = i || 0;
		return Object.keys(this)[i];
	};

	Object.defineProperty(Storage.prototype, 'length', {
		get: function() {
			return Object.keys(this).length;
		}
	});

	Storage.prototype.___save___ = function () {
		var self = this;

		if (!this.___priv_bk___.path) {
			return;
		}

		if (this.___priv_bk___.lock) {
			this.___priv_bk___.wait = true;
			return;
		}

		this.___priv_bk___.lock = true;
		fs.writeFile(
			this.___priv_bk___.path
		, JSON.stringify(this, null, this.___priv_ws___)
		, 'utf8'
		, function (e) {
			self.___priv_bk___.lock = false;
			if (e) {
				console.error('Could not write to database', self.___priv_bk___.path);
				console.error(e);
				return;
			}
			if (self.___priv_bk___.wait) {
				self.___priv_bk___.wait = false;
				self.___save___();
			}
		});
	};

	Object.defineProperty(Storage, 'create', {
		value: function (path, opts) {
			return new Storage(path, opts);
		}
	, writable: false
	, enumerable: false
	});

	module.exports = Storage;
}());

},{"fs":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwic291cmNlL0FwcC5lczYiLCJzb3VyY2UvY2xhc3MvQ2xvY2suZXM2Iiwic291cmNlL2NsYXNzL0V2ZW50LmVzNiIsInNvdXJjZS9jbGFzcy9QZXJzaXN0LmVzNiIsInNvdXJjZS9jbGFzcy9STkcuZXM2Iiwic291cmNlL2xpYi9NZXJzZW5uZVR3aXN0ZXIuanMiLCJzb3VyY2UvbGliL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7O0FDQUE7OztBQUlBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFuQjs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsbUJBQUQsQ0FBbkI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQWpCOztBQUNBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBRCxDQUFyQjs7QUFFQSxPQUFPLENBQUMsR0FBUixDQUFZLCtCQUFaO0FBQ0EsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFKLEVBQVY7QUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxDQUFaO0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBRSxFQUFBLEtBQUssRUFBTCxLQUFGO0FBQVMsRUFBQSxLQUFLLEVBQUwsS0FBVDtBQUFnQixFQUFBLEdBQUcsRUFBSCxHQUFoQjtBQUFxQixFQUFBLE9BQU8sRUFBUDtBQUFyQixDQUFqQjs7QUFFQSxJQUFJLE9BQU8sTUFBUCxJQUFpQixXQUFyQixFQUFrQztBQUNqQyxFQUFBLE1BQU0sQ0FBQyxHQUFQLEdBQWEsTUFBTSxDQUFDLE9BQXBCO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxh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ZUFBUSxDQUFDLEdBQUcsS0FBTCxHQUFjLE9BQXJCO0FBQUEsT0FBWixDQUFQO0FBQ0E7QUFoRUY7O0FBQUE7QUFBQTs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIiLCIvKipcbiAqIFRoaXMgd2lsbCBiZSB0aGUgbWFpbiBhcHBsaWNhdGlvbi4gIEZvciBub3csIGp1c3QgcmVxdWlyZSBhbGwgb3VyIHBpZWNlcyBmb3IgYnJvd3NlcmlmeVxuICovXG5cbnZhciBDbG9jayA9IHJlcXVpcmUoJy4vY2xhc3MvQ2xvY2suZXM2Jyk7XG52YXIgRXZlbnQgPSByZXF1aXJlKCcuL2NsYXNzL0V2ZW50LmVzNicpO1xudmFyIFJORyA9IHJlcXVpcmUoJy4vY2xhc3MvUk5HLmVzNicpO1xudmFyIFBlcnNpc3QgPSByZXF1aXJlKCcuL2NsYXNzL1BlcnNpc3QuZXM2Jyk7XG5cbmNvbnNvbGUubG9nKFwiQXBwLmpzIHNldHRpbmcgbW9kdWxlIGV4cG9ydHNcIik7XG52YXIgcm5nID0gbmV3IFJORygpO1xuY29uc29sZS5sb2cocm5nLnJvbGwoXCIzZDZcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgQ2xvY2ssIEV2ZW50LCBSTkcsIFBlcnNpc3QgfTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIikge1xuXHR3aW5kb3cuQXBwID0gbW9kdWxlLmV4cG9ydHM7XG59XG4iLCJ2YXIgRXZlbnQgPSByZXF1aXJlKCcuL0V2ZW50LmVzNicpO1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDbG9jayBleHRlbmRzIEV2ZW50IHtcblx0LyoqXG5cdCAqIHJlc29sdXRpb246IG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmV0d2VlbiB0aWNrcyBvZiB0aGUgY2xvY2tcblx0ICogZXZlbnROYW1lOiBldmVudCBmb3IgY2xvY2sgdG8gZmlyZSB3aGVuIGl0IHRpY2tzXG5cdCAqIHJ1bm5pbmc6IGNsb2NrIGNhbiBiZSBzdGFydGVkIGFuZCBzdG9wcGVkIGxpa2UgYSBmb290YmFsbCBjbG9jay5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHtyZXNvbHV0aW9uID0gMTAwMCwgZXZlbnROYW1lID0gXCJ0aWNrXCIsIHJ1bm5pbmcgPSBmYWxzZX0gPSB7fSkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dmFyIGNvdW50ID0gMDtcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIHsgcmVzb2x1dGlvbiwgZXZlbnROYW1lLCBydW5uaW5nIH0pO1xuXHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmICh0aGlzLnJ1bm5pbmcpIHtcblx0XHRcdFx0dGhpcy5maXJlKHRoaXMuZXZlbnROYW1lLCBjb3VudCsrKTtcblx0XHRcdH1cblx0XHR9LCB0aGlzLnJlc29sdXRpb24pO1xuXHR9XG5cdC8qKlxuXHQgKiBjYWxsIHRoaXMgaGFuZGxlciBldmVyeSB0aW1lIHRoZSBjbG9jayB0aWNrc1xuXHQgKi9cblx0dGljayAoaGFuZGxlcikge1xuXHRcdHRoaXMub24odGhpcy5ldmVudE5hbWUsIGhhbmRsZXIpO1xuXHR9XG5cdC8qKlxuXHQgKiBzZXQgdGhlIHJ1bm5pbmcgc3RhdGUgb2YgdGhlIGNsb2NrIChjbG9jayBvbmx5IHRpY2tzIHdoZW4gaXQgaXMgcnVubmluZ1xuXHQgKi9cblx0cnVuIChib29sKSB7XG5cdFx0dGhpcy5ydW5uaW5nID0gYm9vbDtcblx0fVxuXHRzdGFydCAoKSB7XG5cdFx0dGhpcy5ydW5uaW5nID0gdHJ1ZTtcblx0fVxuXHRzdG9wICgpIHtcblx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblx0fVxuXHQvKipcblx0ICogcmV0dXJuIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYSBwYXJ0aWN1bGFyIHBvaW50IGhhcyBiZWVuIHJlYWNoZWRcblx0ICpcblx0ICogY2xvY2suYXQoMTAwKS50aGVuKCgpID0+IHsgY29uc29sZS5sb2coXCJjbG9jayByZWFjaGVkIDEwMCBzZWNvbmRzXCIpOyB9KTtcblx0ICovXG5cdGF0ICh0aWNrKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHZhciBjaGVja3RpY2sgPSAoY291bnQpID0+IHtcblx0XHRcdFx0aWYgKGNvdW50ID49IHRpY2spIHtcblx0XHRcdFx0XHRyZXNvbHZlKGNvdW50KTtcblx0XHRcdFx0XHR0aGlzLm9mZih0aGlzLmV2ZW50TmFtZSwgY2hlY2t0aWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHRoaXMub24odGhpcy5ldmVudE5hbWUsIGNoZWNrdGljayk7XG5cdFx0fSk7XG5cdH1cbn1cbiIsIi8qKlxuICogQmFzaWMgZXZlbnQgZmlyaW5nIGFuZCBsaXN0ZW5pbmcgZnVuY3Rpb25hbGl0eVxuICovXG57XG5cdC8qXG5cdCAqIHV0aWxpdHkgZnVuY3Rpb24gZm9yIHByb21pc2UtbW9kZSBjYXNlcyB3aGVyZSBubyBoYW5kbGVyIGlzIHBhc3NlZCBpblxuXHQgKiAoaW4gdGhhdCBjYXNlLCB0aGUgaGFuZGVyIGlzIHRoZSByZXNvbHZlciBvZiB0aGUgcHJvbWlzZSB3ZSB3aWxsIHJldHVybilcblx0ICovXG5cdGxldCBwcm9taXNlSGFuZGxlciA9ICgpID0+IHtcblx0XHR2YXIgaGFuZGxlcjtcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGhhbmRsZXIgPSByZXNvbHZlO1xuXHRcdH0pO1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9taXNlOiBwcm9taXNlLFxuXHRcdFx0aGFuZGxlcjogaGFuZGxlclxuXHRcdH07XG5cdH1cblx0Lypcblx0ICogZ2l2ZW4gYSBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHJldHVybiBhIHByb21pc2UsXG5cdCAqIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgZG9lcyByZXR1cm4gYSBwcm9taXNlXG5cdCAqL1xuXHRsZXQgcHJvbWlzaWZ5ID0gKGZ1bmMpID0+IHtcblx0XHRyZXR1cm4gKC4uLmFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGZ1bmMuYXBwbHkoZnVuYywgYXJncykpO1xuXHRcdH07XG5cdH07XG5cblx0LyoqXG5cdCAqIHRha2UgYSBoYW5kbGVyIGFuZCBtYWtlIGl0IHJlbW92ZSBpdHNlbGYgb25jZSBpdCBnZXRzIGNhbGxlZFxuXHQgKi9cblx0bGV0IG9uY2VpZnkgPSAoZXZlbnQsIGV2ZW50TmFtZSwgZnVuYykgPT4ge1xuXHRcdHZhciBvbmNlZnVuYyA9ICguLi5hcmdzKSA9PiB7XG5cdFx0XHR2YXIgcnZhbCA9IGZ1bmMuYXBwbHkoZnVuYywgYXJncyk7XG5cdFx0XHRldmVudC5vZmYoZXZlbnROYW1lLCBvbmNlZnVuYyk7XG5cdFx0XHRyZXR1cm4gcnZhbDtcblx0XHR9O1xuXHRcdHJldHVybiBvbmNlZnVuYztcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEV2ZW50IHtcblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcywge1xuXHRcdFx0XHRoYW5kbGVyczoge30sXG5cdFx0XHRcdHBheWxvYWRzOiB7fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCAqIGZpcmUgdGhlIG5hbWVkIGV2ZW50LCBhbG9uZyB3aXRoIG9wdGlvbmFsIHBheWxvYWRcblx0XHQgKiByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBhbGwgaGFuZGxlcnMgaGF2ZSBjb21wbGV0ZWRcblx0XHQgKi9cblx0XHRmaXJlKGV2ZW50TmFtZSwgcGF5bG9hZCkge1xuXHRcdFx0dGhpcy5wYXlsb2Fkc1tldmVudE5hbWVdID0gcGF5bG9hZDtcblx0XHRcdGlmICghKHRoaXMuaGFuZGxlcnNbZXZlbnROYW1lXSAmJiB0aGlzLmhhbmRsZXJzW2V2ZW50TmFtZV0ubGVuZ3RoKSkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5oYW5kbGVyc1tldmVudE5hbWVdLm1hcChoYW5kbGVyID0+IHtcblx0XHRcdFx0aGFuZGxlciA9IHByb21pc2lmeShoYW5kbGVyKTtcblx0XHRcdFx0cmV0dXJuIGhhbmRsZXIocGF5bG9hZCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCAqIGFkZCBhIGhhbmRsZXIgZm9yIGFuIGV2ZW50XG5cdFx0ICovXG5cdFx0b24oZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdFx0XHQvLyBtYWtlIHN1cmUgd2UgcmVwbGFjZSBpZiBjYWxsZWQgbXVsdGlwbGVcblx0XHRcdHRoaXMub2ZmKGV2ZW50TmFtZSwgaGFuZGxlcik7XG5cdFx0XHR0aGlzLmhhbmRsZXJzW2V2ZW50TmFtZV0gPSB0aGlzLmhhbmRsZXJzW2V2ZW50TmFtZV0gfHwgW107XG5cdFx0XHR0aGlzLmhhbmRsZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0ICogcmVtb3ZlIGEgaGFuZGxlciBmb3IgYW4gZXZlbnRcblx0XHQgKi9cblx0XHRvZmYoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdFx0XHRpZiAodGhpcy5oYW5kbGVyc1tldmVudE5hbWVdKSB7XG5cdFx0XHRcdHZhciBwb3NpdGlvbiA9IHRoaXMuaGFuZGxlcnNbZXZlbnROYW1lXS5pbmRleE9mKGhhbmRsZXIpO1xuXHRcdFx0XHRpZiAocG9zaXRpb24gIT0gLTEpIHtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZXJzW2V2ZW50TmFtZV0uc3BsaWNlKHBvc2l0aW9uLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvKlxuXHRcdCAqIGFkZCBhIG9uZS10aW1lIGhhbmRsZXIgZm9yIGFuIGV2ZW50XG5cdFx0ICogaGFuZGxlcjogb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24sIGJ1dCBjYW4gYWxzbyBiZSB1c2VkIGlucHJvbWlzZSBtb2RlXG5cdFx0ICpcblx0XHQgKiBldmVudC5vbmNlKFwidGlja1wiLCBmdW5jdGlvbi4uLilcblx0XHQgKiBldmVudC5vbmNlKFwidGlja1wiKS50aGVuKGZ1bmN0aW9uLi4uKVxuXHRcdCAqL1xuXHRcdG9uY2UoZXZlbnROYW1lLCBoKSB7XG5cdFx0XHR2YXIgcDtcblx0XHRcdHZhciB7cHJvbWlzZSxoYW5kbGVyfSA9IHByb21pc2VIYW5kbGVyKCk7XG5cdFx0XHRpZiAoIWgpIHtcblx0XHRcdFx0cCA9IHByb21pc2U7XG5cdFx0XHRcdGggPSBoYW5kbGVyO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5vbihldmVudE5hbWUsIG9uY2VpZnkodGhpcywgZXZlbnROYW1lLCBoKSk7XG5cdFx0XHRyZXR1cm4gcDtcblx0XHR9XG5cdFx0Lypcblx0XHQgKiByZXBsYXkgdGhlIG1vc3QgcmVjZW50IGZpcmluZyBvZiB0aGlzIGV2ZW50LCBvciBpZiBpdCBoYXNuJ3QgZmlyZWQgYXQgYWxsIHlldCwgd2FpdCBmb3IgaXRcblx0XHQgKiAoZml4ZXMgXCJsYXRlIGxpc3RlbmVyXCIgcHJvYmxlbXMpXG5cdFx0ICpcblx0XHQgKiBoYW5kbGVyOiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiwgYnV0IGNhbiBhbHNvIGJlIHVzZWQgaW4gcHJvbWlzZSBtb2RlXG5cdFx0ICpcblx0XHQgKiBldmVudC5sYXN0KFwibG9naW5cIiwgZnVuY3Rpb24uLi4uKVxuXHRcdCAqIGV2ZW50Lmxhc3QoXCJsb2dpblwiKS50aGVuKGZ1bmN0aW9uLi4uKVxuXHRcdCAqL1xuXHRcdGxhc3QoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdFx0XHR2YXIgcGF5bG9hZCA9IHRoaXMucGF5bG9hZHNbZXZlbnROYW1lXTtcblx0XHRcdGlmIChwYXlsb2FkKSB7XG5cdFx0XHRcdGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHBheWxvYWQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIioqSEFORExFUioqXCIsICEhaGFuZGxlcik7XG5cdFx0XHRcdHJldHVybiBoYW5kbGVyID8gcHJvbWlzZS50aGVuKGhhbmRsZXIpIDogcHJvbWlzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLm9uY2UoZXZlbnROYW1lLCBoYW5kbGVyKTtcblx0XHR9XG5cdH1cbn1cbiIsIi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYW55IHBlcnNpc3RlbnQgb2JqZWN0XG4gKi9cbntcblx0Lypcblx0ICogaWYgd2UgYXJlIG5vdCBpbiBhIGJyb3dzZXIsIGdldCBvdXJzZWx2ZXMgc29tZSBsb2NhbCBzdG9yYWdlXG5cdCAqL1xuXHRpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0dmFyIFN0b3JhZ2UgPSByZXF1aXJlKFwiLi4vbGliL2xvY2FsU3RvcmFnZS5qc1wiKTtcblx0XHR2YXIgbG9jYWxTdG9yYWdlID0gbmV3IFN0b3JhZ2UoXCIuL3BlcnNpc3QudHh0XCIpOyAvLyBUT0RPOiBzb21lIHdheSB0byBjb25maWd1cmVcblx0fVxuXHQvKlxuXHQgKiBEZWZhdWx0IHBlcnNpc3Rlci4gIFBlcnNpc3RlciBpcyBhIHNpbmdsZXRvbiB0aGF0IGNhbiBzYXZlL3Jlc3RvcmUvZGVsZXRlXG5cdCAqIGEgc3RyaW5nIHRvIGxvbmctdGVybSBzdG9yYWdlXG5cdCAqL1xuXHRsZXQgcGVyc2lzdGVyID0ge1xuXHRcdC8qKlxuXHRcdCAqIGdpdmVuIGFuIEBpZCB7U3RyaW5nfSBhbmQgYSBAdmFsdWUge1N0cmluZ30sIHJldHVybiBhIHtQcm9taXNlfSB0aGF0IGZ1bGZpbGxzXG5cdFx0ICogd2hlbiB0aGUgdmFsdWUgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHNhdmVkIHRvIGxvbmcgdGVybSBzdG9yYWdlXG5cdFx0ICovXG5cdFx0c2V0SXRlbTogZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oaWQsIHZhbHVlKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2l2ZW4gYW4gQGlkIHtTdHJpbmd9LCByZXR1cm4gYSB7UHJvbWlzZTxTdHJpbmc+fSByZXNvbHZlZCB3aXRoIHRoZSB2YWx1ZSBvZiB0aGUgSURcblx0XHQgKiBpZiBpdCBpcyBpbiBzdG9yYWdlLlxuXHRcdCAqXG5cdFx0ICogSWYgaXQgaXMgTk9UIGluIHN0b3JhZ2UsIGFuZCBkZmx0IHtTdHJpbmd9IGlzIGRlZmluZWQsIHRoZW4gc3RvcmUgdGhlIGRlZmF1bHQgYW5kIHJldHVybiB0aGF0XG5cdFx0ICpcblx0XHQgKiBJZiBpdCBpcyBOT1QgaW4gc3RvcmFnZSwgYWQgZGZsdCBpcyBOT1QgZGVmaW5lZCwgQHJldHVybiByZWplY3RlZCBwcm9taXNlXG5cdFx0ICovXG5cdFx0Z2V0SXRlbTogZnVuY3Rpb24gKGlkLCBkZmx0KSB7XG5cdFx0XHRpZiAobG9jYWxTdG9yYWdlLmhhc093blByb3BlcnR5KGlkKSkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGlkKSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGRmbHQgPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRyZXR1cm4gcGVyc2lzdGVyLnNldEl0ZW0oaWQsIGRmbHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcInN0b3JhZ2UgaGFzIG5vIGl0ZW0gXCIgKyBpZCkpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2l2ZW4gYW4gQGlkIHtTdHJpbmd9LCByZW1vdmUgaXRlbSBmcm9tIHN0b3JhZ2Ugd2l0aCB0aGF0IGlkLCBpZiBpdCBleGlzdHMuXG5cdFx0ICogcmV0dXJuIHtQcm9taXNlPGJvb2xlYW4+fSB0aGF0IHJlc29sdmVzIHdoZW4gaXRlbSBoYXMgYmVlbiByZW1vdmVkLiAgcmVzb2x2ZXMgZmFsc2Vcblx0XHQgKiBpZiB0aGUgaXRlbSB3YXMgbm90IGluIHN0b3JhZ2Vcblx0XHQgKi9cblx0XHRyZW1vdmVJdGVtOiBmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHZhciByZW1vdmVkID0gZmFsc2U7XG5cdFx0XHRpZiAobG9jYWxTdG9yYWdlLmhhc093blByb3BlcnR5KGlkKSkge1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShpZCk7XG5cdFx0XHRcdHJlbW92ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShyZW1vdmVkKTtcblx0XHR9XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQZXJzaXN0IHtcblx0XHRzdGF0aWMgc2V0UGVyc2lzdGVyKHBzKSB7XG5cdFx0XHQvLyBUT0RPOiBTYW5pdHkgY2hlY2sgdGhhdCB0aGlzIGlzIGEgdmFsaWQgcGVyc2lzdGVyXG5cdFx0XHQvLyBUT0RPOiBUaHJvdyBhbiBlcnJvciBpZiBhbnl0aGluZyBoYXMgYmVlbiBwZXJzaXN0ZWQgYWxyZWFkeSAob3IgZWxzZSBpbXBsZW1lbnQgcmUtcGVyc2lzdClcblx0XHRcdHBlcnNpc3RlciA9IHBzO1xuXHRcdH1cblx0XHQvKipcblx0XHQgKiBjcmVhdGUgYSBuZXcgcGVyc2lzdGVudCBvYmplY3QuIEBpZCB7U3RyaW5nfSBtdXN0IGJlIGdsb2JhbGx5IHVuaXF1ZVxuXHRcdCAqL1xuXHRcdGNvbnN0cnVjdG9yKGlkLCBkZmx0ID0ge30pIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaWQnLCB7XG5cdFx0XHRcdHZhbHVlOiBpZCxcblx0XHRcdFx0d3JpdGFibGU6IGZhbHNlLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnJlYWR5ID0gcGVyc2lzdGVyLmdldEl0ZW0oaWQsIHRoaXMuc2VyaWFsaXplKGRmbHQpKS50aGVuKChyKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBlcnNpc3RlbnQgPSB0aGlzLmRlc2VyaWFsaXplKHIpXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0ICogdHVybiBvdXIgcGVyc2lzdGVudCB2YWx1ZXMgaW50byBhIHN0cmluZy4gIERvbmUgYXMgYSBwdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIHNvIHN1YmNsYXNzZXNcblx0XHQgKiBjYW4gb3ZlcnJpZGUgaWYgdGhleSB3YW50IHRvIGRvIGl0IGEgZGlmZmVyZW50IHdheVxuXHRcdCAqL1xuXHRcdHNlcmlhbGl6ZShvYmopIHtcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuXHRcdH1cblx0XHRkZXNlcmlhbGl6ZShzdHIpIHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHN0cik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCAqIHBlcnNpc3Qgb3VyIGN1cnJlbnQgdmFsdWVzIHRvIGxvbmctdGVybSBzdG9yYWdlXG5cdFx0ICogQHJldHVybiB7UHJvbWlzZX0gdGhhdCByZXNvbHZlcyB3aGVuIHdlIGFyZSBzYXZlZC5cblx0XHQgKi9cblx0XHRwZXJzaXN0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkudGhlbigoKSA9PiB7XG5cdFx0XHRcdHBlcnNpc3Rlci5zZXRJdGVtKHRoaXMuaWQsIHRoaXMuc2VyaWFsaXplKHRoaXMucGVyc2lzdGVudCkpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG4iLCIvKipcbiAqIGdlbmVyYWwgcHVycG9zZSByYW5kb20gbnVtYmVyIGdlbmVyYXRvciBjbGFzcy5cbiAqIHdyYXBwZXIgYXJvdW5kIE1lcnNlbm5lVHdpc3RlciB3aXRoIHNvbWUgbmljZSBEJkQgZGljZSBmdW5jdGlvbnNcbiAqL1xuXG52YXIgTWVyc2VubmVUd2lzdGVyID0gcmVxdWlyZShcIi4uL2xpYi9NZXJzZW5uZVR3aXN0ZXIuanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJORyB7XG5cdGNvbnN0cnVjdG9yIChzZWVkKSB7XG5cdFx0dGhpcy5tZXJzZW5uZSA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoc2VlZCk7XG5cdH1cblx0LyoqXG5cdCAqIEByZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIEBsbyBhbmQgQGhpXG5cdCAqIGJlIGZvcmdpdmluZyBpZiB0aGV5IGdldCB0aGUgb3JkZXIgd3Jvbmdcblx0ICovXG5cdGJldHdlZW4obG8sIGhpKSB7XG5cdFx0dmFyIHJsbyA9IE1hdGgubWluKGxvLCBoaSk7XG5cdFx0dmFyIHJoaSA9IE1hdGgubWF4KGxvLCBoaSk7XG5cdFx0cmV0dXJuIHRoaXMubWVyc2VubmUucmFuZG9tX2ludCgpICUgKHJoaSAtIHJsbyArIDEpICsgcmxvO1xuXHR9XG5cdC8qKlxuXHQgKiBSb2xsIEBkaWNlIG51bWJlciBvZiBAc2lkZXMtc2lkZWQgZGljZSwgb3IgcGFzcyBpdCBpbiBhcyBhIHN0cmluZyBpZiB5b3UgcHJlZmVyXG5cdCAqIHRoaXMucm9sbCgzLCA2KVxuXHQgKiB0aGlzLnJvbGwoXCIzZDZcIilcblx0ICogdGhpcy5yb2xsKDYpIGlzIHRoZSBzYW1lIGFzIHRoaXMucm9sbCgxLCA2KVxuXHQgKi9cblx0cm9sbChkaWNlLCBzaWRlcykge1xuXHRcdC8qXG5cdFx0ICogcm9sbCAxIHMtc2lkZWQgZGllXG5cdFx0ICovXG5cdFx0dmFyIHJvbGwxID0gKHMpID0+IHtcblx0XHRcdHJldHVybiB0aGlzLmJldHdlZW4oMSwgcyk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgZGljZSA9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2YXIgbSA9IGRpY2UubWF0Y2goLyhcXGQrKWQoXFxkKykvaSk7XG5cdFx0XHRpZiAobSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5yb2xsKCttWzFdLCArbVsyXSk7XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSTkcucm9sbDogbWFsZm9ybWVkIHN0cmluZyBcIiArIGRpY2UpO1xuXHRcdH1cblx0XHRpZiAoIXNpZGVzKSB7XG5cdFx0XHRzaWRlcyA9IGRpY2U7XG5cdFx0XHRkaWNlID0gMTtcblx0XHR9XG5cdFx0aWYgKCFkaWNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSTkcucm9sbDogbm8gZGljZSB0byByb2xsXCIpO1xuXHRcdH1cblx0XHR2YXIgdG90YWwgPSAwO1xuXHRcdHdoaWxlKGRpY2UtLSkge1xuXHRcdFx0dG90YWwgKz0gcm9sbDEoc2lkZXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdG90YWw7XG5cdH1cblx0LyoqXG5cdCAqIHRlc3QgaG93IGZhaXIgb3VyIGRpY2UgYXJlIGJ5IHJvbGxpbmcgYSBidW5jaCBvZiB0aW1lcyBhbmQgc2VlaW5nIGhvdyBjbG9zZSB0aGUgcmVzdWx0cyBhcmUgdG8gcGVyZmVjdFxuXHQgKiBAc2lkZXMgdGhlIG51bWJlciBvZiBzaWRlcyBvbiBvdXIgdGVzdCBkaWVcblx0ICogQHJvbGxzIHRoZSBudW1iZXIgb2YgdGltZXMgdG8gcm9sbCB0aGUgdGVzdCBkaWVcblx0ICogQHJldHVybiBhbiBhcnJheSB3aXRoIGEgdmFsdWUgZm9yIGVhY2ggcmVzdWx0LCBzaG93aW5nIGhvdyBjbG9zZSB0byBcInBlcmZlY3RcIiB3ZSBhcmUgKDEuMCBtZWFucyBleGFjdGx5IGFzIGV4cGVjdGVkKVxuXHQgKi9cblx0dGVzdChzaWRlcyA9IDEwLCByb2xscyA9IDEwMDAwKSB7XG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcblx0XHR2YXIgcmVzdWx0O1xuXHRcdHZhciBwZXJmZWN0ID0gMSAvIHNpZGVzO1xuXHRcdHZhciBjb3VudCA9IHJvbGxzO1xuXG5cdFx0d2hpbGUgKGNvdW50LS0pIHtcblx0XHRcdHJlc3VsdCA9IHRoaXMucm9sbChzaWRlcyk7XG5cdFx0XHRyZXN1bHRzW3Jlc3VsdF0gPSByZXN1bHRzW3Jlc3VsdF0gfHwgMDtcblx0XHRcdHJlc3VsdHNbcmVzdWx0XSsrO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cy5tYXAoKG4pID0+IChuIC8gcm9sbHMpIC8gcGVyZmVjdCk7XG5cdH1cbn1cbiIsIi8qXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9iYW5rc2VhbiB3cmFwcGVkIE1ha290byBNYXRzdW1vdG8gYW5kIFRha3VqaSBOaXNoaW11cmEncyBjb2RlIGluIGEgbmFtZXNwYWNlXG4gIHNvIGl0J3MgYmV0dGVyIGVuY2Fwc3VsYXRlZC4gTm93IHlvdSBjYW4gaGF2ZSBtdWx0aXBsZSByYW5kb20gbnVtYmVyIGdlbmVyYXRvcnNcbiAgYW5kIHRoZXkgd29uJ3Qgc3RvbXAgYWxsIG92ZXIgZWFjaG90aGVyJ3Mgc3RhdGUuXG4gIElmIHlvdSB3YW50IHRvIHVzZSB0aGlzIGFzIGEgc3Vic3RpdHV0ZSBmb3IgTWF0aC5yYW5kb20oKSwgdXNlIHRoZSByYW5kb20oKVxuICBtZXRob2QgbGlrZSBzbzpcbiAgdmFyIG0gPSBuZXcgTWVyc2VubmVUd2lzdGVyKCk7XG4gIHZhciByYW5kb21OdW1iZXIgPSBtLnJhbmRvbSgpO1xuICBZb3UgY2FuIGFsc28gY2FsbCB0aGUgb3RoZXIgZ2VucmFuZF97Zm9vfSgpIG1ldGhvZHMgb24gdGhlIGluc3RhbmNlLlxuICBJZiB5b3Ugd2FudCB0byB1c2UgYSBzcGVjaWZpYyBzZWVkIGluIG9yZGVyIHRvIGdldCBhIHJlcGVhdGFibGUgcmFuZG9tXG4gIHNlcXVlbmNlLCBwYXNzIGFuIGludGVnZXIgaW50byB0aGUgY29uc3RydWN0b3I6XG4gIHZhciBtID0gbmV3IE1lcnNlbm5lVHdpc3RlcigxMjMpO1xuICBhbmQgdGhhdCB3aWxsIGFsd2F5cyBwcm9kdWNlIHRoZSBzYW1lIHJhbmRvbSBzZXF1ZW5jZS5cbiAgU2VhbiBNY0N1bGxvdWdoIChiYW5rc2VhbkBnbWFpbC5jb20pXG4qL1xuXG4vKlxuICAgQSBDLXByb2dyYW0gZm9yIE1UMTk5MzcsIHdpdGggaW5pdGlhbGl6YXRpb24gaW1wcm92ZWQgMjAwMi8xLzI2LlxuICAgQ29kZWQgYnkgVGFrdWppIE5pc2hpbXVyYSBhbmQgTWFrb3RvIE1hdHN1bW90by5cbiAgIEJlZm9yZSB1c2luZywgaW5pdGlhbGl6ZSB0aGUgc3RhdGUgYnkgdXNpbmcgaW5pdF9zZWVkKHNlZWQpXG4gICBvciBpbml0X2J5X2FycmF5KGluaXRfa2V5LCBrZXlfbGVuZ3RoKS5cbiAgIENvcHlyaWdodCAoQykgMTk5NyAtIDIwMDIsIE1ha290byBNYXRzdW1vdG8gYW5kIFRha3VqaSBOaXNoaW11cmEsXG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcbiAgIGFyZSBtZXQ6XG4gICAgIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICAgICAzLiBUaGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlXG4gICAgICAgIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlblxuICAgICAgICBwZXJtaXNzaW9uLlxuICAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICAgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuICAgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4gICBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1JcbiAgIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxuICAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxuICAgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SXG4gICBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GXG4gICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xuICAgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG4gICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAgIEFueSBmZWVkYmFjayBpcyB2ZXJ5IHdlbGNvbWUuXG4gICBodHRwOi8vd3d3Lm1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwL35tLW1hdC9NVC9lbXQuaHRtbFxuICAgZW1haWw6IG0tbWF0IEAgbWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAgKHJlbW92ZSBzcGFjZSlcbiovXG5cbnZhciBNZXJzZW5uZVR3aXN0ZXIgPSBmdW5jdGlvbihzZWVkKSB7XG5cdGlmIChzZWVkID09IHVuZGVmaW5lZCkge1xuXHRcdHNlZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fVxuXG5cdC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXG5cdHRoaXMuTiA9IDYyNDtcblx0dGhpcy5NID0gMzk3O1xuXHR0aGlzLk1BVFJJWF9BID0gMHg5OTA4YjBkZjsgICAvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xuXHR0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOyAvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG5cdHRoaXMuTE9XRVJfTUFTSyA9IDB4N2ZmZmZmZmY7IC8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xuXG5cdHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsgLyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXG5cdHRoaXMubXRpPXRoaXMuTisxOyAvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cblxuXHRpZiAoc2VlZC5jb25zdHJ1Y3RvciA9PSBBcnJheSkge1xuXHRcdHRoaXMuaW5pdF9ieV9hcnJheShzZWVkLCBzZWVkLmxlbmd0aCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhpcy5pbml0X3NlZWQoc2VlZCk7XG5cdH1cbn1cblxuLyogaW5pdGlhbGl6ZXMgbXRbTl0gd2l0aCBhIHNlZWQgKi9cbi8qIG9yaWdpbiBuYW1lIGluaXRfZ2VucmFuZCAqL1xuTWVyc2VubmVUd2lzdGVyLnByb3RvdHlwZS5pbml0X3NlZWQgPSBmdW5jdGlvbihzKSB7XG5cdHRoaXMubXRbMF0gPSBzID4+PiAwO1xuXHRmb3IgKHRoaXMubXRpPTE7IHRoaXMubXRpPHRoaXMuTjsgdGhpcy5tdGkrKykge1xuXHRcdHZhciBzID0gdGhpcy5tdFt0aGlzLm10aS0xXSBeICh0aGlzLm10W3RoaXMubXRpLTFdID4+PiAzMCk7XG5cdFx0dGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpXG5cdFx0KyB0aGlzLm10aTtcblx0XHQvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cblx0XHQvKiBJbiB0aGUgcHJldmlvdXMgdmVyc2lvbnMsIE1TQnMgb2YgdGhlIHNlZWQgYWZmZWN0ICAgKi9cblx0XHQvKiBvbmx5IE1TQnMgb2YgdGhlIGFycmF5IG10W10uICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0XHQvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cblx0XHR0aGlzLm10W3RoaXMubXRpXSA+Pj49IDA7XG5cdFx0LyogZm9yID4zMiBiaXQgbWFjaGluZXMgKi9cblx0fVxufVxuXG4vKiBpbml0aWFsaXplIGJ5IGFuIGFycmF5IHdpdGggYXJyYXktbGVuZ3RoICovXG4vKiBpbml0X2tleSBpcyB0aGUgYXJyYXkgZm9yIGluaXRpYWxpemluZyBrZXlzICovXG4vKiBrZXlfbGVuZ3RoIGlzIGl0cyBsZW5ndGggKi9cbi8qIHNsaWdodCBjaGFuZ2UgZm9yIEMrKywgMjAwNC8yLzI2ICovXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLmluaXRfYnlfYXJyYXkgPSBmdW5jdGlvbihpbml0X2tleSwga2V5X2xlbmd0aCkge1xuXHR2YXIgaSwgaiwgaztcblx0dGhpcy5pbml0X3NlZWQoMTk2NTAyMTgpO1xuXHRpPTE7IGo9MDtcblx0ayA9ICh0aGlzLk4+a2V5X2xlbmd0aCA/IHRoaXMuTiA6IGtleV9sZW5ndGgpO1xuXHRmb3IgKDsgazsgay0tKSB7XG5cdFx0dmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMClcblx0XHR0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG5cdFx0KyBpbml0X2tleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cblx0XHR0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cblx0XHRpKys7IGorKztcblx0XHRpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XG5cdFx0aWYgKGo+PWtleV9sZW5ndGgpIGo9MDtcblx0fVxuXHRmb3IgKGs9dGhpcy5OLTE7IGs7IGstLSkge1xuXHRcdHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xuXHRcdHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXG5cdFx0LSBpOyAvKiBub24gbGluZWFyICovXG5cdFx0dGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG5cdFx0aSsrO1xuXHRcdGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cblx0fVxuXG5cdHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xufVxuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4ZmZmZmZmZmZdLWludGVydmFsICovXG4vKiBvcmlnaW4gbmFtZSBnZW5yYW5kX2ludDMyICovXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLnJhbmRvbV9pbnQgPSBmdW5jdGlvbigpIHtcblx0dmFyIHk7XG5cdHZhciBtYWcwMSA9IG5ldyBBcnJheSgweDAsIHRoaXMuTUFUUklYX0EpO1xuXHQvKiBtYWcwMVt4XSA9IHggKiBNQVRSSVhfQSAgZm9yIHg9MCwxICovXG5cblx0aWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAvKiBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lICovXG5cdFx0dmFyIGtrO1xuXG5cdFx0aWYgKHRoaXMubXRpID09IHRoaXMuTisxKSAgLyogaWYgaW5pdF9zZWVkKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cblx0XHRcdHRoaXMuaW5pdF9zZWVkKDU0ODkpOyAgLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXG5cblx0XHRmb3IgKGtrPTA7a2s8dGhpcy5OLXRoaXMuTTtraysrKSB7XG5cdFx0XHR5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcblx0XHRcdHRoaXMubXRba2tdID0gdGhpcy5tdFtrayt0aGlzLk1dIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cdFx0fVxuXHRcdGZvciAoO2trPHRoaXMuTi0xO2trKyspIHtcblx0XHRcdHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xuXHRcdFx0dGhpcy5tdFtra10gPSB0aGlzLm10W2trKyh0aGlzLk0tdGhpcy5OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblx0XHR9XG5cdFx0eSA9ICh0aGlzLm10W3RoaXMuTi0xXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10WzBdJnRoaXMuTE9XRVJfTUFTSyk7XG5cdFx0dGhpcy5tdFt0aGlzLk4tMV0gPSB0aGlzLm10W3RoaXMuTS0xXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXG5cdFx0dGhpcy5tdGkgPSAwO1xuXHR9XG5cblx0eSA9IHRoaXMubXRbdGhpcy5tdGkrK107XG5cblx0LyogVGVtcGVyaW5nICovXG5cdHkgXj0gKHkgPj4+IDExKTtcblx0eSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XG5cdHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcblx0eSBePSAoeSA+Pj4gMTgpO1xuXG5cdHJldHVybiB5ID4+PiAwO1xufVxuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4N2ZmZmZmZmZdLWludGVydmFsICovXG4vKiBvcmlnaW4gbmFtZSBnZW5yYW5kX2ludDMxICovXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLnJhbmRvbV9pbnQzMSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gKHRoaXMucmFuZG9tX2ludCgpPj4+MSk7XG59XG5cbi8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDFdLXJlYWwtaW50ZXJ2YWwgKi9cbi8qIG9yaWdpbiBuYW1lIGdlbnJhbmRfcmVhbDEgKi9cbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUucmFuZG9tX2luY2wgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmFuZG9tX2ludCgpKigxLjAvNDI5NDk2NzI5NS4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyLTEgKi9cbn1cblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxXS1yZWFsLWludGVydmFsICovXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5yYW5kb21faW50KCkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuXHQvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbn1cblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxXS1yZWFsLWludGVydmFsICovXG4vKiBvcmlnaW4gbmFtZSBnZW5yYW5kX3JlYWwzICovXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLnJhbmRvbV9leGNsID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAodGhpcy5yYW5kb21faW50KCkgKyAwLjUpKigxLjAvNDI5NDk2NzI5Ni4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyICovXG59XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMV0gd2l0aCA1My1iaXQgcmVzb2x1dGlvbiovXG4vKiBvcmlnaW4gbmFtZSBnZW5yYW5kX3JlczUzICovXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLnJhbmRvbV9sb25nID0gZnVuY3Rpb24oKSB7XG5cdHZhciBhPXRoaXMucmFuZG9tX2ludCgpPj4+NSwgYj10aGlzLnJhbmRvbV9pbnQoKT4+PjY7XG5cdHJldHVybihhKjY3MTA4ODY0LjArYikqKDEuMC85MDA3MTk5MjU0NzQwOTkyLjApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lcnNlbm5lVHdpc3RlcjtcbiIsIi8vIGh0dHA6Ly93d3cucmFqZGVlcGQuY29tL2FydGljbGVzL2Nocm9tZS9sb2NhbHN0cmcvTG9jYWxTdG9yYWdlU2FtcGxlLmh0bVxuXG4vLyBOT1RFOlxuLy8gdGhpcyB2YXJpZXMgZnJvbSBhY3R1YWwgbG9jYWxTdG9yYWdlIGluIHNvbWUgc3VidGxlIHdheXNcblxuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly8gRG9uJ3QgYXR0ZW1wdCB0byByZXF1aXJlIHRoaXMgdW50aWwgY29uc3RydWN0b3IgaXMgY2FsbGVkXG5cdHZhciBmcztcblxuXHRmdW5jdGlvbiBTdG9yYWdlKHBhdGgsIG9wdHMpIHtcblx0XHRvcHRzID0gb3B0cyB8fCB7fTtcblx0XHR2YXIgZGI7XG5cdFx0ZnMgPSByZXF1aXJlKCdmcycpO1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfX19wcml2X2JrX19fJywge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cGF0aDogcGF0aFxuXHRcdFx0fVxuXHRcdCwgd3JpdGFibGU6IGZhbHNlXG5cdFx0LCBlbnVtZXJhYmxlOiBmYWxzZVxuXHRcdH0pO1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfX19wcml2X3N0cmljdF9fXycsIHtcblx0XHRcdHZhbHVlOiAhIW9wdHMuc3RyaWN0XG5cdFx0LCB3cml0YWJsZTogZmFsc2Vcblx0XHQsIGVudW1lcmFibGU6IGZhbHNlXG5cdFx0fSk7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19fX3ByaXZfd3NfX18nLCB7XG5cdFx0XHR2YWx1ZTogb3B0cy53cyB8fCAnICAnXG5cdFx0LCB3cml0YWJsZTogZmFsc2Vcblx0XHQsIGVudW1lcmFibGU6IGZhbHNlXG5cdFx0fSk7XG5cblx0XHR0cnkge1xuXHRcdFx0ZGIgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoKSk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRkYiA9IHt9O1xuXHRcdH1cblxuXHRcdE9iamVjdC5rZXlzKGRiKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHRoaXNba2V5XSA9IGRiW2tleV07XG5cdFx0fSwgdGhpcyk7XG5cdH1cblxuXHRTdG9yYWdlLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdGlmICh0aGlzLl9fX3ByaXZfc3RyaWN0X19fKSB7XG5cdFx0XHRcdHJldHVybiBTdHJpbmcodGhpc1trZXldKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9O1xuXG5cdFN0b3JhZ2UucHJvdG90eXBlLnNldEl0ZW0gPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcblx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXNba2V5XSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9fX3ByaXZfc3RyaWN0X19fKSB7XG5cdFx0XHR0aGlzW2tleV0gPSBTdHJpbmcodmFsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpc1trZXldID0gdmFsO1xuXHRcdH1cblx0XHR0aGlzLl9fX3NhdmVfX18oKTtcblx0fTtcblxuXHRTdG9yYWdlLnByb3RvdHlwZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdGRlbGV0ZSB0aGlzW2tleV07XG5cdFx0dGhpcy5fX19zYXZlX19fKCk7XG5cdH07XG5cblx0U3RvcmFnZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdC8vIGZpbHRlcnMgb3V0IHByb3RvdHlwZSBrZXlzXG5cdFx0T2JqZWN0LmtleXMoc2VsZikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRzZWxmW2tleV0gPSB1bmRlZmluZWQ7XG5cdFx0XHRkZWxldGUgc2VsZltrZXldO1xuXHRcdH0pO1xuXHR9O1xuXG5cdFN0b3JhZ2UucHJvdG90eXBlLmtleSA9IGZ1bmN0aW9uIChpKSB7XG5cdFx0aSA9IGkgfHwgMDtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcylbaV07XG5cdH07XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFN0b3JhZ2UucHJvdG90eXBlLCAnbGVuZ3RoJywge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcykubGVuZ3RoO1xuXHRcdH1cblx0fSk7XG5cblx0U3RvcmFnZS5wcm90b3R5cGUuX19fc2F2ZV9fXyA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRpZiAoIXRoaXMuX19fcHJpdl9ia19fXy5wYXRoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX19fcHJpdl9ia19fXy5sb2NrKSB7XG5cdFx0XHR0aGlzLl9fX3ByaXZfYmtfX18ud2FpdCA9IHRydWU7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX19wcml2X2JrX19fLmxvY2sgPSB0cnVlO1xuXHRcdGZzLndyaXRlRmlsZShcblx0XHRcdHRoaXMuX19fcHJpdl9ia19fXy5wYXRoXG5cdFx0LCBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCB0aGlzLl9fX3ByaXZfd3NfX18pXG5cdFx0LCAndXRmOCdcblx0XHQsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRzZWxmLl9fX3ByaXZfYmtfX18ubG9jayA9IGZhbHNlO1xuXHRcdFx0aWYgKGUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IHdyaXRlIHRvIGRhdGFiYXNlJywgc2VsZi5fX19wcml2X2JrX19fLnBhdGgpO1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2VsZi5fX19wcml2X2JrX19fLndhaXQpIHtcblx0XHRcdFx0c2VsZi5fX19wcml2X2JrX19fLndhaXQgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5fX19zYXZlX19fKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFN0b3JhZ2UsICdjcmVhdGUnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uIChwYXRoLCBvcHRzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFN0b3JhZ2UocGF0aCwgb3B0cyk7XG5cdFx0fVxuXHQsIHdyaXRhYmxlOiBmYWxzZVxuXHQsIGVudW1lcmFibGU6IGZhbHNlXG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gU3RvcmFnZTtcbn0oKSk7XG4iXX0=
