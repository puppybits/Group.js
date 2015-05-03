'use strict';

let Group = (function(){

	const ARR = Symbol('ARR'),
	  IDX = Symbol('IDX'),
		SORT = Symbol('SORT');

	class Group extends Object {
		constructor(arr, sort, presorted=false) {
			super();
			this[ARR] = arr.map(a => shallowCopy(a));
			this[SORT] = (Array.isArray(sort) ? sort : Object.keys(sort));

			// use default sort or allow for supplied custom sorting function
			var sorting = (Array.isArray(sort) ? 
				Array.apply(null, new Array(sort.length)).map(() => 
					(a,b) => (a > b ? 1 : (a  < b ? -1 : 0))) :
				this[SORT].map(s => sort[s]));

			// data must be sorted first
			if (!presorted){
				this[ARR].sort((a,b) => {
					let result;
					// sort on depth of sorters, only matches on higher level drills to lower levels
					sorting.some((sorter, d) => {
						result = sorter(a[this[SORT][d]], b[this[SORT][d]]);
						return (result === 0 ? false : true);
					});
					return result;
				});
			}

			this[IDX] = _groupOn(this[ARR], this[SORT], sorting);
		}

		count(idxPath) {
			return (idxPath ? drill(idxPath || 0, this[IDX]).count : this[IDX].length);
		}

		title(idxPath) {
			return (idxPath ? drill(idxPath || 0, this[IDX]).title : this[ARR].map(e => e.title));
		}

		item(idxPath) {
			let row = idxPath.splice(-1)[0];
			let i = drill(idxPath || 0, this[IDX]);
			if (i === undefined) {
				return undefined;
			}
			let j = i.idx + row;
			return this[ARR][j];
		}

		items() {
			return this[ARR];
		}
	}


	// private
	let shallowCopy = (obj) => 
		Object.keys(obj).reduce((o, k) => {
			o[k] = obj[k];
			return o;
		},{});

	let drill = (path, arr) => {
		var p = path[0],
		sub = Array.isArray(arr) ? arr[p] : arr.sub[p];
		path = path.slice(1);
		return (Array.isArray(path) && path.length ? drill(path, sub) : sub);
	};

	let _groupOn = (arr, props, matchers) => {
	  var lasts = Array.apply(null, new Array(props.length-1)),
	    mapProp = function(d, a, ref, i){ 
	      if (!lasts[d] && !props[d]) {
	        return ref;
	      }

	      if (lasts[d] !== undefined && matchers[d](a[props[d]], lasts[d]) === 0) {
	        ref.count++;  
	      } else {
	        ref = {count:1, idx:i, sub:[]};
	        lasts.splice(d+1); // reset back to the current level
	      }
	      lasts[d] = a[props[d]];
	      // debugging
	      ref.title = a[props[d]];
	      
	      var sub = (ref.sub.length && ref.sub[ref.sub.length-1] || {count:0, idx:i, sub:[]});
	      sub = mapProp(d+1, a, sub, i);
	      if (sub.count === 1) {
	        ref.sub.push(sub);
	      }
	      return ref;
	    };

	  // kick off grouping each row
	  let results = arr.reduce((idxs, a, i) => {
	    var ref = (idxs.length && idxs[idxs.length - 1] || { count: 0, idx:i, sub: [] });
	    ref = mapProp(0, a, ref, i);
	    if (ref.count === 1) {
	      idxs.push(ref);
	    }
	    return idxs;
	  }, []);
	  return results;
	};

	return Group;
}());


// module.exports = Group;	


