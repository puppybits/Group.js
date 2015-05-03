'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var Group = (function () {

	var ARR = Symbol('ARR'),
	    IDX = Symbol('IDX'),
	    SORT = Symbol('SORT');

	var Group = (function (_Object) {
		function Group(arr, sort) {
			var presorted = arguments[2] === undefined ? false : arguments[2];

			_classCallCheck(this, Group);

			var _this = new _Object();

			_this.__proto__ = Group.prototype;

			_this[ARR] = arr.map(function (a) {
				return shallowCopy(a);
			});
			_this[SORT] = Array.isArray(sort) ? sort : Object.keys(sort);

			// use default sort or allow for supplied custom sorting function
			var sorting = Array.isArray(sort) ? Array.apply(null, new Array(sort.length)).map(function () {
				return function (a, b) {
					return a > b ? 1 : a < b ? -1 : 0;
				};
			}) : _this[SORT].map(function (s) {
				return sort[s];
			});

			// data must be sorted first
			if (!presorted) {
				_this[ARR].sort(function (a, b) {
					var result = undefined;
					// sort on depth of sorters, only matches on higher level drills to lower levels
					sorting.some(function (sorter, d) {
						result = sorter(a[_this[SORT][d]], b[_this[SORT][d]]);
						return result === 0 ? false : true;
					});
					return result;
				});
			}

			_this[IDX] = _groupOn(_this[ARR], _this[SORT], sorting);
			return _this;
		}

		_inherits(Group, _Object);

		_createClass(Group, [{
			key: 'count',
			value: function count(idxPath) {
				return idxPath ? drill(idxPath || 0, this[IDX]).count : this[IDX].length;
			}
		}, {
			key: 'title',
			value: function title(idxPath) {
				return idxPath ? drill(idxPath || 0, this[IDX]).title : this[ARR].map(function (e) {
					return e.title;
				});
			}
		}, {
			key: 'item',
			value: function item(idxPath) {
				var row = idxPath.splice(-1)[0];
				var i = drill(idxPath || 0, this[IDX]);
				if (i === undefined) {
					return undefined;
				}
				var j = i.idx + row;
				return this[ARR][j];
			}
		}, {
			key: 'items',
			value: function items() {
				return this[ARR];
			}
		}]);

		return Group;
	})(Object);

	// private
	var shallowCopy = function shallowCopy(obj) {
		return Object.keys(obj).reduce(function (o, k) {
			o[k] = obj[k];
			return o;
		}, {});
	};

	var drill = (function (_drill) {
		function drill(_x, _x2) {
			return _drill.apply(this, arguments);
		}

		drill.toString = function () {
			return _drill.toString();
		};

		return drill;
	})(function (path, arr) {
		var p = path[0],
		    sub = Array.isArray(arr) ? arr[p] : arr.sub[p];
		path = path.slice(1);
		return Array.isArray(path) && path.length ? drill(path, sub) : sub;
	});

	var _groupOn = function _groupOn(arr, props, matchers) {
		var lasts = Array.apply(null, new Array(props.length - 1)),
		    mapProp = (function (_mapProp) {
			function mapProp(_x3, _x4, _x5, _x6) {
				return _mapProp.apply(this, arguments);
			}

			mapProp.toString = function () {
				return _mapProp.toString();
			};

			return mapProp;
		})(function (d, a, ref, i) {
			if (!lasts[d] && !props[d]) {
				return ref;
			}

			if (lasts[d] !== undefined && matchers[d](a[props[d]], lasts[d]) === 0) {
				ref.count++;
			} else {
				ref = { count: 1, idx: i, sub: [] };
				lasts.splice(d + 1); // reset back to the current level
			}
			lasts[d] = a[props[d]];
			// debugging
			ref.title = a[props[d]];

			var sub = ref.sub.length && ref.sub[ref.sub.length - 1] || { count: 0, idx: i, sub: [] };
			sub = mapProp(d + 1, a, sub, i);
			if (sub.count === 1) {
				ref.sub.push(sub);
			}
			return ref;
		});

		// kick off grouping each row
		var results = arr.reduce(function (idxs, a, i) {
			var ref = idxs.length && idxs[idxs.length - 1] || { count: 0, idx: i, sub: [] };
			ref = mapProp(0, a, ref, i);
			if (ref.count === 1) {
				idxs.push(ref);
			}
			return idxs;
		}, []);
		return results;
	};

	return Group;
})();

// module.exports = Group;

