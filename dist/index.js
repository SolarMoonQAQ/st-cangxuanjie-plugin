//#region \0rolldown/runtime.js
var e = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), t = /* @__PURE__ */ e(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, ee || (ee = !0, S());
			else {
				var t = n(l);
				t !== null && se(x, t.startTime - e);
			}
		}
	}
	var ee = !1, te = -1, ne = 5, re = -1;
	function ie() {
		return g ? !0 : !(e.unstable_now() - re < ne);
	}
	function ae() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			re = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(te), te = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ie());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && se(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? S() : ee = !1;
			}
		}
	}
	var S;
	if (typeof y == "function") S = function() {
		y(ae);
	};
	else if (typeof MessageChannel < "u") {
		var oe = new MessageChannel(), C = oe.port2;
		oe.port1.onmessage = ae, S = function() {
			C.postMessage(null);
		};
	} else S = function() {
		_(ae, 0);
	};
	function se(t, n) {
		te = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ne = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(te), te = -1) : h = !0, se(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, S()))), r;
	}, e.unstable_shouldYield = ie, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), n = /* @__PURE__ */ e(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t() {
			if (x = !1, re) {
				var t = e.unstable_now();
				S = t;
				var n = !0;
				try {
					a: {
						y = !1, b && (b = !1, te(ie), ie = -1), v = !0;
						var a = _;
						try {
							b: {
								for (o(t), g = r(p); g !== null && !(g.expirationTime > t && c());) {
									var u = g.callback;
									if (typeof u == "function") {
										g.callback = null, _ = g.priorityLevel;
										var d = u(g.expirationTime <= t);
										if (t = e.unstable_now(), typeof d == "function") {
											g.callback = d, o(t), n = !0;
											break b;
										}
										g === r(p) && i(p), o(t);
									} else i(p);
									g = r(p);
								}
								if (g !== null) n = !0;
								else {
									var f = r(m);
									f !== null && l(s, f.startTime - t), n = !1;
								}
							}
							break a;
						} finally {
							g = null, _ = a, v = !1;
						}
						n = void 0;
					}
				} finally {
					n ? oe() : re = !1;
				}
			}
		}
		function n(e, t) {
			var n = e.length;
			e.push(t);
			a: for (; 0 < n;) {
				var r = n - 1 >>> 1, i = e[r];
				if (0 < a(i, t)) e[r] = t, e[n] = i, n = r;
				else break a;
			}
		}
		function r(e) {
			return e.length === 0 ? null : e[0];
		}
		function i(e) {
			if (e.length === 0) return null;
			var t = e[0], n = e.pop();
			if (n !== t) {
				e[0] = n;
				a: for (var r = 0, i = e.length, o = i >>> 1; r < o;) {
					var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
					if (0 > a(c, n)) l < i && 0 > a(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
					else if (l < i && 0 > a(u, n)) e[r] = u, e[l] = n, r = l;
					else break a;
				}
			}
			return t;
		}
		function a(e, t) {
			var n = e.sortIndex - t.sortIndex;
			return n === 0 ? e.id - t.id : n;
		}
		function o(e) {
			for (var t = r(m); t !== null;) {
				if (t.callback === null) i(m);
				else if (t.startTime <= e) i(m), t.sortIndex = t.expirationTime, n(p, t);
				else break;
				t = r(m);
			}
		}
		function s(e) {
			if (b = !1, o(e), !y) {
				if (r(p) !== null) y = !0, re || (re = !0, oe());
				else {
					var t = r(m);
					t !== null && l(s, t.startTime - e);
				}
			}
		}
		function c() {
			return x ? !0 : !(e.unstable_now() - S < ae);
		}
		function l(t, n) {
			ie = ee(function() {
				t(e.unstable_now());
			}, n);
		}
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error()), e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
			var u = performance;
			e.unstable_now = function() {
				return u.now();
			};
		} else {
			var d = Date, f = d.now();
			e.unstable_now = function() {
				return d.now() - f;
			};
		}
		var p = [], m = [], h = 1, g = null, _ = 3, v = !1, y = !1, b = !1, x = !1, ee = typeof setTimeout == "function" ? setTimeout : null, te = typeof clearTimeout == "function" ? clearTimeout : null, ne = typeof setImmediate < "u" ? setImmediate : null, re = !1, ie = -1, ae = 5, S = -1;
		if (typeof ne == "function") var oe = function() {
			ne(t);
		};
		else if (typeof MessageChannel < "u") {
			var C = new MessageChannel(), se = C.port2;
			C.port1.onmessage = t, oe = function() {
				se.postMessage(null);
			};
		} else oe = function() {
			ee(t, 0);
		};
		e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
			e.callback = null;
		}, e.unstable_forceFrameRate = function(e) {
			0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ae = 0 < e ? Math.floor(1e3 / e) : 5;
		}, e.unstable_getCurrentPriorityLevel = function() {
			return _;
		}, e.unstable_next = function(e) {
			switch (_) {
				case 1:
				case 2:
				case 3:
					var t = 3;
					break;
				default: t = _;
			}
			var n = _;
			_ = t;
			try {
				return e();
			} finally {
				_ = n;
			}
		}, e.unstable_requestPaint = function() {
			x = !0;
		}, e.unstable_runWithPriority = function(e, t) {
			switch (e) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5: break;
				default: e = 3;
			}
			var n = _;
			_ = e;
			try {
				return t();
			} finally {
				_ = n;
			}
		}, e.unstable_scheduleCallback = function(t, i, a) {
			var o = e.unstable_now();
			switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, t) {
				case 1:
					var c = -1;
					break;
				case 2:
					c = 250;
					break;
				case 5:
					c = 1073741823;
					break;
				case 4:
					c = 1e4;
					break;
				default: c = 5e3;
			}
			return c = a + c, t = {
				id: h++,
				callback: i,
				priorityLevel: t,
				startTime: a,
				expirationTime: c,
				sortIndex: -1
			}, a > o ? (t.sortIndex = a, n(m, t), r(p) === null && t === r(m) && (b ? (te(ie), ie = -1) : b = !0, l(s, a - o))) : (t.sortIndex = c, n(p, t), y || v || (y = !0, re || (re = !0, oe()))), t;
		}, e.unstable_shouldYield = c, e.unstable_wrapCallback = function(e) {
			var t = _;
			return function() {
				var n = _;
				_ = t;
				try {
					return e.apply(this, arguments);
				} finally {
					_ = n;
				}
			};
		}, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), r = /* @__PURE__ */ e(((e, r) => {
	r.exports = process.env.NODE_ENV === "production" ? t() : n();
})), i = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var ee = Array.isArray;
	function te() {}
	var ne = {
		H: null,
		A: null,
		T: null,
		S: null
	}, re = Object.prototype.hasOwnProperty;
	function ie(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ae(e, t) {
		return ie(e.type, t, e.props);
	}
	function S(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function oe(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var C = /\/+/g;
	function se(e, t) {
		return typeof e == "object" && e && e.key != null ? oe("" + e.key) : t.toString(36);
	}
	function ce(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(te, te) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function w(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, w(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + se(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(C, "$&/") + "/"), w(o, r, i, "", function(e) {
			return e;
		})) : o != null && (S(o) && (o = ae(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(C, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + se(a, u), c += w(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + se(a, u++), c += w(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return w(ce(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function le(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return w(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ue(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var T = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, E = {
		map: le,
		forEach: function(e, t, n) {
			le(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return le(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return le(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!S(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = E, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ne, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return ne.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !re.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return ie(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) re.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return ie(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = S, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ue
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = ne.T, n = {};
		ne.T = n;
		try {
			var r = e(), i = ne.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(te, T);
		} catch (e) {
			T(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), ne.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return ne.H.useCacheRefresh();
	}, e.use = function(e) {
		return ne.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return ne.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return ne.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return ne.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return ne.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return ne.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return ne.H.useEffectEvent(e);
	}, e.useId = function() {
		return ne.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return ne.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return ne.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return ne.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return ne.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return ne.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return ne.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return ne.H.useRef(e);
	}, e.useState = function(e) {
		return ne.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return ne.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return ne.H.useTransition();
	}, e.version = "19.2.8";
})), a = /* @__PURE__ */ e(((e, t) => {
	process.env.NODE_ENV !== "production" && (function() {
		function n(e, t) {
			Object.defineProperty(a.prototype, e, { get: function() {
				console.warn("%s(...) is deprecated in plain JavaScript React classes. %s", t[0], t[1]);
			} });
		}
		function r(e) {
			return typeof e != "object" || !e ? null : (e = xe && e[xe] || e["@@iterator"], typeof e == "function" ? e : null);
		}
		function i(e, t) {
			e = (e = e.constructor) && (e.displayName || e.name) || "ReactClass";
			var n = e + "." + t;
			Se[n] || (console.error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", t, e), Se[n] = !0);
		}
		function a(e, t, n) {
			this.props = e, this.context = t, this.refs = we, this.updater = n || Ce;
		}
		function o() {}
		function s(e, t, n) {
			this.props = e, this.context = t, this.refs = we, this.updater = n || Ce;
		}
		function c() {}
		function l(e) {
			return "" + e;
		}
		function u(e) {
			try {
				l(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var n = t.error, r = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return n.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", r), l(e);
			}
		}
		function d(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === De ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case E: return "Fragment";
				case fe: return "Profiler";
				case de: return "StrictMode";
				case ge: return "Suspense";
				case _e: return "SuspenseList";
				case be: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case T: return "Portal";
				case me: return e.displayName || "Context";
				case pe: return (e._context.displayName || "Context") + ".Consumer";
				case he:
					var t = e.render;
					return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case ve: return t = e.displayName || null, t === null ? d(e.type) || "Memo" : t;
				case ye:
					t = e._payload, e = e._init;
					try {
						return d(e(t));
					} catch {}
			}
			return null;
		}
		function f(e) {
			if (e === E) return "<>";
			if (typeof e == "object" && e && e.$$typeof === ye) return "<...>";
			try {
				var t = d(e);
				return t ? "<" + t + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function p() {
			var e = O.A;
			return e === null ? null : e.getOwner();
		}
		function m() {
			return Error("react-stack-top-frame");
		}
		function h(e) {
			if (Oe.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function g(e, t) {
			function n() {
				Ae || (Ae = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function _() {
			var e = d(this.type);
			return Me[e] || (Me[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function v(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: ue,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: _
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function y(e, t) {
			return t = v(e.type, t, e.props, e._owner, e._debugStack, e._debugTask), e._store && (t._store.validated = e._store.validated), t;
		}
		function b(e) {
			x(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === ye && (e._payload.status === "fulfilled" ? x(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function x(e) {
			return typeof e == "object" && !!e && e.$$typeof === ue;
		}
		function ee(e) {
			var t = {
				"=": "=0",
				":": "=2"
			};
			return "$" + e.replace(/[=:]/g, function(e) {
				return t[e];
			});
		}
		function te(e, t) {
			return typeof e == "object" && e && e.key != null ? (u(e.key), ee("" + e.key)) : t.toString(36);
		}
		function ne(e) {
			switch (e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
				default: switch (typeof e.status == "string" ? e.then(c, c) : (e.status = "pending", e.then(function(t) {
					e.status === "pending" && (e.status = "fulfilled", e.value = t);
				}, function(t) {
					e.status === "pending" && (e.status = "rejected", e.reason = t);
				})), e.status) {
					case "fulfilled": return e.value;
					case "rejected": throw e.reason;
				}
			}
			throw e;
		}
		function re(e, t, n, i, a) {
			var o = typeof e;
			(o === "undefined" || o === "boolean") && (e = null);
			var s = !1;
			if (e === null) s = !0;
			else switch (o) {
				case "bigint":
				case "string":
				case "number":
					s = !0;
					break;
				case "object": switch (e.$$typeof) {
					case ue:
					case T:
						s = !0;
						break;
					case ye: return s = e._init, re(s(e._payload), t, n, i, a);
				}
			}
			if (s) {
				s = e, a = a(s);
				var c = i === "" ? "." + te(s, 0) : i;
				return Ee(a) ? (n = "", c != null && (n = c.replace(Ie, "$&/") + "/"), re(a, t, n, "", function(e) {
					return e;
				})) : a != null && (x(a) && (a.key != null && (s && s.key === a.key || u(a.key)), n = y(a, n + (a.key == null || s && s.key === a.key ? "" : ("" + a.key).replace(Ie, "$&/") + "/") + c), i !== "" && s != null && x(s) && s.key == null && s._store && !s._store.validated && (n._store.validated = 2), a = n), t.push(a)), 1;
			}
			if (s = 0, c = i === "" ? "." : i + ":", Ee(e)) for (var l = 0; l < e.length; l++) i = e[l], o = c + te(i, l), s += re(i, t, n, o, a);
			else if (l = r(e), typeof l == "function") for (l === e.entries && (Fe || console.warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Fe = !0), e = l.call(e), l = 0; !(i = e.next()).done;) i = i.value, o = c + te(i, l++), s += re(i, t, n, o, a);
			else if (o === "object") {
				if (typeof e.then == "function") return re(ne(e), t, n, i, a);
				throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
			}
			return s;
		}
		function ie(e, t, n) {
			if (e == null) return e;
			var r = [], i = 0;
			return re(e, r, "", "", function(e) {
				return t.call(n, e, i++);
			}), r;
		}
		function ae(e) {
			if (e._status === -1) {
				var t = e._ioInfo;
				t != null && (t.start = t.end = performance.now()), t = e._result;
				var n = t();
				if (n.then(function(t) {
					if (e._status === 0 || e._status === -1) {
						e._status = 1, e._result = t;
						var r = e._ioInfo;
						r != null && (r.end = performance.now()), n.status === void 0 && (n.status = "fulfilled", n.value = t);
					}
				}, function(t) {
					if (e._status === 0 || e._status === -1) {
						e._status = 2, e._result = t;
						var r = e._ioInfo;
						r != null && (r.end = performance.now()), n.status === void 0 && (n.status = "rejected", n.reason = t);
					}
				}), t = e._ioInfo, t != null) {
					t.value = n;
					var r = n.displayName;
					typeof r == "string" && (t.name = r);
				}
				e._status === -1 && (e._status = 0, e._result = n);
			}
			if (e._status === 1) return t = e._result, t === void 0 && console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", t), "default" in t || console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", t), t.default;
			throw e._result;
		}
		function S() {
			var e = O.H;
			return e === null && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."), e;
		}
		function oe() {
			O.asyncTransitions--;
		}
		function C(e) {
			if (ze === null) try {
				var n = ("require" + Math.random()).slice(0, 7);
				ze = (t && t[n]).call(t, "timers").setImmediate;
			} catch {
				ze = function(e) {
					!1 === Re && (Re = !0, typeof MessageChannel > "u" && console.error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
					var t = new MessageChannel();
					t.port1.onmessage = e, t.port2.postMessage(void 0);
				};
			}
			return ze(e);
		}
		function se(e) {
			return 1 < e.length && typeof AggregateError == "function" ? AggregateError(e) : e[0];
		}
		function ce(e, t) {
			t !== Be - 1 && console.error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Be = t;
		}
		function w(e, t, n) {
			var r = O.actQueue;
			if (r !== null) {
				if (r.length !== 0) try {
					le(r), C(function() {
						return w(e, t, n);
					});
					return;
				} catch (e) {
					O.thrownErrors.push(e);
				}
				else O.actQueue = null;
			}
			0 < O.thrownErrors.length ? (r = se(O.thrownErrors), O.thrownErrors.length = 0, n(r)) : t(e);
		}
		function le(e) {
			if (!He) {
				He = !0;
				var t = 0;
				try {
					for (; t < e.length; t++) {
						var n = e[t];
						do {
							O.didUsePromise = !1;
							var r = n(!1);
							if (r !== null) {
								if (O.didUsePromise) {
									e[t] = n, e.splice(0, t);
									return;
								}
								n = r;
							} else break;
						} while (1);
					}
					e.length = 0;
				} catch (n) {
					e.splice(0, t + 1), O.thrownErrors.push(n);
				} finally {
					He = !1;
				}
			}
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var ue = Symbol.for("react.transitional.element"), T = Symbol.for("react.portal"), E = Symbol.for("react.fragment"), de = Symbol.for("react.strict_mode"), fe = Symbol.for("react.profiler"), pe = Symbol.for("react.consumer"), me = Symbol.for("react.context"), he = Symbol.for("react.forward_ref"), ge = Symbol.for("react.suspense"), _e = Symbol.for("react.suspense_list"), ve = Symbol.for("react.memo"), ye = Symbol.for("react.lazy"), be = Symbol.for("react.activity"), xe = Symbol.iterator, Se = {}, Ce = {
			isMounted: function() {
				return !1;
			},
			enqueueForceUpdate: function(e) {
				i(e, "forceUpdate");
			},
			enqueueReplaceState: function(e) {
				i(e, "replaceState");
			},
			enqueueSetState: function(e) {
				i(e, "setState");
			}
		}, D = Object.assign, we = {};
		Object.freeze(we), a.prototype.isReactComponent = {}, a.prototype.setState = function(e, t) {
			if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
			this.updater.enqueueSetState(this, e, t, "setState");
		}, a.prototype.forceUpdate = function(e) {
			this.updater.enqueueForceUpdate(this, e, "forceUpdate");
		};
		var Te = {
			isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
			replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
		};
		for (We in Te) Te.hasOwnProperty(We) && n(We, Te[We]);
		o.prototype = a.prototype, Te = s.prototype = new o(), Te.constructor = s, D(Te, a.prototype), Te.isPureReactComponent = !0;
		var Ee = Array.isArray, De = Symbol.for("react.client.reference"), O = {
			H: null,
			A: null,
			T: null,
			S: null,
			actQueue: null,
			asyncTransitions: 0,
			isBatchingLegacy: !1,
			didScheduleLegacyUpdate: !1,
			didUsePromise: !1,
			thrownErrors: [],
			getCurrentStack: null,
			recentlyCreatedOwnerStacks: 0
		}, Oe = Object.prototype.hasOwnProperty, ke = console.createTask ? console.createTask : function() {
			return null;
		};
		Te = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var Ae, je, Me = {}, Ne = Te.react_stack_bottom_frame.bind(Te, m)(), Pe = ke(f(m)), Fe = !1, Ie = /\/+/g, Le = typeof reportError == "function" ? reportError : function(e) {
			if (typeof window == "object" && typeof window.ErrorEvent == "function") {
				var t = new window.ErrorEvent("error", {
					bubbles: !0,
					cancelable: !0,
					message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
					error: e
				});
				if (!window.dispatchEvent(t)) return;
			} else if (typeof process == "object" && typeof process.emit == "function") {
				process.emit("uncaughtException", e);
				return;
			}
			console.error(e);
		}, Re = !1, ze = null, Be = 0, Ve = !1, He = !1, Ue = typeof queueMicrotask == "function" ? function(e) {
			queueMicrotask(function() {
				return queueMicrotask(e);
			});
		} : C;
		Te = Object.freeze({
			__proto__: null,
			c: function(e) {
				return S().useMemoCache(e);
			}
		});
		var We = {
			map: ie,
			forEach: function(e, t, n) {
				ie(e, function() {
					t.apply(this, arguments);
				}, n);
			},
			count: function(e) {
				var t = 0;
				return ie(e, function() {
					t++;
				}), t;
			},
			toArray: function(e) {
				return ie(e, function(e) {
					return e;
				}) || [];
			},
			only: function(e) {
				if (!x(e)) throw Error("React.Children.only expected to receive a single React element child.");
				return e;
			}
		};
		e.Activity = be, e.Children = We, e.Component = a, e.Fragment = E, e.Profiler = fe, e.PureComponent = s, e.StrictMode = de, e.Suspense = ge, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = O, e.__COMPILER_RUNTIME = Te, e.act = function(e) {
			var t = O.actQueue, n = Be;
			Be++;
			var r = O.actQueue = t === null ? [] : t, i = !1;
			try {
				var a = e();
			} catch (e) {
				O.thrownErrors.push(e);
			}
			if (0 < O.thrownErrors.length) throw ce(t, n), e = se(O.thrownErrors), O.thrownErrors.length = 0, e;
			if (typeof a == "object" && a && typeof a.then == "function") {
				var o = a;
				return Ue(function() {
					i || Ve || (Ve = !0, console.error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
				}), { then: function(e, a) {
					i = !0, o.then(function(i) {
						if (ce(t, n), n === 0) {
							try {
								le(r), C(function() {
									return w(i, e, a);
								});
							} catch (e) {
								O.thrownErrors.push(e);
							}
							if (0 < O.thrownErrors.length) {
								var o = se(O.thrownErrors);
								O.thrownErrors.length = 0, a(o);
							}
						} else e(i);
					}, function(e) {
						ce(t, n), 0 < O.thrownErrors.length ? (e = se(O.thrownErrors), O.thrownErrors.length = 0, a(e)) : a(e);
					});
				} };
			}
			var s = a;
			if (ce(t, n), n === 0 && (le(r), r.length !== 0 && Ue(function() {
				i || Ve || (Ve = !0, console.error("A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"));
			}), O.actQueue = null), 0 < O.thrownErrors.length) throw e = se(O.thrownErrors), O.thrownErrors.length = 0, e;
			return { then: function(e, t) {
				i = !0, n === 0 ? (O.actQueue = r, C(function() {
					return w(s, e, t);
				})) : e(s);
			} };
		}, e.cache = function(e) {
			return function() {
				return e.apply(null, arguments);
			};
		}, e.cacheSignal = function() {
			return null;
		}, e.captureOwnerStack = function() {
			var e = O.getCurrentStack;
			return e === null ? null : e();
		}, e.cloneElement = function(e, t, n) {
			if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
			var r = D({}, e.props), i = e.key, a = e._owner;
			if (t != null) {
				var o;
				a: {
					if (Oe.call(t, "ref") && (o = Object.getOwnPropertyDescriptor(t, "ref").get) && o.isReactWarning) {
						o = !1;
						break a;
					}
					o = t.ref !== void 0;
				}
				for (s in o && (a = p()), h(t) && (u(t.key), i = "" + t.key), t) !Oe.call(t, s) || s === "key" || s === "__self" || s === "__source" || s === "ref" && t.ref === void 0 || (r[s] = t[s]);
			}
			var s = arguments.length - 2;
			if (s === 1) r.children = n;
			else if (1 < s) {
				o = Array(s);
				for (var c = 0; c < s; c++) o[c] = arguments[c + 2];
				r.children = o;
			}
			for (r = v(e.type, i, r, a, e._debugStack, e._debugTask), i = 2; i < arguments.length; i++) b(arguments[i]);
			return r;
		}, e.createContext = function(e) {
			return e = {
				$$typeof: me,
				_currentValue: e,
				_currentValue2: e,
				_threadCount: 0,
				Provider: null,
				Consumer: null
			}, e.Provider = e, e.Consumer = {
				$$typeof: pe,
				_context: e
			}, e._currentRenderer = null, e._currentRenderer2 = null, e;
		}, e.createElement = function(e, t, n) {
			for (var r = 2; r < arguments.length; r++) b(arguments[r]);
			r = {};
			var i = null;
			if (t != null) for (c in je || !("__self" in t) || "key" in t || (je = !0, console.warn("Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform")), h(t) && (u(t.key), i = "" + t.key), t) Oe.call(t, c) && c !== "key" && c !== "__self" && c !== "__source" && (r[c] = t[c]);
			var a = arguments.length - 2;
			if (a === 1) r.children = n;
			else if (1 < a) {
				for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
				Object.freeze && Object.freeze(o), r.children = o;
			}
			if (e && e.defaultProps) for (c in a = e.defaultProps, a) r[c] === void 0 && (r[c] = a[c]);
			i && g(r, typeof e == "function" ? e.displayName || e.name || "Unknown" : e);
			var c = 1e4 > O.recentlyCreatedOwnerStacks++;
			return v(e, i, r, p(), c ? Error("react-stack-top-frame") : Ne, c ? ke(f(e)) : Pe);
		}, e.createRef = function() {
			var e = { current: null };
			return Object.seal(e), e;
		}, e.forwardRef = function(e) {
			e != null && e.$$typeof === ve ? console.error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof e == "function" ? e.length !== 0 && e.length !== 2 && console.error("forwardRef render functions accept exactly two parameters: props and ref. %s", e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.") : console.error("forwardRef requires a render function but was given %s.", e === null ? "null" : typeof e), e != null && e.defaultProps != null && console.error("forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?");
			var t = {
				$$typeof: he,
				render: e
			}, n;
			return Object.defineProperty(t, "displayName", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return n;
				},
				set: function(t) {
					n = t, e.name || e.displayName || (Object.defineProperty(e, "name", { value: t }), e.displayName = t);
				}
			}), t;
		}, e.isValidElement = x, e.lazy = function(e) {
			e = {
				_status: -1,
				_result: e
			};
			var t = {
				$$typeof: ye,
				_payload: e,
				_init: ae
			}, n = {
				name: "lazy",
				start: -1,
				end: -1,
				value: null,
				owner: null,
				debugStack: Error("react-stack-top-frame"),
				debugTask: console.createTask ? console.createTask("lazy()") : null
			};
			return e._ioInfo = n, t._debugInfo = [{ awaited: n }], t;
		}, e.memo = function(e, t) {
			e ?? console.error("memo: The first argument must be a component. Instead received: %s", e === null ? "null" : typeof e), t = {
				$$typeof: ve,
				type: e,
				compare: t === void 0 ? null : t
			};
			var n;
			return Object.defineProperty(t, "displayName", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return n;
				},
				set: function(t) {
					n = t, e.name || e.displayName || (Object.defineProperty(e, "name", { value: t }), e.displayName = t);
				}
			}), t;
		}, e.startTransition = function(e) {
			var t = O.T, n = {};
			n._updatedFibers = /* @__PURE__ */ new Set(), O.T = n;
			try {
				var r = e(), i = O.S;
				i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && (O.asyncTransitions++, r.then(oe, oe), r.then(c, Le));
			} catch (e) {
				Le(e);
			} finally {
				t === null && n._updatedFibers && (e = n._updatedFibers.size, n._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.")), t !== null && n.types !== null && (t.types !== null && t.types !== n.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), t.types = n.types), O.T = t;
			}
		}, e.unstable_useCacheRefresh = function() {
			return S().useCacheRefresh();
		}, e.use = function(e) {
			return S().use(e);
		}, e.useActionState = function(e, t, n) {
			return S().useActionState(e, t, n);
		}, e.useCallback = function(e, t) {
			return S().useCallback(e, t);
		}, e.useContext = function(e) {
			var t = S();
			return e.$$typeof === pe && console.error("Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"), t.useContext(e);
		}, e.useDebugValue = function(e, t) {
			return S().useDebugValue(e, t);
		}, e.useDeferredValue = function(e, t) {
			return S().useDeferredValue(e, t);
		}, e.useEffect = function(e, t) {
			return e ?? console.warn("React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"), S().useEffect(e, t);
		}, e.useEffectEvent = function(e) {
			return S().useEffectEvent(e);
		}, e.useId = function() {
			return S().useId();
		}, e.useImperativeHandle = function(e, t, n) {
			return S().useImperativeHandle(e, t, n);
		}, e.useInsertionEffect = function(e, t) {
			return e ?? console.warn("React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"), S().useInsertionEffect(e, t);
		}, e.useLayoutEffect = function(e, t) {
			return e ?? console.warn("React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"), S().useLayoutEffect(e, t);
		}, e.useMemo = function(e, t) {
			return S().useMemo(e, t);
		}, e.useOptimistic = function(e, t) {
			return S().useOptimistic(e, t);
		}, e.useReducer = function(e, t, n) {
			return S().useReducer(e, t, n);
		}, e.useRef = function(e) {
			return S().useRef(e);
		}, e.useState = function(e) {
			return S().useState(e);
		}, e.useSyncExternalStore = function(e, t, n) {
			return S().useSyncExternalStore(e, t, n);
		}, e.useTransition = function() {
			return S().useTransition();
		}, e.version = "19.2.8", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), o = /* @__PURE__ */ e(((e, t) => {
	t.exports = process.env.NODE_ENV === "production" ? i() : a();
})), s = /* @__PURE__ */ e(((e) => {
	var t = o();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function s(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var c = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function l(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return s(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = c.T, n = i.p;
		try {
			if (c.T = null, i.p = 2, e) return e();
		} finally {
			c.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = l(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = l(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = l(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = l(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return c.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return c.H.useHostTransitionStatus();
	}, e.version = "19.2.8";
})), c = /* @__PURE__ */ e(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t() {}
		function n(e) {
			return "" + e;
		}
		function r(e, t, r) {
			var i = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
			try {
				n(i);
				var a = !1;
			} catch {
				a = !0;
			}
			return a && (console.error("The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", typeof Symbol == "function" && Symbol.toStringTag && i[Symbol.toStringTag] || i.constructor.name || "Object"), n(i)), {
				$$typeof: d,
				key: i == null ? null : "" + i,
				children: e,
				containerInfo: t,
				implementation: r
			};
		}
		function i(e, t) {
			if (e === "font") return "";
			if (typeof t == "string") return t === "use-credentials" ? t : "";
		}
		function a(e) {
			return e === null ? "`null`" : e === void 0 ? "`undefined`" : e === "" ? "an empty string" : "something with type \"" + typeof e + "\"";
		}
		function s(e) {
			return e === null ? "`null`" : e === void 0 ? "`undefined`" : e === "" ? "an empty string" : typeof e == "string" ? JSON.stringify(e) : typeof e == "number" ? "`" + e + "`" : "something with type \"" + typeof e + "\"";
		}
		function c() {
			var e = f.H;
			return e === null && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."), e;
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var l = o(), u = {
			d: {
				f: t,
				r: function() {
					throw Error("Invalid form element. requestFormReset must be passed a form that was rendered by React.");
				},
				D: t,
				C: t,
				L: t,
				m: t,
				X: t,
				S: t,
				M: t
			},
			p: 0,
			findDOMNode: null
		}, d = Symbol.for("react.portal"), f = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
		typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, e.createPortal = function(e, t) {
			var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
			if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error("Target container is not a DOM element.");
			return r(e, t, null, n);
		}, e.flushSync = function(e) {
			var t = f.T, n = u.p;
			try {
				if (f.T = null, u.p = 2, e) return e();
			} finally {
				f.T = t, u.p = n, u.d.f() && console.error("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.");
			}
		}, e.preconnect = function(e, t) {
			typeof e == "string" && e ? t != null && typeof t != "object" ? console.error("ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.", s(t)) : t != null && typeof t.crossOrigin != "string" && console.error("ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.", a(t.crossOrigin)) : console.error("ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e)), typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, u.d.C(e, t));
		}, e.prefetchDNS = function(e) {
			if (typeof e != "string" || !e) console.error("ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e));
			else if (1 < arguments.length) {
				var t = arguments[1];
				typeof t == "object" && t.hasOwnProperty("crossOrigin") ? console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", s(t)) : console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", s(t));
			}
			typeof e == "string" && u.d.D(e);
		}, e.preinit = function(e, t) {
			if (typeof e == "string" && e ? typeof t != "object" || !t ? console.error("ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.", s(t)) : t.as !== "style" && t.as !== "script" && console.error("ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are \"style\" and \"script\".", s(t.as)) : console.error("ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e)), typeof e == "string" && t && typeof t.as == "string") {
				var n = t.as, r = i(n, t.crossOrigin), o = typeof t.integrity == "string" ? t.integrity : void 0, c = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
				n === "style" ? u.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
					crossOrigin: r,
					integrity: o,
					fetchPriority: c
				}) : n === "script" && u.d.X(e, {
					crossOrigin: r,
					integrity: o,
					fetchPriority: c,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		}, e.preinitModule = function(e, t) {
			var n = "";
			if (typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), t !== void 0 && typeof t != "object" ? n += " The `options` argument encountered was " + a(t) + "." : t && "as" in t && t.as !== "script" && (n += " The `as` option encountered was " + s(t.as) + "."), n) console.error("ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s", n);
			else switch (n = t && typeof t.as == "string" ? t.as : "script", n) {
				case "script": break;
				default: n = s(n), console.error("ReactDOM.preinitModule(): Currently the only supported \"as\" type for this function is \"script\" but received \"%s\" instead. This warning was generated for `href` \"%s\". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)", n, e);
			}
			typeof e == "string" && (typeof t == "object" && t ? (t.as == null || t.as === "script") && (n = i(t.as, t.crossOrigin), u.d.M(e, {
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			})) : t ?? u.d.M(e));
		}, e.preload = function(e, t) {
			var n = "";
			if (typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), typeof t != "object" || !t ? n += " The `options` argument encountered was " + a(t) + "." : typeof t.as == "string" && t.as || (n += " The `as` option encountered was " + a(t.as) + "."), n && console.error("ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel=\"preload\" as=\"...\" />` tag.%s", n), typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
				n = t.as;
				var r = i(n, t.crossOrigin);
				u.d.L(e, n, {
					crossOrigin: r,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					type: typeof t.type == "string" ? t.type : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
					referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
					imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
					imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
					media: typeof t.media == "string" ? t.media : void 0
				});
			}
		}, e.preloadModule = function(e, t) {
			var n = "";
			typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), t !== void 0 && typeof t != "object" ? n += " The `options` argument encountered was " + a(t) + "." : t && "as" in t && typeof t.as != "string" && (n += " The `as` option encountered was " + a(t.as) + "."), n && console.error("ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel=\"modulepreload\" as=\"...\" />` tag.%s", n), typeof e == "string" && (t ? (n = i(t.as, t.crossOrigin), u.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			})) : u.d.m(e));
		}, e.requestFormReset = function(e) {
			u.d.r(e);
		}, e.unstable_batchedUpdates = function(e, t) {
			return e(t);
		}, e.useFormState = function(e, t, n) {
			return c().useFormState(e, t, n);
		}, e.useFormStatus = function() {
			return c().useHostTransitionStatus();
		}, e.version = "19.2.8", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), l = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
			if (process.env.NODE_ENV !== "production") throw Error("^_^");
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (e) {
				console.error(e);
			}
		}
	}
	process.env.NODE_ENV === "production" ? (n(), t.exports = s()) : t.exports = c();
})), u = /* @__PURE__ */ e(((e) => {
	var t = r(), n = o(), i = l();
	function a(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function s(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function c(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function u(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function d(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function f(e) {
		if (c(e) !== e) throw Error(a(188));
	}
	function p(e) {
		var t = e.alternate;
		if (!t) {
			if (t = c(e), t === null) throw Error(a(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var i = n.return;
			if (i === null) break;
			var o = i.alternate;
			if (o === null) {
				if (r = i.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (i.child === o.child) {
				for (o = i.child; o;) {
					if (o === n) return f(i), e;
					if (o === r) return f(i), t;
					o = o.sibling;
				}
				throw Error(a(188));
			}
			if (n.return !== r.return) n = i, r = o;
			else {
				for (var s = !1, l = i.child; l;) {
					if (l === n) {
						s = !0, n = i, r = o;
						break;
					}
					if (l === r) {
						s = !0, r = i, n = o;
						break;
					}
					l = l.sibling;
				}
				if (!s) {
					for (l = o.child; l;) {
						if (l === n) {
							s = !0, n = o, r = i;
							break;
						}
						if (l === r) {
							s = !0, r = o, n = i;
							break;
						}
						l = l.sibling;
					}
					if (!s) throw Error(a(189));
				}
			}
			if (n.alternate !== r) throw Error(a(190));
		}
		if (n.tag !== 3) throw Error(a(188));
		return n.stateNode.current === n ? e : t;
	}
	function m(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = m(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), te = Symbol.for("react.context"), ne = Symbol.for("react.forward_ref"), re = Symbol.for("react.suspense"), ie = Symbol.for("react.suspense_list"), ae = Symbol.for("react.memo"), S = Symbol.for("react.lazy"), oe = Symbol.for("react.activity"), C = Symbol.for("react.memo_cache_sentinel"), se = Symbol.iterator;
	function ce(e) {
		return typeof e != "object" || !e ? null : (e = se && e[se] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var w = Symbol.for("react.client.reference");
	function le(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === w ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case re: return "Suspense";
			case ie: return "SuspenseList";
			case oe: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case te: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case ne:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ae: return t = e.displayName || null, t === null ? le(e.type) || "Memo" : t;
			case S:
				t = e._payload, e = e._init;
				try {
					return le(e(t));
				} catch {}
		}
		return null;
	}
	var ue = Array.isArray, T = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, E = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, de = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, fe = [], pe = -1;
	function me(e) {
		return { current: e };
	}
	function he(e) {
		0 > pe || (e.current = fe[pe], fe[pe] = null, pe--);
	}
	function ge(e, t) {
		pe++, fe[pe] = e.current, e.current = t;
	}
	var _e = me(null), ve = me(null), ye = me(null), be = me(null);
	function xe(e, t) {
		switch (ge(ye, t), ge(ve, e), ge(_e, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? nf(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = nf(t), e = rf(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		he(_e), ge(_e, e);
	}
	function Se() {
		he(_e), he(ve), he(ye);
	}
	function Ce(e) {
		e.memoizedState !== null && ge(be, e);
		var t = _e.current, n = rf(t, e.type);
		t !== n && (ge(ve, e), ge(_e, n));
	}
	function D(e) {
		ve.current === e && (he(_e), he(ve)), be.current === e && (he(be), dp._currentValue = de);
	}
	var we, Te;
	function Ee(e) {
		if (we === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			we = t && t[1] || "", Te = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + we + e + Te;
	}
	var De = !1;
	function O(e, t) {
		if (!e || De) return "";
		De = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			De = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ee(n) : "";
	}
	function Oe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ee(e.type);
			case 16: return Ee("Lazy");
			case 13: return e.child !== t && t !== null ? Ee("Suspense Fallback") : Ee("Suspense");
			case 19: return Ee("SuspenseList");
			case 0:
			case 15: return O(e.type, !1);
			case 11: return O(e.type.render, !1);
			case 1: return O(e.type, !0);
			case 31: return Ee("Activity");
			default: return "";
		}
	}
	function ke(e) {
		try {
			var t = "", n = null;
			do
				t += Oe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ae = Object.prototype.hasOwnProperty, je = t.unstable_scheduleCallback, Me = t.unstable_cancelCallback, Ne = t.unstable_shouldYield, Pe = t.unstable_requestPaint, Fe = t.unstable_now, Ie = t.unstable_getCurrentPriorityLevel, Le = t.unstable_ImmediatePriority, Re = t.unstable_UserBlockingPriority, ze = t.unstable_NormalPriority, Be = t.unstable_LowPriority, Ve = t.unstable_IdlePriority, He = t.log, Ue = t.unstable_setDisableYieldValue, We = null, Ge = null;
	function Ke(e) {
		if (typeof He == "function" && Ue(e), Ge && typeof Ge.setStrictMode == "function") try {
			Ge.setStrictMode(We, e);
		} catch {}
	}
	var qe = Math.clz32 ? Math.clz32 : Xe, Je = Math.log, Ye = Math.LN2;
	function Xe(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Je(e) / Ye | 0) | 0;
	}
	var Ze = 256, Qe = 262144, $e = 4194304;
	function et(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function tt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = et(n))) : i = et(o) : i = et(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = et(n))) : i = et(o)) : i = et(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function nt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function rt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function it() {
		var e = $e;
		return $e <<= 1, !($e & 62914560) && ($e = 4194304), e;
	}
	function at(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function ot(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function st(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - qe(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ct(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ct(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - qe(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function lt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - qe(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ut(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : dt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function dt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function ft(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function pt() {
		var e = E.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Dp(e.type)) : e;
	}
	function mt(e, t) {
		var n = E.p;
		try {
			return E.p = e, t();
		} finally {
			E.p = n;
		}
	}
	var ht = Math.random().toString(36).slice(2), gt = "__reactFiber$" + ht, _t = "__reactProps$" + ht, vt = "__reactContainer$" + ht, yt = "__reactEvents$" + ht, bt = "__reactListeners$" + ht, xt = "__reactHandles$" + ht, St = "__reactResources$" + ht, Ct = "__reactMarker$" + ht;
	function wt(e) {
		delete e[gt], delete e[_t], delete e[yt], delete e[bt], delete e[xt];
	}
	function Tt(e) {
		var t = e[gt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[vt] || n[gt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Ef(e); e !== null;) {
					if (n = e[gt]) return n;
					e = Ef(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Et(e) {
		if (e = e[gt] || e[vt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Dt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(a(33));
	}
	function Ot(e) {
		var t = e[St];
		return t ||= e[St] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function kt(e) {
		e[Ct] = !0;
	}
	var At = /* @__PURE__ */ new Set(), jt = {};
	function Mt(e, t) {
		Nt(e, t), Nt(e + "Capture", t);
	}
	function Nt(e, t) {
		for (jt[e] = t, e = 0; e < t.length; e++) At.add(t[e]);
	}
	var Pt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ft = {}, It = {};
	function Lt(e) {
		return Ae.call(It, e) ? !0 : Ae.call(Ft, e) ? !1 : Pt.test(e) ? It[e] = !0 : (Ft[e] = !0, !1);
	}
	function Rt(e, t, n) {
		if (Lt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, "" + n);
			}
		}
	}
	function zt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Bt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Vt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Ht(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Ut(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Wt(e) {
		if (!e._valueTracker) {
			var t = Ht(e) ? "checked" : "value";
			e._valueTracker = Ut(e, t, "" + e[t]);
		}
	}
	function Gt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Ht(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	function Kt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var qt = /[\n"\\]/g;
	function Jt(e) {
		return e.replace(qt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Yt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Zt(e, o, Vt(n)) : Zt(e, o, Vt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Vt(s) : e.removeAttribute("name");
	}
	function Xt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Wt(e);
				return;
			}
			n = n == null ? "" : "" + Vt(n), t = t == null ? n : "" + Vt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Wt(e);
	}
	function Zt(e, t, n) {
		t === "number" && Kt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Qt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Vt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function $t(e, t, n) {
		if (t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Vt(n);
	}
	function en(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(a(92));
				if (ue(r)) {
					if (1 < r.length) throw Error(a(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Vt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Wt(e);
	}
	function tn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var nn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function rn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || nn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function an(e, t, n) {
		if (t != null && typeof t != "object") throw Error(a(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var i in t) r = t[i], t.hasOwnProperty(i) && n[i] !== r && rn(e, i, r);
		} else for (var o in t) t.hasOwnProperty(o) && rn(e, o, t[o]);
	}
	function on(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var sn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), cn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function ln(e) {
		return cn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function un() {}
	var dn = null;
	function fn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var pn = null, mn = null;
	function hn(e) {
		var t = Et(e);
		if (t && (e = t.stateNode)) {
			var n = e[_t] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Yt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Jt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[_t] || null;
								if (!i) throw Error(a(90));
								Yt(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Gt(r);
					}
					break a;
				case "textarea":
					$t(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Qt(e, !!n.multiple, t, !1);
			}
		}
	}
	var gn = !1;
	function _n(e, t, n) {
		if (gn) return e(t, n);
		gn = !0;
		try {
			return e(t);
		} finally {
			if (gn = !1, (pn !== null || mn !== null) && (Nu(), pn && (t = pn, e = mn, mn = pn = null, hn(t), e))) for (t = 0; t < e.length; t++) hn(e[t]);
		}
	}
	function vn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[_t] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(a(231, t, typeof n));
		return n;
	}
	var yn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), bn = !1;
	if (yn) try {
		var xn = {};
		Object.defineProperty(xn, "passive", { get: function() {
			bn = !0;
		} }), window.addEventListener("test", xn, xn), window.removeEventListener("test", xn, xn);
	} catch {
		bn = !1;
	}
	var Sn = null, Cn = null, wn = null;
	function Tn() {
		if (wn) return wn;
		var e, t = Cn, n = t.length, r, i = "value" in Sn ? Sn.value : Sn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return wn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function En(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Dn() {
		return !0;
	}
	function On() {
		return !1;
	}
	function kn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Dn : On, this.isPropagationStopped = On, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Dn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Dn);
			},
			persist: function() {},
			isPersistent: Dn
		}), t;
	}
	var An = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, jn = kn(An), Mn = h({}, An, {
		view: 0,
		detail: 0
	}), Nn = kn(Mn), Pn, Fn, In, Ln = h({}, Mn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: Jn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== In && (In && e.type === "mousemove" ? (Pn = e.screenX - In.screenX, Fn = e.screenY - In.screenY) : Fn = Pn = 0, In = e), Pn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Fn;
		}
	}), Rn = kn(Ln), zn = kn(h({}, Ln, { dataTransfer: 0 })), Bn = kn(h({}, Mn, { relatedTarget: 0 })), Vn = kn(h({}, An, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Hn = kn(h({}, An, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Un = kn(h({}, An, { data: 0 })), Wn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Gn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Kn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function qn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Kn[e]) ? !!t[e] : !1;
	}
	function Jn() {
		return qn;
	}
	var Yn = kn(h({}, Mn, {
		key: function(e) {
			if (e.key) {
				var t = Wn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = En(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Gn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Jn,
		charCode: function(e) {
			return e.type === "keypress" ? En(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? En(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Xn = kn(h({}, Ln, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Zn = kn(h({}, Mn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Jn
	})), Qn = kn(h({}, An, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), $n = kn(h({}, Ln, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), er = kn(h({}, An, {
		newState: 0,
		oldState: 0
	})), tr = [
		9,
		13,
		27,
		32
	], nr = yn && "CompositionEvent" in window, rr = null;
	yn && "documentMode" in document && (rr = document.documentMode);
	var ir = yn && "TextEvent" in window && !rr, ar = yn && (!nr || rr && 8 < rr && 11 >= rr), or = " ", sr = !1;
	function cr(e, t) {
		switch (e) {
			case "keyup": return tr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function lr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var ur = !1;
	function dr(e, t) {
		switch (e) {
			case "compositionend": return lr(t);
			case "keypress": return t.which === 32 ? (sr = !0, or) : null;
			case "textInput": return e = t.data, e === or && sr ? null : e;
			default: return null;
		}
	}
	function fr(e, t) {
		if (ur) return e === "compositionend" || !nr && cr(e, t) ? (e = Tn(), wn = Cn = Sn = null, ur = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return ar && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var pr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function mr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!pr[e.type] : t === "textarea";
	}
	function hr(e, t, n, r) {
		pn ? mn ? mn.push(r) : mn = [r] : pn = r, t = Bd(t, "onChange"), 0 < t.length && (n = new jn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var gr = null, _r = null;
	function vr(e) {
		Nd(e, 0);
	}
	function yr(e) {
		if (Gt(Dt(e))) return e;
	}
	function br(e, t) {
		if (e === "change") return t;
	}
	var xr = !1;
	if (yn) {
		var Sr;
		if (yn) {
			var Cr = "oninput" in document;
			if (!Cr) {
				var wr = document.createElement("div");
				wr.setAttribute("oninput", "return;"), Cr = typeof wr.oninput == "function";
			}
			Sr = Cr;
		} else Sr = !1;
		xr = Sr && (!document.documentMode || 9 < document.documentMode);
	}
	function Tr() {
		gr && (gr.detachEvent("onpropertychange", Er), _r = gr = null);
	}
	function Er(e) {
		if (e.propertyName === "value" && yr(_r)) {
			var t = [];
			hr(t, _r, e, fn(e)), _n(vr, t);
		}
	}
	function Dr(e, t, n) {
		e === "focusin" ? (Tr(), gr = t, _r = n, gr.attachEvent("onpropertychange", Er)) : e === "focusout" && Tr();
	}
	function Or(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return yr(_r);
	}
	function kr(e, t) {
		if (e === "click") return yr(t);
	}
	function Ar(e, t) {
		if (e === "input" || e === "change") return yr(t);
	}
	function jr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Mr = typeof Object.is == "function" ? Object.is : jr;
	function Nr(e, t) {
		if (Mr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ae.call(t, i) || !Mr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Pr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Fr(e, t) {
		var n = Pr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Pr(n);
		}
	}
	function Ir(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ir(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Lr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Kt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Kt(e.document);
		}
		return t;
	}
	function Rr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var zr = yn && "documentMode" in document && 11 >= document.documentMode, Br = null, Vr = null, Hr = null, Ur = !1;
	function Wr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Ur || Br == null || Br !== Kt(r) || (r = Br, "selectionStart" in r && Rr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Hr && Nr(Hr, r) || (Hr = r, r = Bd(Vr, "onSelect"), 0 < r.length && (t = new jn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Br)));
	}
	function Gr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Kr = {
		animationend: Gr("Animation", "AnimationEnd"),
		animationiteration: Gr("Animation", "AnimationIteration"),
		animationstart: Gr("Animation", "AnimationStart"),
		transitionrun: Gr("Transition", "TransitionRun"),
		transitionstart: Gr("Transition", "TransitionStart"),
		transitioncancel: Gr("Transition", "TransitionCancel"),
		transitionend: Gr("Transition", "TransitionEnd")
	}, qr = {}, Jr = {};
	yn && (Jr = document.createElement("div").style, "AnimationEvent" in window || (delete Kr.animationend.animation, delete Kr.animationiteration.animation, delete Kr.animationstart.animation), "TransitionEvent" in window || delete Kr.transitionend.transition);
	function Yr(e) {
		if (qr[e]) return qr[e];
		if (!Kr[e]) return e;
		var t = Kr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Jr) return qr[e] = t[n];
		return e;
	}
	var Xr = Yr("animationend"), Zr = Yr("animationiteration"), Qr = Yr("animationstart"), $r = Yr("transitionrun"), ei = Yr("transitionstart"), ti = Yr("transitioncancel"), ni = Yr("transitionend"), ri = /* @__PURE__ */ new Map(), ii = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	ii.push("scrollEnd");
	function ai(e, t) {
		ri.set(e, t), Mt(t, [e]);
	}
	var oi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, si = [], ci = 0, li = 0;
	function ui() {
		for (var e = ci, t = li = ci = 0; t < e;) {
			var n = si[t];
			si[t++] = null;
			var r = si[t];
			si[t++] = null;
			var i = si[t];
			si[t++] = null;
			var a = si[t];
			if (si[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && mi(n, i, a);
		}
	}
	function di(e, t, n, r) {
		si[ci++] = e, si[ci++] = t, si[ci++] = n, si[ci++] = r, li |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function fi(e, t, n, r) {
		return di(e, t, n, r), hi(e);
	}
	function pi(e, t) {
		return di(e, null, null, t), hi(e);
	}
	function mi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - qe(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function hi(e) {
		if (50 < wu) throw wu = 0, Tu = null, Error(a(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var gi = {};
	function _i(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function vi(e, t, n, r) {
		return new _i(e, t, n, r);
	}
	function yi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function bi(e, t) {
		var n = e.alternate;
		return n === null ? (n = vi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function xi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Si(e, t, n, r, i, o) {
		var s = 0;
		if (r = e, typeof e == "function") yi(e) && (s = 1);
		else if (typeof e == "string") s = np(e, n, _e.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case oe: return e = vi(31, n, t, i), e.elementType = oe, e.lanes = o, e;
			case y: return Ci(n.children, i, o, t);
			case b:
				s = 8, i |= 24;
				break;
			case x: return e = vi(12, n, t, i | 2), e.elementType = x, e.lanes = o, e;
			case re: return e = vi(13, n, t, i), e.elementType = re, e.lanes = o, e;
			case ie: return e = vi(19, n, t, i), e.elementType = ie, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case te:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case ne:
						s = 11;
						break a;
					case ae:
						s = 14;
						break a;
					case S:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(a(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = vi(s, n, t, i), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ci(e, t, n, r) {
		return e = vi(7, e, r, t), e.lanes = n, e;
	}
	function wi(e, t, n) {
		return e = vi(6, e, null, t), e.lanes = n, e;
	}
	function Ti(e) {
		var t = vi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Ei(e, t, n) {
		return t = vi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Di = /* @__PURE__ */ new WeakMap();
	function Oi(e, t) {
		if (typeof e == "object" && e) {
			var n = Di.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ke(t)
			}, Di.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ke(t)
		};
	}
	var ki = [], Ai = 0, ji = null, Mi = 0, Ni = [], Pi = 0, Fi = null, Ii = 1, Li = "";
	function Ri(e, t) {
		ki[Ai++] = Mi, ki[Ai++] = ji, ji = e, Mi = t;
	}
	function zi(e, t, n) {
		Ni[Pi++] = Ii, Ni[Pi++] = Li, Ni[Pi++] = Fi, Fi = e;
		var r = Ii;
		e = Li;
		var i = 32 - qe(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - qe(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ii = 1 << 32 - qe(t) + i | n << i | r, Li = a + e;
		} else Ii = 1 << a | n << i | r, Li = e;
	}
	function Bi(e) {
		e.return !== null && (Ri(e, 1), zi(e, 1, 0));
	}
	function Vi(e) {
		for (; e === ji;) ji = ki[--Ai], ki[Ai] = null, Mi = ki[--Ai], ki[Ai] = null;
		for (; e === Fi;) Fi = Ni[--Pi], Ni[Pi] = null, Li = Ni[--Pi], Ni[Pi] = null, Ii = Ni[--Pi], Ni[Pi] = null;
	}
	function Hi(e, t) {
		Ni[Pi++] = Ii, Ni[Pi++] = Li, Ni[Pi++] = Fi, Ii = t.id, Li = t.overflow, Fi = e;
	}
	var Ui = null, Wi = null, k = !1, Gi = null, Ki = !1, qi = Error(a(519));
	function Ji(e) {
		throw ea(Oi(Error(a(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), qi;
	}
	function Yi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[gt] = e, t[_t] = r, n) {
			case "dialog":
				R("cancel", t), R("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				R("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < jd.length; n++) R(jd[n], t);
				break;
			case "source":
				R("error", t);
				break;
			case "img":
			case "image":
			case "link":
				R("error", t), R("load", t);
				break;
			case "details":
				R("toggle", t);
				break;
			case "input":
				R("invalid", t), Xt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				R("invalid", t);
				break;
			case "textarea": R("invalid", t), en(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Kd(t.textContent, n) ? (r.popover != null && (R("beforetoggle", t), R("toggle", t)), r.onScroll != null && R("scroll", t), r.onScrollEnd != null && R("scrollend", t), r.onClick != null && (t.onclick = un), t = !0) : t = !1, t || Ji(e, !0);
	}
	function Xi(e) {
		for (Ui = e.return; Ui;) switch (Ui.tag) {
			case 5:
			case 31:
			case 13:
				Ki = !1;
				return;
			case 27:
			case 3:
				Ki = !0;
				return;
			default: Ui = Ui.return;
		}
	}
	function Zi(e) {
		if (e !== Ui) return !1;
		if (!k) return Xi(e), k = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || af(e.type, e.memoizedProps)), n = !n), n && Wi && Ji(e), Xi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			Wi = Tf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			Wi = Tf(e);
		} else t === 27 ? (t = Wi, pf(e.type) ? (e = wf, wf = null, Wi = e) : Wi = t) : Wi = Ui ? Cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Qi() {
		Wi = Ui = null, k = !1;
	}
	function $i() {
		var e = Gi;
		return e !== null && (uu === null ? uu = e : uu.push.apply(uu, e), Gi = null), e;
	}
	function ea(e) {
		Gi === null ? Gi = [e] : Gi.push(e);
	}
	var ta = me(null), na = null, ra = null;
	function ia(e, t, n) {
		ge(ta, t._currentValue), t._currentValue = n;
	}
	function aa(e) {
		e._currentValue = ta.current, he(ta);
	}
	function oa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function sa(e, t, n, r) {
		var i = e.child;
		for (i !== null && (i.return = e); i !== null;) {
			var o = i.dependencies;
			if (o !== null) {
				var s = i.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = i;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), oa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (i.tag === 18) {
				if (s = i.return, s === null) throw Error(a(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), oa(s, n, e), s = null;
			} else s = i.child;
			if (s !== null) s.return = i;
			else for (s = i; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (i = s.sibling, i !== null) {
					i.return = s.return, s = i;
					break;
				}
				s = s.return;
			}
			i = s;
		}
	}
	function ca(e, t, n, r) {
		e = null;
		for (var i = t, o = !1; i !== null;) {
			if (!o) {
				if (i.flags & 524288) o = !0;
				else if (i.flags & 262144) break;
			}
			if (i.tag === 10) {
				var s = i.alternate;
				if (s === null) throw Error(a(387));
				if (s = s.memoizedProps, s !== null) {
					var c = i.type;
					Mr(i.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === be.current) {
				if (s = i.alternate, s === null) throw Error(a(387));
				s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [dp] : e.push(dp));
			}
			i = i.return;
		}
		e !== null && sa(t, e, n, r), t.flags |= 262144;
	}
	function la(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Mr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ua(e) {
		na = e, ra = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function da(e) {
		return pa(na, e);
	}
	function fa(e, t) {
		return na === null && ua(e), pa(e, t);
	}
	function pa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ra === null) {
			if (e === null) throw Error(a(308));
			ra = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ra = ra.next = t;
		return n;
	}
	var ma = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, ha = t.unstable_scheduleCallback, ga = t.unstable_NormalPriority, _a = {
		$$typeof: te,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function va() {
		return {
			controller: new ma(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ya(e) {
		e.refCount--, e.refCount === 0 && ha(ga, function() {
			e.controller.abort();
		});
	}
	var ba = null, A = 0, j = 0, xa = null;
	function Sa(e, t) {
		if (ba === null) {
			var n = ba = [];
			A = 0, j = Td(), xa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return A++, t.then(Ca, Ca), t;
	}
	function Ca() {
		if (--A === 0 && ba !== null) {
			xa !== null && (xa.status = "fulfilled");
			var e = ba;
			ba = null, j = 0, xa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function wa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ta = T.S;
	T.S = function(e, t) {
		pu = Fe(), typeof t == "object" && t && typeof t.then == "function" && Sa(e, t), Ta !== null && Ta(e, t);
	};
	var Ea = me(null);
	function Da() {
		var e = Ea.current;
		return e === null ? P.pooledCache : e;
	}
	function Oa(e, t) {
		t === null ? ge(Ea, Ea.current) : ge(Ea, t.pool);
	}
	function ka() {
		var e = Da();
		return e === null ? null : {
			parent: _a._currentValue,
			pool: e
		};
	}
	var Aa = Error(a(460)), ja = Error(a(474)), Ma = Error(a(542)), Na = { then: function() {} };
	function Pa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Fa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(un, un), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, za(e), e;
			default:
				if (typeof t.status == "string") t.then(un, un);
				else {
					if (e = P, e !== null && 100 < e.shellSuspendCounter) throw Error(a(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, za(e), e;
				}
				throw La = t, Aa;
		}
	}
	function Ia(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (La = e, Aa) : e;
		}
	}
	var La = null;
	function Ra() {
		if (La === null) throw Error(a(459));
		var e = La;
		return La = null, e;
	}
	function za(e) {
		if (e === Aa || e === Ma) throw Error(a(483));
	}
	var Ba = null, Va = 0;
	function Ha(e) {
		var t = Va;
		return Va += 1, Ba === null && (Ba = []), Fa(Ba, e, t);
	}
	function Ua(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Wa(e, t) {
		throw t.$$typeof === g ? Error(a(525)) : (e = Object.prototype.toString.call(t), Error(a(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Ga(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function i(e, t) {
			return e = bi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = wi(n, e.mode, r), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var a = n.type;
			return a === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === S && Ia(a) === t.type) ? (t = i(t, n.props), Ua(t, n), t.return = e, t) : (t = Si(n.type, n.key, n.props, null, e.mode, r), Ua(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ei(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, a) {
			return t === null || t.tag !== 7 ? (t = Ci(n, e.mode, r, a), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = wi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = Si(t.type, t.key, t.props, null, e.mode, n), Ua(n, t), n.return = e, n;
					case v: return t = Ei(t, e.mode, n), t.return = e, t;
					case S: return t = Ia(t), f(e, t, n);
				}
				if (ue(t) || ce(t)) return t = Ci(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Ha(t), n);
				if (t.$$typeof === te) return f(e, fa(e, t), n);
				Wa(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case S: return n = Ia(n), p(e, t, n, r);
				}
				if (ue(n) || ce(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Ha(n), r);
				if (n.$$typeof === te) return p(e, t, fa(e, n), r);
				Wa(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case S: return r = Ia(r), m(e, t, n, r, i);
				}
				if (ue(r) || ce(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Ha(r), i);
				if (r.$$typeof === te) return m(e, t, n, fa(t, r), i);
				Wa(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), k && Ri(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return k && Ri(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), k && Ri(i, h), l;
		}
		function g(i, s, c, l) {
			if (c == null) throw Error(a(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(i, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(i, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(i, h), k && Ri(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return k && Ri(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), k && Ri(i, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = i(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === S && Ia(l) === r.type) {
										n(e, r.sibling), c = i(r, o.props), Ua(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = Ci(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = Si(o.type, o.key, o.props, null, e.mode, c), Ua(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = i(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Ei(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case S: return o = Ia(o), b(e, r, o, c);
				}
				if (ue(o)) return h(e, r, o, c);
				if (ce(o)) {
					if (l = ce(o), typeof l != "function") throw Error(a(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Ha(o), c);
				if (o.$$typeof === te) return b(e, r, fa(e, o), c);
				Wa(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, o), c.return = e, e = c) : (n(e, r), c = wi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Va = 0;
				var i = b(e, t, n, r);
				return Ba = null, i;
			} catch (t) {
				if (t === Aa || t === Ma) throw t;
				var a = vi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Ka = Ga(!0), qa = Ga(!1), Ja = !1;
	function Ya(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Xa(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Za(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Qa(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Zl & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = hi(e), mi(e, null, n), t;
		}
		return di(e, r, t, n), hi(e);
	}
	function $a(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	function eo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var to = !1;
	function no() {
		if (to) {
			var e = xa;
			if (e !== null) throw e;
		}
	}
	function ro(e, t, n, r) {
		to = !1;
		var i = e.updateQueue;
		Ja = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (I & f) === f : (r & f) === f) {
					f !== 0 && f === j && (to = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Ja = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), au |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function io(e, t) {
		if (typeof e != "function") throw Error(a(191, e));
		e.call(t);
	}
	function ao(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) io(n[e], t);
	}
	var oo = me(null), so = me(0);
	function co(e, t) {
		e = ru, ge(so, e), ge(oo, t), ru = e | t.baseLanes;
	}
	function lo() {
		ge(so, ru), ge(oo, oo.current);
	}
	function uo() {
		ru = so.current, he(oo), he(so);
	}
	var fo = me(null), po = null;
	function mo(e) {
		var t = e.alternate;
		ge(yo, yo.current & 1), ge(fo, e), po === null && (t === null || oo.current !== null || t.memoizedState !== null) && (po = e);
	}
	function ho(e) {
		ge(yo, yo.current), ge(fo, e), po === null && (po = e);
	}
	function go(e) {
		e.tag === 22 ? (ge(yo, yo.current), ge(fo, e), po === null && (po = e)) : _o(e);
	}
	function _o() {
		ge(yo, yo.current), ge(fo, fo.current);
	}
	function vo(e) {
		he(fo), po === e && (po = null), he(yo);
	}
	var yo = me(0);
	function bo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || bf(n) || xf(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var xo = 0, M = null, So = null, Co = null, wo = !1, To = !1, Eo = !1, Do = 0, Oo = 0, ko = null, Ao = 0;
	function jo() {
		throw Error(a(321));
	}
	function Mo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Mr(e[n], t[n])) return !1;
		return !0;
	}
	function No(e, t, n, r, i, a) {
		return xo = a, M = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, T.H = e === null || e.memoizedState === null ? Xs : Zs, Eo = !1, a = n(r, i), Eo = !1, To && (a = Fo(t, n, r, i)), Po(e), a;
	}
	function Po(e) {
		T.H = Ys;
		var t = So !== null && So.next !== null;
		if (xo = 0, Co = So = M = null, wo = !1, Oo = 0, ko = null, t) throw Error(a(300));
		e === null || mc || (e = e.dependencies, e !== null && la(e) && (mc = !0));
	}
	function Fo(e, t, n, r) {
		M = e;
		var i = 0;
		do {
			if (To && (ko = null), Oo = 0, To = !1, 25 <= i) throw Error(a(301));
			if (i += 1, Co = So = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			T.H = Qs, o = t(n, r);
		} while (To);
		return o;
	}
	function Io() {
		var e = T.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Uo(t) : t, e = e.useState()[0], (So === null ? null : So.memoizedState) !== e && (M.flags |= 1024), t;
	}
	function Lo() {
		var e = Do !== 0;
		return Do = 0, e;
	}
	function Ro(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function zo(e) {
		if (wo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			wo = !1;
		}
		xo = 0, Co = So = M = null, To = !1, Oo = Do = 0, ko = null;
	}
	function Bo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Co === null ? M.memoizedState = Co = e : Co = Co.next = e, Co;
	}
	function Vo() {
		if (So === null) {
			var e = M.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = So.next;
		var t = Co === null ? M.memoizedState : Co.next;
		if (t !== null) Co = t, So = e;
		else {
			if (e === null) throw M.alternate === null ? Error(a(467)) : Error(a(310));
			So = e, e = {
				memoizedState: So.memoizedState,
				baseState: So.baseState,
				baseQueue: So.baseQueue,
				queue: So.queue,
				next: null
			}, Co === null ? M.memoizedState = Co = e : Co = Co.next = e;
		}
		return Co;
	}
	function Ho() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Uo(e) {
		var t = Oo;
		return Oo += 1, ko === null && (ko = []), e = Fa(ko, e, t), t = M, (Co === null ? t.memoizedState : Co.next) === null && (t = t.alternate, T.H = t === null || t.memoizedState === null ? Xs : Zs), e;
	}
	function Wo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Uo(e);
			if (e.$$typeof === te) return da(e);
		}
		throw Error(a(438, String(e)));
	}
	function Go(e) {
		var t = null, n = M.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = M.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = Ho(), M.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = C;
		return t.index++, n;
	}
	function Ko(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function qo(e) {
		return Jo(Vo(), So, e);
	}
	function Jo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(a(311));
		r.lastRenderedReducer = n;
		var i = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (i !== null) {
				var s = i.next;
				i.next = o.next, o.next = s;
			}
			t.baseQueue = i = o, r.pending = null;
		}
		if (o = e.baseState, i === null) e.memoizedState = o;
		else {
			t = i.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (xo & f) === f : (I & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === j && (d = !0);
					else if ((xo & p) === p) {
						u = u.next, p === j && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, M.lanes |= p, au |= p;
					f = u.action, Eo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, M.lanes |= f, au |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Mr(o, e.memoizedState) && (mc = !0, d && (n = xa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Yo(e) {
		var t = Vo(), n = t.queue;
		if (n === null) throw Error(a(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, i = n.pending, o = t.memoizedState;
		if (i !== null) {
			n.pending = null;
			var s = i = i.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== i);
			Mr(o, t.memoizedState) || (mc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Xo(e, t, n) {
		var r = M, i = Vo(), o = k;
		if (o) {
			if (n === void 0) throw Error(a(407));
			n = n();
		} else n = t();
		var s = !Mr((So || i).memoizedState, n);
		if (s && (i.memoizedState = n, mc = !0), i = i.queue, xs($o.bind(null, r, i, e), [e]), i.getSnapshot !== t || s || Co !== null && Co.memoizedState.tag & 1) {
			if (r.flags |= 2048, gs(9, { destroy: void 0 }, Qo.bind(null, r, i, n, t), null), P === null) throw Error(a(349));
			o || xo & 127 || Zo(r, t, n);
		}
		return n;
	}
	function Zo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = M.updateQueue, t === null ? (t = Ho(), M.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Qo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, es(t) && ts(e);
	}
	function $o(e, t, n) {
		return n(function() {
			es(t) && ts(e);
		});
	}
	function es(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Mr(e, n);
		} catch {
			return !0;
		}
	}
	function ts(e) {
		var t = pi(e, 2);
		t !== null && Ou(t, e, 2);
	}
	function ns(e) {
		var t = Bo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Eo) {
				Ke(!0);
				try {
					n();
				} finally {
					Ke(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ko,
			lastRenderedState: e
		}, t;
	}
	function rs(e, t, n, r) {
		return e.baseState = n, Jo(e, So, typeof r == "function" ? r : Ko);
	}
	function is(e, t, n, r, i) {
		if (Ks(e)) throw Error(a(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: i,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			T.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, as(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function as(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = T.T, o = {};
			T.T = o;
			try {
				var s = n(i, r), c = T.S;
				c !== null && c(o, s), os(e, t, s);
			} catch (n) {
				cs(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), T.T = a;
			}
		} else try {
			a = n(i, r), os(e, t, a);
		} catch (n) {
			cs(e, t, n);
		}
	}
	function os(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			ss(e, t, n);
		}, function(n) {
			return cs(e, t, n);
		}) : ss(e, t, n);
	}
	function ss(e, t, n) {
		t.status = "fulfilled", t.value = n, ls(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, as(e, n)));
	}
	function cs(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, ls(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function ls(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function us(e, t) {
		return t;
	}
	function ds(e, t) {
		if (k) {
			var n = P.formState;
			if (n !== null) {
				a: {
					var r = M;
					if (k) {
						if (Wi) {
							b: {
								for (var i = Wi, a = Ki; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = Cf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Wi = Cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Ji(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Bo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: us,
			lastRenderedState: t
		}, n.queue = r, n = Us.bind(null, M, r), r.dispatch = n, r = ns(!1), a = Gs.bind(null, M, !1, r.queue), r = Bo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = is.bind(null, M, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function fs(e) {
		return ps(Vo(), So, e);
	}
	function ps(e, t, n) {
		if (t = Jo(e, t, us)[0], e = qo(Ko)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Uo(t);
		} catch (e) {
			throw e === Aa ? Ma : e;
		}
		else r = t;
		t = Vo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (M.flags |= 2048, gs(9, { destroy: void 0 }, ms.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function ms(e, t) {
		e.action = t;
	}
	function hs(e) {
		var t = Vo(), n = So;
		if (n !== null) return ps(t, n, e);
		Vo(), t = t.memoizedState, n = Vo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function gs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = M.updateQueue, t === null && (t = Ho(), M.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function _s() {
		return Vo().memoizedState;
	}
	function vs(e, t, n, r) {
		var i = Bo();
		M.flags |= e, i.memoizedState = gs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ys(e, t, n, r) {
		var i = Vo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		So !== null && r !== null && Mo(r, So.memoizedState.deps) ? i.memoizedState = gs(t, a, n, r) : (M.flags |= e, i.memoizedState = gs(1 | t, a, n, r));
	}
	function bs(e, t) {
		vs(8390656, 8, e, t);
	}
	function xs(e, t) {
		ys(2048, 8, e, t);
	}
	function Ss(e) {
		M.flags |= 4;
		var t = M.updateQueue;
		if (t === null) t = Ho(), M.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Cs(e) {
		var t = Vo().memoizedState;
		return Ss({
			ref: t,
			nextImpl: e
		}), function() {
			if (Zl & 2) throw Error(a(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ws(e, t) {
		return ys(4, 2, e, t);
	}
	function Ts(e, t) {
		return ys(4, 4, e, t);
	}
	function Es(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Ds(e, t, n) {
		n = n == null ? null : n.concat([e]), ys(4, 4, Es.bind(null, t, e), n);
	}
	function Os() {}
	function ks(e, t) {
		var n = Vo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Mo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function As(e, t) {
		var n = Vo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Mo(t, r[1])) return r[0];
		if (r = e(), Eo) {
			Ke(!0);
			try {
				e();
			} finally {
				Ke(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function js(e, t, n) {
		return n === void 0 || xo & 1073741824 && !(I & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Du(), M.lanes |= e, au |= e, n);
	}
	function Ms(e, t, n, r) {
		return Mr(n, t) ? n : oo.current === null ? !(xo & 42) || xo & 1073741824 && !(I & 261930) ? (mc = !0, e.memoizedState = n) : (e = Du(), M.lanes |= e, au |= e, t) : (e = js(e, n, r), Mr(e, t) || (mc = !0), e);
	}
	function Ns(e, t, n, r, i) {
		var a = E.p;
		E.p = a !== 0 && 8 > a ? a : 8;
		var o = T.T, s = {};
		T.T = s, Gs(e, !1, t, n);
		try {
			var c = i(), l = T.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ws(e, t, wa(c, r), Eu(e)) : Ws(e, t, r, Eu(e));
		} catch (n) {
			Ws(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Eu());
		} finally {
			E.p = a, o !== null && s.types !== null && (o.types = s.types), T.T = o;
		}
	}
	function Ps() {}
	function Fs(e, t, n, r) {
		if (e.tag !== 5) throw Error(a(476));
		var i = Is(e).queue;
		Ns(e, i, t, de, n === null ? Ps : function() {
			return Ls(e), n(r);
		});
	}
	function Is(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: de,
			baseState: de,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ko,
				lastRenderedState: de
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ko,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ls(e) {
		var t = Is(e);
		t.next === null && (t = e.alternate.memoizedState), Ws(e, t.next.queue, {}, Eu());
	}
	function Rs() {
		return da(dp);
	}
	function zs() {
		return Vo().memoizedState;
	}
	function Bs() {
		return Vo().memoizedState;
	}
	function Vs(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Eu();
					e = Za(n);
					var r = Qa(t, e, n);
					r !== null && (Ou(r, t, n), $a(r, t, n)), t = { cache: va() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Hs(e, t, n) {
		var r = Eu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ks(e) ? qs(t, n) : (n = fi(e, t, n, r), n !== null && (Ou(n, e, r), Js(n, t, r)));
	}
	function Us(e, t, n) {
		Ws(e, t, n, Eu());
	}
	function Ws(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Ks(e)) qs(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Mr(s, o)) return di(e, t, i, 0), P === null && ui(), !1;
			} catch {}
			if (n = fi(e, t, i, r), n !== null) return Ou(n, e, r), Js(n, t, r), !0;
		}
		return !1;
	}
	function Gs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Td(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ks(e)) {
			if (t) throw Error(a(479));
		} else t = fi(e, n, r, 2), t !== null && Ou(t, e, 2);
	}
	function Ks(e) {
		var t = e.alternate;
		return e === M || t !== null && t === M;
	}
	function qs(e, t) {
		To = wo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Js(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	var Ys = {
		readContext: da,
		use: Wo,
		useCallback: jo,
		useContext: jo,
		useEffect: jo,
		useImperativeHandle: jo,
		useLayoutEffect: jo,
		useInsertionEffect: jo,
		useMemo: jo,
		useReducer: jo,
		useRef: jo,
		useState: jo,
		useDebugValue: jo,
		useDeferredValue: jo,
		useTransition: jo,
		useSyncExternalStore: jo,
		useId: jo,
		useHostTransitionStatus: jo,
		useFormState: jo,
		useActionState: jo,
		useOptimistic: jo,
		useMemoCache: jo,
		useCacheRefresh: jo
	};
	Ys.useEffectEvent = jo;
	var Xs = {
		readContext: da,
		use: Wo,
		useCallback: function(e, t) {
			return Bo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: da,
		useEffect: bs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), vs(4194308, 4, Es.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return vs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			vs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Bo();
			t = t === void 0 ? null : t;
			var r = e();
			if (Eo) {
				Ke(!0);
				try {
					e();
				} finally {
					Ke(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Bo();
			if (n !== void 0) {
				var i = n(t);
				if (Eo) {
					Ke(!0);
					try {
						n(t);
					} finally {
						Ke(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Hs.bind(null, M, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Bo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = ns(e);
			var t = e.queue, n = Us.bind(null, M, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Os,
		useDeferredValue: function(e, t) {
			return js(Bo(), e, t);
		},
		useTransition: function() {
			var e = ns(!1);
			return e = Ns.bind(null, M, e.queue, !0, !1), Bo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = M, i = Bo();
			if (k) {
				if (n === void 0) throw Error(a(407));
				n = n();
			} else {
				if (n = t(), P === null) throw Error(a(349));
				I & 127 || Zo(r, t, n);
			}
			i.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return i.queue = o, bs($o.bind(null, r, o, e), [e]), r.flags |= 2048, gs(9, { destroy: void 0 }, Qo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Bo(), t = P.identifierPrefix;
			if (k) {
				var n = Li, r = Ii;
				n = (r & ~(1 << 32 - qe(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Do++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Ao++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Rs,
		useFormState: ds,
		useActionState: ds,
		useOptimistic: function(e) {
			var t = Bo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Gs.bind(null, M, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Go,
		useCacheRefresh: function() {
			return Bo().memoizedState = Vs.bind(null, M);
		},
		useEffectEvent: function(e) {
			var t = Bo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Zl & 2) throw Error(a(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Zs = {
		readContext: da,
		use: Wo,
		useCallback: ks,
		useContext: da,
		useEffect: xs,
		useImperativeHandle: Ds,
		useInsertionEffect: ws,
		useLayoutEffect: Ts,
		useMemo: As,
		useReducer: qo,
		useRef: _s,
		useState: function() {
			return qo(Ko);
		},
		useDebugValue: Os,
		useDeferredValue: function(e, t) {
			return Ms(Vo(), So.memoizedState, e, t);
		},
		useTransition: function() {
			var e = qo(Ko)[0], t = Vo().memoizedState;
			return [typeof e == "boolean" ? e : Uo(e), t];
		},
		useSyncExternalStore: Xo,
		useId: zs,
		useHostTransitionStatus: Rs,
		useFormState: fs,
		useActionState: fs,
		useOptimistic: function(e, t) {
			return rs(Vo(), So, e, t);
		},
		useMemoCache: Go,
		useCacheRefresh: Bs
	};
	Zs.useEffectEvent = Cs;
	var Qs = {
		readContext: da,
		use: Wo,
		useCallback: ks,
		useContext: da,
		useEffect: xs,
		useImperativeHandle: Ds,
		useInsertionEffect: ws,
		useLayoutEffect: Ts,
		useMemo: As,
		useReducer: Yo,
		useRef: _s,
		useState: function() {
			return Yo(Ko);
		},
		useDebugValue: Os,
		useDeferredValue: function(e, t) {
			var n = Vo();
			return So === null ? js(n, e, t) : Ms(n, So.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Yo(Ko)[0], t = Vo().memoizedState;
			return [typeof e == "boolean" ? e : Uo(e), t];
		},
		useSyncExternalStore: Xo,
		useId: zs,
		useHostTransitionStatus: Rs,
		useFormState: hs,
		useActionState: hs,
		useOptimistic: function(e, t) {
			var n = Vo();
			return So === null ? (n.baseState = e, [e, n.queue.dispatch]) : rs(n, So, e, t);
		},
		useMemoCache: Go,
		useCacheRefresh: Bs
	};
	Qs.useEffectEvent = Cs;
	function $s(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var ec = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Eu(), i = Za(r);
			i.payload = t, n != null && (i.callback = n), t = Qa(e, i, r), t !== null && (Ou(t, e, r), $a(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Eu(), i = Za(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Qa(e, i, r), t !== null && (Ou(t, e, r), $a(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Eu(), r = Za(n);
			r.tag = 2, t != null && (r.callback = t), t = Qa(e, r, n), t !== null && (Ou(t, e, n), $a(t, e, n));
		}
	};
	function tc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Nr(n, r) || !Nr(i, a) : !0;
	}
	function nc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && ec.enqueueReplaceState(t, t.state, null);
	}
	function rc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function ic(e) {
		oi(e);
	}
	function ac(e) {
		console.error(e);
	}
	function oc(e) {
		oi(e);
	}
	function sc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function cc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function lc(e, t, n) {
		return n = Za(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			sc(e, t);
		}, n;
	}
	function uc(e) {
		return e = Za(e), e.tag = 3, e;
	}
	function dc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				cc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			cc(t, n, r), typeof i != "function" && (gu === null ? gu = /* @__PURE__ */ new Set([this]) : gu.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function fc(e, t, n, r, i) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ca(t, n, i, !0), n = fo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return po === null ? Bu() : n.alternate === null && iu === 0 && (iu = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Na ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), ad(e, r, i)), !1;
					case 22: return n.flags |= 65536, r === Na ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), ad(e, r, i)), !1;
				}
				throw Error(a(435, n.tag));
			}
			return ad(e, r, i), Bu(), !1;
		}
		if (k) return t = fo.current, t === null ? (r !== qi && (t = Error(a(423), { cause: r }), ea(Oi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = Oi(r, n), i = lc(e.stateNode, r, i), eo(e, i), iu !== 4 && (iu = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== qi && (e = Error(a(422), { cause: r }), ea(Oi(e, n)))), !1;
		var o = Error(a(520), { cause: r });
		if (o = Oi(o, n), L === null ? L = [o] : L.push(o), iu !== 4 && (iu = 2), t === null) return !0;
		r = Oi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = lc(n.stateNode, r, e), eo(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (gu === null || !gu.has(o)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = uc(i), dc(i, e, n, r), eo(n, i), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var pc = Error(a(461)), mc = !1;
	function hc(e, t, n, r) {
		t.child = e === null ? qa(t, null, n, r) : Ka(t, e.child, n, r);
	}
	function gc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ua(t), r = No(e, t, n, o, a, i), s = Lo(), e !== null && !mc ? (Ro(e, t, i), Bc(e, t, i)) : (k && s && Bi(t), t.flags |= 1, hc(e, t, r, i), t.child);
	}
	function _c(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !yi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, vc(e, t, a, r, i)) : (e = Si(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Vc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Nr : n, n(o, r) && e.ref === t.ref) return Bc(e, t, i);
		}
		return t.flags |= 1, e = bi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function vc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Nr(a, r) && e.ref === t.ref) {
				if (mc = !1, t.pendingProps = r = a, Vc(e, i)) e.flags & 131072 && (mc = !0);
				else return t.lanes = e.lanes, Bc(e, t, i);
			}
		}
		return Ec(e, t, n, r, i);
	}
	function yc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return xc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Oa(t, a === null ? null : a.cachePool), a === null ? lo() : co(t, a), go(t);
			else return r = t.lanes = 536870912, xc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Oa(t, null), lo(), _o(t)) : (Oa(t, a.cachePool), co(t, a), _o(t), t.memoizedState = null);
		return hc(e, t, i, n), t.child;
	}
	function bc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function xc(e, t, n, r, i) {
		var a = Da();
		return a = a === null ? null : {
			parent: _a._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Oa(t, null), lo(), go(t), e !== null && ca(e, t, r, !0), t.childLanes = i, null;
	}
	function Sc(e, t) {
		return t = Fc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Cc(e, t, n) {
		return Ka(t, e.child, null, n), e = Sc(t, t.pendingProps), e.flags |= 2, vo(t), t.memoizedState = null, e;
	}
	function wc(e, t, n) {
		var r = t.pendingProps, i = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (k) {
				if (r.mode === "hidden") return e = Sc(t, r), t.lanes = 536870912, bc(null, e);
				if (ho(t), (e = Wi) ? (e = yf(e, Ki), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Fi === null ? null : {
						id: Ii,
						overflow: Li
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ti(e), n.return = t, t.child = n, Ui = t, Wi = null)) : e = null, e === null) throw Ji(t);
				return t.lanes = 536870912, null;
			}
			return Sc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (ho(t), i) {
				if (t.flags & 256) t.flags &= -257, t = Cc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(a(558));
			} else if (mc || ca(e, t, n, !1), i = (n & e.childLanes) !== 0, mc || i) {
				if (r = P, r !== null && (s = ut(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, pi(e, s), Ou(r, e, s), pc;
				Bu(), t = Cc(e, t, n);
			} else e = o.treeContext, Wi = Cf(s.nextSibling), Ui = t, k = !0, Gi = null, Ki = !1, e !== null && Hi(t, e), t = Sc(t, r), t.flags |= 4096;
			return t;
		}
		return e = bi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Tc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(a(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Ec(e, t, n, r, i) {
		return ua(t), n = No(e, t, n, r, void 0, i), r = Lo(), e !== null && !mc ? (Ro(e, t, i), Bc(e, t, i)) : (k && r && Bi(t), t.flags |= 1, hc(e, t, n, i), t.child);
	}
	function Dc(e, t, n, r, i, a) {
		return ua(t), t.updateQueue = null, n = Fo(t, r, n, i), Po(e), r = Lo(), e !== null && !mc ? (Ro(e, t, a), Bc(e, t, a)) : (k && r && Bi(t), t.flags |= 1, hc(e, t, n, a), t.child);
	}
	function Oc(e, t, n, r, i) {
		if (ua(t), t.stateNode === null) {
			var a = gi, o = n.contextType;
			typeof o == "object" && o && (a = da(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = ec, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ya(t), o = n.contextType, a.context = typeof o == "object" && o ? da(o) : gi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && ($s(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && ec.enqueueReplaceState(a, a.state, null), ro(t, r, a, i), no(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = rc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = gi, typeof u == "object" && u && (o = da(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && nc(t, a, r, o), Ja = !1;
			var f = t.memoizedState;
			a.state = f, ro(t, r, a, i), no(), l = t.memoizedState, s || f !== l || Ja ? (typeof d == "function" && ($s(t, n, d, r), l = t.memoizedState), (c = Ja || tc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Xa(e, t), o = t.memoizedProps, u = rc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = gi, typeof l == "object" && l && (c = da(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && nc(t, a, r, c), Ja = !1, f = t.memoizedState, a.state = f, ro(t, r, a, i), no();
			var p = t.memoizedState;
			o !== d || f !== p || Ja || e !== null && e.dependencies !== null && la(e.dependencies) ? (typeof s == "function" && ($s(t, n, s, r), p = t.memoizedState), (u = Ja || tc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && la(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Tc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ka(t, e.child, null, i), t.child = Ka(t, null, n, i)) : hc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Bc(e, t, i), e;
	}
	function kc(e, t, n, r) {
		return Qi(), t.flags |= 256, hc(e, t, n, r), t.child;
	}
	var Ac = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function jc(e) {
		return {
			baseLanes: e,
			cachePool: ka()
		};
	}
	function Mc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= cu), e;
	}
	function Nc(e, t, n) {
		var r = t.pendingProps, i = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(yo.current & 2)), s && (i = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (k) {
				if (i ? mo(t) : _o(t), (e = Wi) ? (e = yf(e, Ki), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Fi === null ? null : {
						id: Ii,
						overflow: Li
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ti(e), n.return = t, t.child = n, Ui = t, Wi = null)) : e = null, e === null) throw Ji(t);
				return xf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, i ? (_o(t), i = t.mode, c = Fc({
				mode: "hidden",
				children: c
			}, i), r = Ci(r, i, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = jc(n), r.childLanes = Mc(e, s, n), t.memoizedState = Ac, bc(null, r)) : (mo(t), Pc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (mo(t), t.flags &= -257, t = Ic(e, t, n)) : t.memoizedState === null ? (_o(t), c = r.fallback, i = t.mode, r = Fc({
				mode: "visible",
				children: r.children
			}, i), c = Ci(c, i, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ka(t, e.child, null, n), r = t.child, r.memoizedState = jc(n), r.childLanes = Mc(e, s, n), t.memoizedState = Ac, t = bc(null, r)) : (_o(t), t.child = e.child, t.flags |= 128, t = null);
			else if (mo(t), xf(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(a(419)), r.stack = "", r.digest = s, ea({
					value: r,
					source: null,
					stack: null
				}), t = Ic(e, t, n);
			} else if (mc || ca(e, t, n, !1), s = (n & e.childLanes) !== 0, mc || s) {
				if (s = P, s !== null && (r = ut(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, pi(e, r), Ou(s, e, r), pc;
				bf(c) || Bu(), t = Ic(e, t, n);
			} else bf(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Wi = Cf(c.nextSibling), Ui = t, k = !0, Gi = null, Ki = !1, e !== null && Hi(t, e), t = Pc(t, r.children), t.flags |= 4096);
			return t;
		}
		return i ? (_o(t), c = r.fallback, i = t.mode, l = e.child, u = l.sibling, r = bi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = Ci(c, i, n, null), c.flags |= 2) : c = bi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, bc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = jc(n) : (i = c.cachePool, i === null ? i = ka() : (l = _a._currentValue, i = i.parent === l ? i : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: i
		}), r.memoizedState = c, r.childLanes = Mc(e, s, n), t.memoizedState = Ac, bc(e.child, r)) : (mo(t), n = e.child, e = n.sibling, n = bi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Pc(e, t) {
		return t = Fc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Fc(e, t) {
		return e = vi(22, e, null, t), e.lanes = 0, e;
	}
	function Ic(e, t, n) {
		return Ka(t, e.child, null, n), e = Pc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Lc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), oa(e.return, t, n);
	}
	function Rc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function zc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = yo.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, ge(yo, o), hc(e, t, r, n), r = k ? Mi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Lc(e, n, t);
			else if (e.tag === 19) Lc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && bo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Rc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && bo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Rc(t, !0, n, null, a, r);
				break;
			case "together":
				Rc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Bc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), au |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ca(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(a(153));
		if (t.child !== null) {
			for (e = t.child, n = bi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = bi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Vc(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && la(e)));
	}
	function Hc(e, t, n) {
		switch (t.tag) {
			case 3:
				xe(t, t.stateNode.containerInfo), ia(t, _a, e.memoizedState.cache), Qi();
				break;
			case 27:
			case 5:
				Ce(t);
				break;
			case 4:
				xe(t, t.stateNode.containerInfo);
				break;
			case 10:
				ia(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, ho(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (mo(t), e = Bc(e, t, n), e === null ? null : e.sibling) : Nc(e, t, n) : (mo(t), t.flags |= 128, null);
				mo(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r ||= (ca(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return zc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), ge(yo, yo.current), r) break;
				return null;
			case 22: return t.lanes = 0, yc(e, t, n, t.pendingProps);
			case 24: ia(t, _a, e.memoizedState.cache);
		}
		return Bc(e, t, n);
	}
	function Uc(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) mc = !0;
			else {
				if (!Vc(e, n) && !(t.flags & 128)) return mc = !1, Hc(e, t, n);
				mc = !!(e.flags & 131072);
			}
		} else mc = !1, k && t.flags & 1048576 && zi(t, Mi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ia(t.elementType), t.type = e, typeof e == "function") yi(e) ? (r = rc(e, r), t.tag = 1, t = Oc(null, t, e, r, n)) : (t.tag = 0, t = Ec(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === ne) {
								t.tag = 11, t = gc(null, t, e, r, n);
								break a;
							}
							if (i === ae) {
								t.tag = 14, t = _c(null, t, e, r, n);
								break a;
							}
						}
						throw t = le(e) || e, Error(a(306, t, ""));
					}
				}
				return t;
			case 0: return Ec(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, i = rc(r, t.pendingProps), Oc(e, t, r, i, n);
			case 3:
				a: {
					if (xe(t, t.stateNode.containerInfo), e === null) throw Error(a(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					i = o.element, Xa(e, t), ro(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ia(t, _a, r), r !== o.cache && sa(t, [_a], n, !0), no(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = kc(e, t, r, n);
							break a;
						}
						if (r !== i) {
							i = Oi(Error(a(424)), t), ea(i), t = kc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Wi = Cf(e.firstChild), Ui = t, k = !0, Gi = null, Ki = !0, n = qa(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Qi(), r === i) {
							t = Bc(e, t, n);
							break a;
						}
						hc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Tc(e, t), e === null ? (n = Uf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : k || (n = t.type, e = t.pendingProps, r = tf(ye.current).createElement(n), r[gt] = t, r[_t] = e, Yd(r, n, e), kt(r), t.stateNode = r) : t.memoizedState = Uf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Ce(t), e === null && k && (r = t.stateNode = Df(t.type, t.pendingProps, ye.current), Ui = t, Ki = !0, i = Wi, pf(t.type) ? (wf = i, Wi = Cf(r.firstChild)) : Wi = i), hc(e, t, t.pendingProps.children, n), Tc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && k && ((i = r = Wi) && (r = _f(r, t.type, t.pendingProps, Ki), r === null ? i = !1 : (t.stateNode = r, Ui = t, Wi = Cf(r.firstChild), Ki = !1, i = !0)), i || Ji(t)), Ce(t), i = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, af(i, o) ? r = null : s !== null && af(i, s) && (t.flags |= 32), t.memoizedState !== null && (i = No(e, t, Io, null, null, n), dp._currentValue = i), Tc(e, t), hc(e, t, r, n), t.child;
			case 6: return e === null && k && ((e = n = Wi) && (n = vf(n, t.pendingProps, Ki), n === null ? e = !1 : (t.stateNode = n, Ui = t, Wi = null, e = !0)), e || Ji(t)), null;
			case 13: return Nc(e, t, n);
			case 4: return xe(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ka(t, null, r, n) : hc(e, t, r, n), t.child;
			case 11: return gc(e, t, t.type, t.pendingProps, n);
			case 7: return hc(e, t, t.pendingProps, n), t.child;
			case 8: return hc(e, t, t.pendingProps.children, n), t.child;
			case 12: return hc(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, ia(t, t.type, r.value), hc(e, t, r.children, n), t.child;
			case 9: return i = t.type._context, r = t.pendingProps.children, ua(t), i = da(i), r = r(i), t.flags |= 1, hc(e, t, r, n), t.child;
			case 14: return _c(e, t, t.type, t.pendingProps, n);
			case 15: return vc(e, t, t.type, t.pendingProps, n);
			case 19: return zc(e, t, n);
			case 31: return wc(e, t, n);
			case 22: return yc(e, t, n, t.pendingProps);
			case 24: return ua(t), r = da(_a), e === null ? (i = Da(), i === null && (i = P, o = va(), i.pooledCache = o, o.refCount++, o !== null && (i.pooledCacheLanes |= n), i = o), t.memoizedState = {
				parent: r,
				cache: i
			}, Ya(t), ia(t, _a, i)) : ((e.lanes & n) !== 0 && (Xa(e, t), ro(t, null, null, n), no()), i = e.memoizedState, o = t.memoizedState, i.parent === r ? (r = o.cache, ia(t, _a, r), r !== i.cache && sa(t, [_a], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), ia(t, _a, r))), hc(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(a(156, t.tag));
	}
	function Wc(e) {
		e.flags |= 4;
	}
	function Gc(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Lu()) e.flags |= 8192;
				else throw La = Na, ja;
			}
		} else e.flags &= -16777217;
	}
	function Kc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !rp(t)) {
			if (Lu()) e.flags |= 8192;
			else throw La = Na, ja;
		}
	}
	function qc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : it(), e.lanes |= t, lu |= t);
	}
	function Jc(e, t) {
		if (!k) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function Yc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Xc(e, t, n) {
		var r = t.pendingProps;
		switch (Vi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Yc(t), null;
			case 1: return Yc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), aa(_a), Se(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Zi(t) ? Wc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, $i())), Yc(t), null;
			case 26:
				var i = t.type, o = t.memoizedState;
				return e === null ? (Wc(t), o === null ? (Yc(t), Gc(t, i, null, r, n)) : (Yc(t), Kc(t, o))) : o ? o === e.memoizedState ? (Yc(t), t.flags &= -16777217) : (Wc(t), Yc(t), Kc(t, o)) : (e = e.memoizedProps, e !== r && Wc(t), Yc(t), Gc(t, i, e, r, n)), null;
			case 27:
				if (D(t), n = ye.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Wc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return Yc(t), null;
					}
					e = _e.current, Zi(t) ? Yi(t, e) : (e = Df(i, r, n), t.stateNode = e, Wc(t));
				}
				return Yc(t), null;
			case 5:
				if (D(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Wc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return Yc(t), null;
					}
					if (o = _e.current, Zi(t)) Yi(t, o);
					else {
						var s = tf(ye.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", i);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", i);
								break;
							default: switch (i) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", i);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", i);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(i, { is: r.is }) : s.createElement(i);
							}
						}
						o[gt] = t, o[_t] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Yd(o, i, r), i) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Wc(t);
					}
				}
				return Yc(t), Gc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Wc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
					if (e = ye.current, Zi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = Ui, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[gt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Kd(e.nodeValue, n)), e || Ji(t, !0);
					} else e = tf(e).createTextNode(r), e[gt] = t, t.stateNode = e;
				}
				return Yc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Zi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(a(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(557));
							e[gt] = t;
						} else Qi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Yc(t), e = !1;
					} else n = $i(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (vo(t), t) : (vo(t), null);
					if (t.flags & 128) throw Error(a(558));
				}
				return Yc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = Zi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(a(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(a(317));
							i[gt] = t;
						} else Qi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Yc(t), i = !1;
					} else i = $i(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (vo(t), t) : (vo(t), null);
				}
				return vo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), qc(t, t.updateQueue), Yc(t), null);
			case 4: return Se(), e === null && Id(t.stateNode.containerInfo), Yc(t), null;
			case 10: return aa(t.type), Yc(t), null;
			case 19:
				if (he(yo), r = t.memoizedState, r === null) return Yc(t), null;
				if (i = !!(t.flags & 128), o = r.rendering, o === null) {
					if (i) Jc(r, !1);
					else {
						if (iu !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = bo(e), o !== null) {
								for (t.flags |= 128, Jc(r, !1), e = o.updateQueue, t.updateQueue = e, qc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) xi(n, e), n = n.sibling;
								return ge(yo, yo.current & 1 | 2), k && Ri(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Fe() > mu && (t.flags |= 128, i = !0, Jc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!i) {
						if (e = bo(o), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, qc(t, e), Jc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !k) return Yc(t), null;
						} else 2 * Fe() - r.renderingStartTime > mu && n !== 536870912 && (t.flags |= 128, i = !0, Jc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Yc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Fe(), e.sibling = null, n = yo.current, ge(yo, i ? n & 1 | 2 : n & 1), k && Ri(t, r.treeForkCount), e);
			case 22:
			case 23: return vo(t), uo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Yc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Yc(t), n = t.updateQueue, n !== null && qc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && he(Ea), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), aa(_a), Yc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(a(156, t.tag));
	}
	function Zc(e, t) {
		switch (Vi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return aa(_a), Se(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return D(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (vo(t), t.alternate === null) throw Error(a(340));
					Qi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (vo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(a(340));
					Qi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return he(yo), null;
			case 4: return Se(), null;
			case 10: return aa(t.type), null;
			case 22:
			case 23: return vo(t), uo(), e !== null && he(Ea), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return aa(_a), null;
			case 25: return null;
			default: return null;
		}
	}
	function Qc(e, t) {
		switch (Vi(t), t.tag) {
			case 3:
				aa(_a), Se();
				break;
			case 26:
			case 27:
			case 5:
				D(t);
				break;
			case 4:
				Se();
				break;
			case 31:
				t.memoizedState !== null && vo(t);
				break;
			case 13:
				vo(t);
				break;
			case 19:
				he(yo);
				break;
			case 10:
				aa(t.type);
				break;
			case 22:
			case 23:
				vo(t), uo(), e !== null && he(Ea);
				break;
			case 24: aa(_a);
		}
	}
	function $c(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			id(t, t.return, e);
		}
	}
	function el(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								id(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			id(t, t.return, e);
		}
	}
	function tl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				ao(t, n);
			} catch (t) {
				id(e, e.return, t);
			}
		}
	}
	function nl(e, t, n) {
		n.props = rc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			id(e, t, n);
		}
	}
	function rl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			id(e, t, n);
		}
	}
	function il(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				id(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				id(e, t, n);
			}
			else n.current = null;
		}
	}
	function al(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			id(e, e.return, t);
		}
	}
	function ol(e, t, n) {
		try {
			var r = e.stateNode;
			Xd(r, e.type, n, t), r[_t] = t;
		} catch (t) {
			id(e, e.return, t);
		}
	}
	function sl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && pf(e.type) || e.tag === 4;
	}
	function cl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || sl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && pf(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function ll(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = un));
		else if (r !== 4 && (r === 27 && pf(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (ll(e, t, n), e = e.sibling; e !== null;) ll(e, t, n), e = e.sibling;
	}
	function ul(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && pf(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (ul(e, t, n), e = e.sibling; e !== null;) ul(e, t, n), e = e.sibling;
	}
	function dl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Yd(t, r, n), t[gt] = e, t[_t] = n;
		} catch (t) {
			id(e, e.return, t);
		}
	}
	var fl = !1, pl = !1, ml = !1, hl = typeof WeakSet == "function" ? WeakSet : Set, gl = null;
	function _l(e, t) {
		if (e = e.containerInfo, $d = bp, e = Lr(e), Rr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var i = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || i !== 0 && f.nodeType !== 3 || (c = s + i), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === i && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (ef = {
			focusedElem: e,
			selectionRange: n
		}, bp = !1, gl = t; gl !== null;) if (t = gl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, gl = e;
		else for (; gl !== null;) {
			switch (t = gl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, i = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = rc(n.type, i);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							id(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) gf(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								gf(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(a(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, gl = e;
				break;
			}
			gl = t.return;
		}
	}
	function vl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Nl(e, n), r & 4 && $c(5, n);
				break;
			case 1:
				if (Nl(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						id(n, n.return, e);
					}
					else {
						var i = rc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							id(n, n.return, e);
						}
					}
				}
				r & 64 && tl(n), r & 512 && rl(n, n.return);
				break;
			case 3:
				if (Nl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						ao(e, t);
					} catch (e) {
						id(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && dl(n);
			case 26:
			case 5:
				Nl(e, n), t === null && r & 4 && al(n), r & 512 && rl(n, n.return);
				break;
			case 12:
				Nl(e, n);
				break;
			case 31:
				Nl(e, n), r & 4 && wl(e, n);
				break;
			case 13:
				Nl(e, n), r & 4 && Tl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = cd.bind(null, n), Sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || fl, !r) {
					t = t !== null && t.memoizedState !== null || pl, i = fl;
					var a = pl;
					fl = r, (pl = t) && !a ? Fl(e, n, !!(n.subtreeFlags & 8772)) : Nl(e, n), fl = i, pl = a;
				}
				break;
			case 30: break;
			default: Nl(e, n);
		}
	}
	function yl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, yl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && wt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var bl = null, xl = !1;
	function Sl(e, t, n) {
		for (n = n.child; n !== null;) Cl(e, t, n), n = n.sibling;
	}
	function Cl(e, t, n) {
		if (Ge && typeof Ge.onCommitFiberUnmount == "function") try {
			Ge.onCommitFiberUnmount(We, n);
		} catch {}
		switch (n.tag) {
			case 26:
				pl || il(n, t), Sl(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				pl || il(n, t);
				var r = bl, i = xl;
				pf(n.type) && (bl = n.stateNode, xl = !1), Sl(e, t, n), Of(n.stateNode), bl = r, xl = i;
				break;
			case 5: pl || il(n, t);
			case 6:
				if (r = bl, i = xl, bl = null, Sl(e, t, n), bl = r, xl = i, bl !== null) {
					if (xl) try {
						(bl.nodeType === 9 ? bl.body : bl.nodeName === "HTML" ? bl.ownerDocument.body : bl).removeChild(n.stateNode);
					} catch (e) {
						id(n, t, e);
					}
					else try {
						bl.removeChild(n.stateNode);
					} catch (e) {
						id(n, t, e);
					}
				}
				break;
			case 18:
				bl !== null && (xl ? (e = bl, mf(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Kp(e)) : mf(bl, n.stateNode));
				break;
			case 4:
				r = bl, i = xl, bl = n.stateNode.containerInfo, xl = !0, Sl(e, t, n), bl = r, xl = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				el(2, n, t), pl || el(4, n, t), Sl(e, t, n);
				break;
			case 1:
				pl || (il(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && nl(n, t, r)), Sl(e, t, n);
				break;
			case 21:
				Sl(e, t, n);
				break;
			case 22:
				pl = (r = pl) || n.memoizedState !== null, Sl(e, t, n), pl = r;
				break;
			default: Sl(e, t, n);
		}
	}
	function wl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Kp(e);
			} catch (e) {
				id(t, t.return, e);
			}
		}
	}
	function Tl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Kp(e);
		} catch (e) {
			id(t, t.return, e);
		}
	}
	function El(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new hl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new hl()), t;
			default: throw Error(a(435, e.tag));
		}
	}
	function Dl(e, t) {
		var n = El(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = ld.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Ol(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (pf(c.type)) {
							bl = c.stateNode, xl = !1;
							break a;
						}
						break;
					case 5:
						bl = c.stateNode, xl = !1;
						break a;
					case 3:
					case 4:
						bl = c.stateNode.containerInfo, xl = !0;
						break a;
				}
				c = c.return;
			}
			if (bl === null) throw Error(a(160));
			Cl(o, s, i), bl = null, xl = !1, o = i.alternate, o !== null && (o.return = null), i.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Al(t, e), t = t.sibling;
	}
	var kl = null;
	function Al(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				Ol(t, e), jl(e), r & 4 && (el(3, e, e.return), $c(3, e), el(5, e, e.return));
				break;
			case 1:
				Ol(t, e), jl(e), r & 512 && (pl || n === null || il(n, n.return)), r & 64 && fl && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var i = kl;
				if (Ol(t, e), jl(e), r & 512 && (pl || n === null || il(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) {
						if (r === null) {
							if (e.stateNode === null) {
								a: {
									r = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
									b: switch (r) {
										case "title":
											o = i.getElementsByTagName("title")[0], (!o || o[Ct] || o[gt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = i.createElement(r), i.head.insertBefore(o, i.querySelector("head > title"))), Yd(o, r, n), o[gt] = e, kt(o), r = o;
											break a;
										case "link":
											var s = ep("link", "href", i).get(r + (n.href || ""));
											if (s) {
												for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = i.createElement(r), Yd(o, r, n), i.head.appendChild(o);
											break;
										case "meta":
											if (s = ep("meta", "content", i).get(r + (n.content || ""))) {
												for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = i.createElement(r), Yd(o, r, n), i.head.appendChild(o);
											break;
										default: throw Error(a(468, r));
									}
									o[gt] = e, kt(o), r = o;
								}
								e.stateNode = r;
							} else tp(i, e.type, e.stateNode);
						} else e.stateNode = Yf(i, r, e.memoizedProps);
					} else o === r ? r === null && e.stateNode !== null && ol(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? tp(i, e.type, e.stateNode) : Yf(i, r, e.memoizedProps));
				}
				break;
			case 27:
				Ol(t, e), jl(e), r & 512 && (pl || n === null || il(n, n.return)), n !== null && r & 4 && ol(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (Ol(t, e), jl(e), r & 512 && (pl || n === null || il(n, n.return)), e.flags & 32) {
					i = e.stateNode;
					try {
						tn(i, "");
					} catch (t) {
						id(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (i = e.memoizedProps, ol(e, i, n === null ? i : n.memoizedProps)), r & 1024 && (ml = !0);
				break;
			case 6:
				if (Ol(t, e), jl(e), r & 4) {
					if (e.stateNode === null) throw Error(a(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						id(e, e.return, t);
					}
				}
				break;
			case 3:
				if ($f = null, i = kl, kl = z(t.containerInfo), Ol(t, e), kl = i, jl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Kp(t.containerInfo);
				} catch (t) {
					id(e, e.return, t);
				}
				ml && (ml = !1, Ml(e));
				break;
			case 4:
				r = kl, kl = z(e.stateNode.containerInfo), Ol(t, e), jl(e), kl = r;
				break;
			case 12:
				Ol(t, e), jl(e);
				break;
			case 31:
				Ol(t, e), jl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, Dl(e, r)));
				break;
			case 13:
				Ol(t, e), jl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (fu = Fe()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, Dl(e, r)));
				break;
			case 22:
				i = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = fl, d = pl;
				if (fl = u || i, pl = d || l, Ol(t, e), pl = d, fl = u, jl(e), r & 8192) a: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || l || fl || pl || Pl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, i) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								id(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = i ? "" : l.memoizedProps;
							} catch (e) {
								id(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								i ? hf(m, !0) : hf(l.stateNode, !1);
							} catch (e) {
								id(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, Dl(e, n))));
				break;
			case 19:
				Ol(t, e), jl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, Dl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: Ol(t, e), jl(e);
		}
	}
	function jl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (sl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(a(160));
				switch (n.tag) {
					case 27:
						var i = n.stateNode;
						ul(e, cl(e), i);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (tn(o, ""), n.flags &= -33), ul(e, cl(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						ll(e, cl(e), s);
						break;
					default: throw Error(a(161));
				}
			} catch (t) {
				id(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Ml(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Ml(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function Nl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) vl(e, t.alternate, t), t = t.sibling;
	}
	function Pl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					el(4, t, t.return), Pl(t);
					break;
				case 1:
					il(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && nl(t, t.return, n), Pl(t);
					break;
				case 27: Of(t.stateNode);
				case 26:
				case 5:
					il(t, t.return), Pl(t);
					break;
				case 22:
					t.memoizedState === null && Pl(t);
					break;
				case 30:
					Pl(t);
					break;
				default: Pl(t);
			}
			e = e.sibling;
		}
	}
	function Fl(e, t, n) {
		for (n &&= !!(t.subtreeFlags & 8772), t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Fl(i, a, n), $c(4, a);
					break;
				case 1:
					if (Fl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						id(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) io(c[i], s);
						} catch (e) {
							id(r, r.return, e);
						}
					}
					n && o & 64 && tl(a), rl(a, a.return);
					break;
				case 27: dl(a);
				case 26:
				case 5:
					Fl(i, a, n), n && r === null && o & 4 && al(a), rl(a, a.return);
					break;
				case 12:
					Fl(i, a, n);
					break;
				case 31:
					Fl(i, a, n), n && o & 4 && wl(i, a);
					break;
				case 13:
					Fl(i, a, n), n && o & 4 && Tl(i, a);
					break;
				case 22:
					a.memoizedState === null && Fl(i, a, n), rl(a, a.return);
					break;
				case 30: break;
				default: Fl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Il(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ya(n));
	}
	function Ll(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ya(e));
	}
	function Rl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) zl(e, t, n, r), t = t.sibling;
	}
	function zl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Rl(e, t, n, r), i & 2048 && $c(9, t);
				break;
			case 1:
				Rl(e, t, n, r);
				break;
			case 3:
				Rl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ya(e)));
				break;
			case 12:
				if (i & 2048) {
					Rl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						id(t, t.return, e);
					}
				} else Rl(e, t, n, r);
				break;
			case 31:
				Rl(e, t, n, r);
				break;
			case 13:
				Rl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Rl(e, t, n, r) : (a._visibility |= 2, N(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)) : a._visibility & 2 ? Rl(e, t, n, r) : Bl(e, t), i & 2048 && Il(o, t);
				break;
			case 24:
				Rl(e, t, n, r), i & 2048 && Ll(t.alternate, t);
				break;
			default: Rl(e, t, n, r);
		}
	}
	function N(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					N(a, o, s, c, i), $c(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, N(a, o, s, c, i)) : u._visibility & 2 ? N(a, o, s, c, i) : Bl(a, o), i && l & 2048 && Il(o.alternate, o);
					break;
				case 24:
					N(a, o, s, c, i), i && l & 2048 && Ll(o.alternate, o);
					break;
				default: N(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Bl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Bl(n, r), i & 2048 && Il(r.alternate, r);
					break;
				case 24:
					Bl(n, r), i & 2048 && Ll(r.alternate, r);
					break;
				default: Bl(n, r);
			}
			t = t.sibling;
		}
	}
	var Vl = 8192;
	function Hl(e, t, n) {
		if (e.subtreeFlags & Vl) for (e = e.child; e !== null;) Ul(e, t, n), e = e.sibling;
	}
	function Ul(e, t, n) {
		switch (e.tag) {
			case 26:
				Hl(e, t, n), e.flags & Vl && e.memoizedState !== null && ip(n, kl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Hl(e, t, n);
				break;
			case 3:
			case 4:
				var r = kl;
				kl = z(e.stateNode.containerInfo), Hl(e, t, n), kl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Vl, Vl = 16777216, Hl(e, t, n), Vl = r) : Hl(e, t, n));
				break;
			default: Hl(e, t, n);
		}
	}
	function Wl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Gl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				gl = r, Jl(r, e);
			}
			Wl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Kl(e), e = e.sibling;
	}
	function Kl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Gl(e), e.flags & 2048 && el(9, e, e.return);
				break;
			case 3:
				Gl(e);
				break;
			case 12:
				Gl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, ql(e)) : Gl(e);
				break;
			default: Gl(e);
		}
	}
	function ql(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				gl = r, Jl(r, e);
			}
			Wl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					el(8, t, t.return), ql(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, ql(t));
					break;
				default: ql(t);
			}
			e = e.sibling;
		}
	}
	function Jl(e, t) {
		for (; gl !== null;) {
			var n = gl;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					el(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ya(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, gl = r;
			else a: for (n = e; gl !== null;) {
				r = gl;
				var i = r.sibling, a = r.return;
				if (yl(r), r === n) {
					gl = null;
					break a;
				}
				if (i !== null) {
					i.return = a, gl = i;
					break a;
				}
				gl = a;
			}
		}
	}
	var Yl = {
		getCacheForType: function(e) {
			var t = da(_a), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return da(_a).controller.signal;
		}
	}, Xl = typeof WeakMap == "function" ? WeakMap : Map, Zl = 0, P = null, F = null, I = 0, Ql = 0, $l = null, eu = !1, tu = !1, nu = !1, ru = 0, iu = 0, au = 0, ou = 0, su = 0, cu = 0, lu = 0, L = null, uu = null, du = !1, fu = 0, pu = 0, mu = Infinity, hu = null, gu = null, _u = 0, vu = null, yu = null, bu = 0, xu = 0, Su = null, Cu = null, wu = 0, Tu = null;
	function Eu() {
		return Zl & 2 && I !== 0 ? I & -I : T.T === null ? pt() : Td();
	}
	function Du() {
		if (cu === 0) {
			if (!(I & 536870912) || k) {
				var e = Qe;
				Qe <<= 1, !(Qe & 3932160) && (Qe = 262144), cu = e;
			} else cu = 536870912;
		}
		return e = fo.current, e !== null && (e.flags |= 32), cu;
	}
	function Ou(e, t, n) {
		(e === P && (Ql === 2 || Ql === 9) || e.cancelPendingCommit !== null) && (Fu(e, 0), Mu(e, I, cu, !1)), ot(e, n), (!(Zl & 2) || e !== P) && (e === P && (!(Zl & 2) && (ou |= n), iu === 4 && Mu(e, I, cu, !1)), _d(e));
	}
	function ku(e, t, n) {
		if (Zl & 6) throw Error(a(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || nt(e, t), i = r ? Uu(e, t) : Vu(e, t, !0), o = r;
		do {
			if (i === 0) {
				tu && !r && Mu(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !ju(n)) {
				i = Vu(e, t, !1), o = !1;
				continue;
			}
			if (i === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						i = L;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (Fu(c, s).flags |= 256), s = Vu(c, s, !1), s !== 2) {
							if (nu && !l) {
								c.errorRecoveryDisabledLanes |= o, ou |= o, i = 4;
								break a;
							}
							o = uu, uu = i, o !== null && (uu === null ? uu = o : uu.push.apply(uu, o));
						}
						i = s;
					}
					if (o = !1, i !== 2) continue;
				}
			}
			if (i === 1) {
				Fu(e, 0), Mu(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = i, o) {
					case 0:
					case 1: throw Error(a(345));
					case 4: if ((t & 4194048) !== t) break;
					case 6:
						Mu(r, t, cu, !eu);
						break a;
					case 2:
						uu = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(a(329));
				}
				if ((t & 62914560) === t && (i = fu + 300 - Fe(), 10 < i)) {
					if (Mu(r, t, cu, !eu), tt(r, 0, !0) !== 0) break a;
					bu = t, r.timeoutHandle = cf(Au.bind(null, r, n, uu, hu, du, t, cu, ou, lu, eu, o, "Throttled", -0, 0), i);
					break a;
				}
				Au(r, n, uu, hu, du, t, cu, ou, lu, eu, o, null, -0, 0);
			}
			break;
		} while (1);
		_d(e);
	}
	function Au(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: un
			}, Ul(t, a, d);
			var m = (a & 62914560) === a ? fu - Fe() : (a & 4194048) === a ? pu - Fe() : 0;
			if (m = op(d, m), m !== null) {
				bu = a, e.cancelPendingCommit = m(Xu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), Mu(e, a, o, !l);
				return;
			}
		}
		Xu(e, t, a, n, r, i, o, s, c);
	}
	function ju(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Mr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Mu(e, t, n, r) {
		t &= ~su, t &= ~ou, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - qe(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ct(e, n, t);
	}
	function Nu() {
		return Zl & 6 ? !0 : (vd(0, !1), !1);
	}
	function Pu() {
		if (F !== null) {
			if (Ql === 0) var e = F.return;
			else e = F, ra = na = null, zo(e), Ba = null, Va = 0, e = F;
			for (; e !== null;) Qc(e.alternate, e), e = e.return;
			F = null;
		}
	}
	function Fu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, lf(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), bu = 0, Pu(), P = e, F = n = bi(e.current, null), I = t, Ql = 0, $l = null, eu = !1, tu = nt(e, t), nu = !1, lu = cu = su = ou = au = iu = 0, uu = L = null, du = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - qe(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return ru = t, ui(), n;
	}
	function Iu(e, t) {
		M = null, T.H = Ys, t === Aa || t === Ma ? (t = Ra(), Ql = 3) : t === ja ? (t = Ra(), Ql = 4) : Ql = t === pc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, $l = t, F === null && (iu = 1, sc(e, Oi(t, e.current)));
	}
	function Lu() {
		var e = fo.current;
		return e === null ? !0 : (I & 4194048) === I ? po === null : (I & 62914560) === I || I & 536870912 ? e === po : !1;
	}
	function Ru() {
		var e = T.H;
		return T.H = Ys, e === null ? Ys : e;
	}
	function zu() {
		var e = T.A;
		return T.A = Yl, e;
	}
	function Bu() {
		iu = 4, eu || (I & 4194048) !== I && fo.current !== null || (tu = !0), !(au & 134217727) && !(ou & 134217727) || P === null || Mu(P, I, cu, !1);
	}
	function Vu(e, t, n) {
		var r = Zl;
		Zl |= 2;
		var i = Ru(), a = zu();
		(P !== e || I !== t) && (hu = null, Fu(e, t)), t = !1;
		var o = iu;
		a: do
			try {
				if (Ql !== 0 && F !== null) {
					var s = F, c = $l;
					switch (Ql) {
						case 8:
							Pu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							fo.current === null && (t = !0);
							var l = Ql;
							if (Ql = 0, $l = null, qu(e, s, c, l), n && tu) {
								o = 0;
								break a;
							}
							break;
						default: l = Ql, Ql = 0, $l = null, qu(e, s, c, l);
					}
				}
				Hu(), o = iu;
				break;
			} catch (t) {
				Iu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ra = na = null, Zl = r, T.H = i, T.A = a, F === null && (P = null, I = 0, ui()), o;
	}
	function Hu() {
		for (; F !== null;) Gu(F);
	}
	function Uu(e, t) {
		var n = Zl;
		Zl |= 2;
		var r = Ru(), i = zu();
		P !== e || I !== t ? (hu = null, mu = Fe() + 500, Fu(e, t)) : tu = nt(e, t);
		a: do
			try {
				if (Ql !== 0 && F !== null) {
					t = F;
					var o = $l;
					b: switch (Ql) {
						case 1:
							Ql = 0, $l = null, qu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Pa(o)) {
								Ql = 0, $l = null, Ku(t);
								break;
							}
							t = function() {
								Ql !== 2 && Ql !== 9 || P !== e || (Ql = 7), _d(e);
							}, o.then(t, t);
							break a;
						case 3:
							Ql = 7;
							break a;
						case 4:
							Ql = 5;
							break a;
						case 7:
							Pa(o) ? (Ql = 0, $l = null, Ku(t)) : (Ql = 0, $l = null, qu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (F.tag) {
								case 26: s = F.memoizedState;
								case 5:
								case 27:
									var c = F;
									if (s ? rp(s) : c.stateNode.complete) {
										Ql = 0, $l = null;
										var l = c.sibling;
										if (l !== null) F = l;
										else {
											var u = c.return;
											u === null ? F = null : (F = u, Ju(u));
										}
										break b;
									}
							}
							Ql = 0, $l = null, qu(e, t, o, 5);
							break;
						case 6:
							Ql = 0, $l = null, qu(e, t, o, 6);
							break;
						case 8:
							Pu(), iu = 6;
							break a;
						default: throw Error(a(462));
					}
				}
				Wu();
				break;
			} catch (t) {
				Iu(e, t);
			}
		while (1);
		return ra = na = null, T.H = r, T.A = i, Zl = n, F === null ? (P = null, I = 0, ui(), iu) : 0;
	}
	function Wu() {
		for (; F !== null && !Ne();) Gu(F);
	}
	function Gu(e) {
		var t = Uc(e.alternate, e, ru);
		e.memoizedProps = e.pendingProps, t === null ? Ju(e) : F = t;
	}
	function Ku(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Dc(n, t, t.pendingProps, t.type, void 0, I);
				break;
			case 11:
				t = Dc(n, t, t.pendingProps, t.type.render, t.ref, I);
				break;
			case 5: zo(t);
			default: Qc(n, t), t = F = xi(t, ru), t = Uc(n, t, ru);
		}
		e.memoizedProps = e.pendingProps, t === null ? Ju(e) : F = t;
	}
	function qu(e, t, n, r) {
		ra = na = null, zo(t), Ba = null, Va = 0;
		var i = t.return;
		try {
			if (fc(e, i, t, n, I)) {
				iu = 1, sc(e, Oi(n, e.current)), F = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw F = i, t;
			iu = 1, sc(e, Oi(n, e.current)), F = null;
			return;
		}
		t.flags & 32768 ? (k || r === 1 ? e = !0 : tu || I & 536870912 ? e = !1 : (eu = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = fo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Yu(t, e)) : Ju(t);
	}
	function Ju(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Yu(t, eu);
				return;
			}
			e = t.return;
			var n = Xc(t.alternate, t, ru);
			if (n !== null) {
				F = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				F = t;
				return;
			}
			F = t = e;
		} while (t !== null);
		iu === 0 && (iu = 5);
	}
	function Yu(e, t) {
		do {
			var n = Zc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, F = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				F = e;
				return;
			}
			F = e = n;
		} while (e !== null);
		iu = 6, F = null;
	}
	function Xu(e, t, n, r, i, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			td();
		while (_u !== 0);
		if (Zl & 6) throw Error(a(327));
		if (t !== null) {
			if (t === e.current) throw Error(a(177));
			if (o = t.lanes | t.childLanes, o |= li, st(e, n, o, s, c, l), e === P && (F = P = null, I = 0), yu = t, vu = e, bu = n, xu = o, Su = i, Cu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, ud(ze, function() {
				return nd(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = T.T, T.T = null, i = E.p, E.p = 2, s = Zl, Zl |= 4;
				try {
					_l(e, t, n);
				} finally {
					Zl = s, E.p = i, T.T = r;
				}
			}
			_u = 1, Zu(), Qu(), $u();
		}
	}
	function Zu() {
		if (_u === 1) {
			_u = 0;
			var e = vu, t = yu, n = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || n) {
				n = T.T, T.T = null;
				var r = E.p;
				E.p = 2;
				var i = Zl;
				Zl |= 4;
				try {
					Al(t, e);
					var a = ef, o = Lr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Ir(s.ownerDocument.documentElement, s)) {
						if (c !== null && Rr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Fr(s, h), v = Fr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					bp = !!$d, ef = $d = null;
				} finally {
					Zl = i, E.p = r, T.T = n;
				}
			}
			e.current = t, _u = 2;
		}
	}
	function Qu() {
		if (_u === 2) {
			_u = 0;
			var e = vu, t = yu, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = T.T, T.T = null;
				var r = E.p;
				E.p = 2;
				var i = Zl;
				Zl |= 4;
				try {
					vl(e, t.alternate, t);
				} finally {
					Zl = i, E.p = r, T.T = n;
				}
			}
			_u = 3;
		}
	}
	function $u() {
		if (_u === 4 || _u === 3) {
			_u = 0, Pe();
			var e = vu, t = yu, n = bu, r = Cu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? _u = 5 : (_u = 0, yu = vu = null, ed(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (gu = null), ft(n), t = t.stateNode, Ge && typeof Ge.onCommitFiberRoot == "function") try {
				Ge.onCommitFiberRoot(We, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = T.T, i = E.p, E.p = 2, T.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					T.T = t, E.p = i;
				}
			}
			bu & 3 && td(), _d(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === Tu ? wu++ : (wu = 0, Tu = e) : wu = 0, vd(0, !1);
		}
	}
	function ed(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ya(t)));
	}
	function td() {
		return Zu(), Qu(), $u(), nd();
	}
	function nd() {
		if (_u !== 5) return !1;
		var e = vu, t = xu;
		xu = 0;
		var n = ft(bu), r = T.T, i = E.p;
		try {
			E.p = 32 > n ? 32 : n, T.T = null, n = Su, Su = null;
			var o = vu, s = bu;
			if (_u = 0, yu = vu = null, bu = 0, Zl & 6) throw Error(a(331));
			var c = Zl;
			if (Zl |= 4, Kl(o.current), zl(o, o.current, s, n), Zl = c, vd(0, !1), Ge && typeof Ge.onPostCommitFiberRoot == "function") try {
				Ge.onPostCommitFiberRoot(We, o);
			} catch {}
			return !0;
		} finally {
			E.p = i, T.T = r, ed(e, t);
		}
	}
	function rd(e, t, n) {
		t = Oi(n, t), t = lc(e.stateNode, t, 2), e = Qa(e, t, 2), e !== null && (ot(e, 2), _d(e));
	}
	function id(e, t, n) {
		if (e.tag === 3) rd(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				rd(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (gu === null || !gu.has(r))) {
					e = Oi(n, e), n = uc(2), r = Qa(t, n, 2), r !== null && (dc(n, r, t, e), ot(r, 2), _d(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function ad(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Xl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (nu = !0, i.add(n), e = od.bind(null, e, t, n), t.then(e, e));
	}
	function od(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, P === e && (I & n) === n && (iu === 4 || iu === 3 && (I & 62914560) === I && 300 > Fe() - fu ? !(Zl & 2) && Fu(e, 0) : su |= n, lu === I && (lu = 0)), _d(e);
	}
	function sd(e, t) {
		t === 0 && (t = it()), e = pi(e, t), e !== null && (ot(e, t), _d(e));
	}
	function cd(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), sd(e, n);
	}
	function ld(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, i = e.memoizedState;
				i !== null && (n = i.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(a(314));
		}
		r !== null && r.delete(t), sd(e, n);
	}
	function ud(e, t) {
		return je(e, t);
	}
	var dd = null, fd = null, pd = !1, md = !1, hd = !1, gd = 0;
	function _d(e) {
		e !== fd && e.next === null && (fd === null ? dd = fd = e : fd = fd.next = e), md = !0, pd || (pd = !0, wd());
	}
	function vd(e, t) {
		if (!hd && md) {
			hd = !0;
			do
				for (var n = !1, r = dd; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - qe(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Cd(r, a));
						} else a = I, a = tt(r, r === P ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || nt(r, a) || (n = !0, Cd(r, a));
					}
					r = r.next;
				}
			while (n);
			hd = !1;
		}
	}
	function yd() {
		bd();
	}
	function bd() {
		md = pd = !1;
		var e = 0;
		gd !== 0 && sf() && (e = gd);
		for (var t = Fe(), n = null, r = dd; r !== null;) {
			var i = r.next, a = xd(r, t);
			a === 0 ? (r.next = null, n === null ? dd = i : n.next = i, i === null && (fd = n)) : (n = r, (e !== 0 || a & 3) && (md = !0)), r = i;
		}
		_u !== 0 && _u !== 5 || vd(e, !1), gd !== 0 && (gd = 0);
	}
	function xd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - qe(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = rt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = P, n = I, n = tt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Ql === 2 || Ql === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Me(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || nt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Me(r), ft(n)) {
				case 2:
				case 8:
					n = Re;
					break;
				case 32:
					n = ze;
					break;
				case 268435456:
					n = Ve;
					break;
				default: n = ze;
			}
			return r = Sd.bind(null, e), n = je(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Me(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Sd(e, t) {
		if (_u !== 0 && _u !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (td() && e.callbackNode !== n) return null;
		var r = I;
		return r = tt(e, e === P ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (ku(e, r, t), xd(e, Fe()), e.callbackNode != null && e.callbackNode === n ? Sd.bind(null, e) : null);
	}
	function Cd(e, t) {
		if (td()) return null;
		ku(e, t, !0);
	}
	function wd() {
		df(function() {
			Zl & 6 ? je(Le, yd) : bd();
		});
	}
	function Td() {
		if (gd === 0) {
			var e = j;
			e === 0 && (e = Ze, Ze <<= 1, !(Ze & 261888) && (Ze = 256)), gd = e;
		}
		return gd;
	}
	function Ed(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : ln("" + e);
	}
	function Dd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function Od(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ed((i[_t] || null).action), o = r.submitter;
			o && (t = (t = o[_t] || null) ? Ed(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new jn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (gd !== 0) {
								var e = o ? Dd(i, o) : new FormData(i);
								Fs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? Dd(i, o) : new FormData(i), Fs(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var kd = 0; kd < ii.length; kd++) {
		var Ad = ii[kd];
		ai(Ad.toLowerCase(), "on" + (Ad[0].toUpperCase() + Ad.slice(1)));
	}
	ai(Xr, "onAnimationEnd"), ai(Zr, "onAnimationIteration"), ai(Qr, "onAnimationStart"), ai("dblclick", "onDoubleClick"), ai("focusin", "onFocus"), ai("focusout", "onBlur"), ai($r, "onTransitionRun"), ai(ei, "onTransitionStart"), ai(ti, "onTransitionCancel"), ai(ni, "onTransitionEnd"), Nt("onMouseEnter", ["mouseout", "mouseover"]), Nt("onMouseLeave", ["mouseout", "mouseover"]), Nt("onPointerEnter", ["pointerout", "pointerover"]), Nt("onPointerLeave", ["pointerout", "pointerover"]), Mt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Mt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Mt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Mt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var jd = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Md = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(jd));
	function Nd(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						oi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						oi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function R(e, t) {
		var n = t[yt];
		n === void 0 && (n = t[yt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Ld(t, e, 2, !1), n.add(r));
	}
	function Pd(e, t, n) {
		var r = 0;
		t && (r |= 4), Ld(n, e, r, t);
	}
	var Fd = "_reactListening" + Math.random().toString(36).slice(2);
	function Id(e) {
		if (!e[Fd]) {
			e[Fd] = !0, At.forEach(function(t) {
				t !== "selectionchange" && (Md.has(t) || Pd(t, !1, e), Pd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Fd] || (t[Fd] = !0, Pd("selectionchange", !1, t));
		}
	}
	function Ld(e, t, n, r) {
		switch (Dp(t)) {
			case 2:
				var i = xp;
				break;
			case 8:
				i = Sp;
				break;
			default: i = Cp;
		}
		n = i.bind(null, t, n, e), i = void 0, !bn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Rd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var o = r.tag;
			if (o === 3 || o === 4) {
				var s = r.stateNode.containerInfo;
				if (s === i) break;
				if (o === 4) for (o = r.return; o !== null;) {
					var l = o.tag;
					if ((l === 3 || l === 4) && o.stateNode.containerInfo === i) return;
					o = o.return;
				}
				for (; s !== null;) {
					if (o = Tt(s), o === null) return;
					if (l = o.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = o;
						continue a;
					}
					s = s.parentNode;
				}
			}
			r = r.return;
		}
		_n(function() {
			var r = a, i = fn(n), o = [];
			a: {
				var s = ri.get(e);
				if (s !== void 0) {
					var l = jn, u = e;
					switch (e) {
						case "keypress": if (En(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Yn;
							break;
						case "focusin":
							u = "focus", l = Bn;
							break;
						case "focusout":
							u = "blur", l = Bn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Bn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Rn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = zn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Zn;
							break;
						case Xr:
						case Zr:
						case Qr:
							l = Vn;
							break;
						case ni:
							l = Qn;
							break;
						case "scroll":
						case "scrollend":
							l = Nn;
							break;
						case "wheel":
							l = $n;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Hn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Xn;
							break;
						case "toggle":
						case "beforetoggle": l = er;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? s === null ? null : s + "Capture" : s;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = vn(m, p), g != null && d.push(zd(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (s = new l(s, u, null, n, i), o.push({
						event: s,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (s = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", s && n !== dn && (u = n.relatedTarget || n.fromElement) && (Tt(u) || u[vt])) break a;
					if ((l || s) && (s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? Tt(u) : null, u !== null && (f = c(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = Rn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Xn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? s : Dt(l), h = u == null ? s : Dt(u), s = new d(g, m + "leave", l, n, i), s.target = f, s.relatedTarget = h, g = null, Tt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Vd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && Hd(o, s, l, d, !1), u !== null && f !== null && Hd(o, f, u, d, !0);
					}
				}
				a: {
					if (s = r ? Dt(r) : window, l = s.nodeName && s.nodeName.toLowerCase(), l === "select" || l === "input" && s.type === "file") var v = br;
					else if (mr(s)) {
						if (xr) v = Ar;
						else {
							v = Or;
							var y = Dr;
						}
					} else l = s.nodeName, !l || l.toLowerCase() !== "input" || s.type !== "checkbox" && s.type !== "radio" ? r && on(r.elementType) && (v = br) : v = kr;
					if (v &&= v(e, r)) {
						hr(o, v, n, i);
						break a;
					}
					y && y(e, s, r), e === "focusout" && r && s.type === "number" && r.memoizedProps.value != null && Zt(s, "number", s.value);
				}
				switch (y = r ? Dt(r) : window, e) {
					case "focusin":
						(mr(y) || y.contentEditable === "true") && (Br = y, Vr = r, Hr = null);
						break;
					case "focusout":
						Hr = Vr = Br = null;
						break;
					case "mousedown":
						Ur = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Ur = !1, Wr(o, n, i);
						break;
					case "selectionchange": if (zr) break;
					case "keydown":
					case "keyup": Wr(o, n, i);
				}
				var b;
				if (nr) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else ur ? cr(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (ar && n.locale !== "ko" && (ur || x !== "onCompositionStart" ? x === "onCompositionEnd" && ur && (b = Tn()) : (Sn = i, Cn = "value" in Sn ? Sn.value : Sn.textContent, ur = !0)), y = Bd(r, x), 0 < y.length && (x = new Un(x, e, null, n, i), o.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = lr(n), b !== null && (x.data = b)))), (b = ir ? dr(e, n) : fr(e, n)) && (x = Bd(r, "onBeforeInput"), 0 < x.length && (y = new Un("onBeforeInput", "beforeinput", null, n, i), o.push({
					event: y,
					listeners: x
				}), y.data = b)), Od(o, e, r, n, i);
			}
			Nd(o, t);
		});
	}
	function zd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Bd(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = vn(e, n), i != null && r.unshift(zd(e, i, a)), i = vn(e, t), i != null && r.push(zd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Vd(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Hd(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = vn(n, a), l != null && o.unshift(zd(n, l, c))) : i || (l = vn(n, a), l != null && o.push(zd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Ud = /\r\n?/g, Wd = /\u0000|\uFFFD/g;
	function Gd(e) {
		return (typeof e == "string" ? e : "" + e).replace(Ud, "\n").replace(Wd, "");
	}
	function Kd(e, t) {
		return t = Gd(t), Gd(e) === t;
	}
	function qd(e, t, n, r, i, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || tn(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && tn(e, "" + r);
				break;
			case "className":
				zt(e, "class", r);
				break;
			case "tabIndex":
				zt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				zt(e, n, r);
				break;
			case "style":
				an(e, r, o);
				break;
			case "data": if (t !== "object") {
				zt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = ln("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && qd(e, t, "name", i.name, i, null), qd(e, t, "formEncType", i.formEncType, i, null), qd(e, t, "formMethod", i.formMethod, i, null), qd(e, t, "formTarget", i.formTarget, i, null)) : (qd(e, t, "encType", i.encType, i, null), qd(e, t, "method", i.method, i, null), qd(e, t, "target", i.target, i, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = ln("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = un);
				break;
			case "onScroll":
				r != null && R("scroll", e);
				break;
			case "onScrollEnd":
				r != null && R("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(a(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(a(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = ln("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				R("beforetoggle", e), R("toggle", e), Rt(e, "popover", r);
				break;
			case "xlinkActuate":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Rt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = sn.get(n) || n, Rt(e, n, r));
		}
	}
	function Jd(e, t, n, r, i, o) {
		switch (n) {
			case "style":
				an(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(a(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(a(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? tn(e, r) : (typeof r == "number" || typeof r == "bigint") && tn(e, "" + r);
				break;
			case "onScroll":
				r != null && R("scroll", e);
				break;
			case "onScrollEnd":
				r != null && R("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = un);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!jt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), o = e[_t] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, i), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Rt(e, n, r);
			}
		}
	}
	function Yd(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				R("error", e), R("load", e);
				var r = !1, i = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							i = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(a(137, t));
						default: qd(e, t, o, s, n, null);
					}
				}
				i && qd(e, t, "srcSet", n.srcSet, n, null), r && qd(e, t, "src", n.src, n, null);
				return;
			case "input":
				R("invalid", e);
				var c = o = s = i = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							i = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(a(137, t));
							break;
						default: qd(e, t, r, d, n, null);
					}
				}
				Xt(e, o, c, l, u, s, i, !1);
				return;
			case "select":
				for (i in R("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(i) && (c = n[i], c != null)) switch (i) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: qd(e, t, i, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Qt(e, !!r, n, !0) : Qt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in R("invalid", e), o = i = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						i = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(a(91));
						break;
					default: qd(e, t, s, c, n, null);
				}
				en(e, r, i, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: qd(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				R("beforetoggle", e), R("toggle", e), R("cancel", e), R("close", e);
				break;
			case "iframe":
			case "object":
				R("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < jd.length; r++) R(jd[r], e);
				break;
			case "image":
				R("error", e), R("load", e);
				break;
			case "details":
				R("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": R("error", e), R("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(a(137, t));
					default: qd(e, t, u, r, n, null);
				}
				return;
			default: if (on(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Jd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && qd(e, t, c, r, n, null));
	}
	function Xd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var i = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || qd(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							i = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(a(137, t));
							break;
						default: m !== f && qd(e, t, p, m, r, f);
					}
				}
				Yt(e, s, c, l, u, d, o, i);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || qd(e, t, o, null, r, l);
				}
				for (i in r) if (o = r[i], l = n[i], r.hasOwnProperty(i) && (o != null || l != null)) switch (i) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && qd(e, t, i, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Qt(e, !!n, n ? [] : "", !1) : Qt(e, !!n, t, !0)) : Qt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (i = n[c], n.hasOwnProperty(c) && i != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: qd(e, t, c, null, r, i);
				}
				for (s in r) if (i = r[s], o = n[s], r.hasOwnProperty(s) && (i != null || o != null)) switch (s) {
					case "value":
						p = i;
						break;
					case "defaultValue":
						m = i;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (i != null) throw Error(a(91));
						break;
					default: i !== o && qd(e, t, s, i, r, o);
				}
				$t(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: qd(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: qd(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && qd(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(a(137, t));
						break;
					default: qd(e, t, u, p, r, m);
				}
				return;
			default: if (on(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Jd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Jd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && qd(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || qd(e, t, f, p, r, m);
	}
	function Zd(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Qd() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Zd(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Zd(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var $d = null, ef = null;
	function tf(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function nf(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function rf(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function af(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var of = null;
	function sf() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== of && (of = e, !0) : (of = null, !1);
	}
	var cf = typeof setTimeout == "function" ? setTimeout : void 0, lf = typeof clearTimeout == "function" ? clearTimeout : void 0, uf = typeof Promise == "function" ? Promise : void 0, df = typeof queueMicrotask == "function" ? queueMicrotask : uf === void 0 ? cf : function(e) {
		return uf.resolve(null).then(e).catch(ff);
	};
	function ff(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function pf(e) {
		return e === "head";
	}
	function mf(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Kp(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") Of(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, Of(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Ct] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && Of(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Kp(t);
	}
	function hf(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function gf(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					gf(n), wt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function _f(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Ct]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = Cf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function vf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function yf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function bf(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function xf(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function Sf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function Cf(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var wf = null;
	function Tf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return Cf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function Ef(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function Df(e, t, n) {
		switch (t = tf(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(a(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(a(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(a(454));
				return e;
			default: throw Error(a(451));
		}
	}
	function Of(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		wt(e);
	}
	var kf = /* @__PURE__ */ new Map(), Af = /* @__PURE__ */ new Set();
	function z(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var jf = E.d;
	E.d = {
		f: Mf,
		r: Nf,
		D: If,
		C: Lf,
		L: Rf,
		m: zf,
		X: Vf,
		S: Bf,
		M: Hf
	};
	function Mf() {
		var e = jf.f(), t = Nu();
		return e || t;
	}
	function Nf(e) {
		var t = Et(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ls(t) : jf.r(e);
	}
	var Pf = typeof document > "u" ? null : document;
	function Ff(e, t, n) {
		var r = Pf;
		if (r && typeof t == "string" && t) {
			var i = Jt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), Af.has(i) || (Af.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Yd(t, "link", e), kt(t), r.head.appendChild(t)));
		}
	}
	function If(e) {
		jf.D(e), Ff("dns-prefetch", e, null);
	}
	function Lf(e, t) {
		jf.C(e, t), Ff("preconnect", e, t);
	}
	function Rf(e, t, n) {
		jf.L(e, t, n);
		var r = Pf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Jt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Jt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Jt(n.imageSizes) + "\"]")) : i += "[href=\"" + Jt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Wf(e);
					break;
				case "script": a = Jf(e);
			}
			kf.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), kf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Gf(a)) || t === "script" && r.querySelector(B(a)) || (t = r.createElement("link"), Yd(t, "link", e), kt(t), r.head.appendChild(t)));
		}
	}
	function zf(e, t) {
		jf.m(e, t);
		var n = Pf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Jt(r) + "\"][href=\"" + Jt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Jf(e);
			}
			if (!kf.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), kf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(B(a))) return;
				}
				r = n.createElement("link"), Yd(r, "link", e), kt(r), n.head.appendChild(r);
			}
		}
	}
	function Bf(e, t, n) {
		jf.S(e, t, n);
		var r = Pf;
		if (r && e) {
			var i = Ot(r).hoistableStyles, a = Wf(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Gf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = kf.get(a)) && Zf(e, n);
					var c = o = r.createElement("link");
					kt(c), Yd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Xf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Vf(e, t) {
		jf.X(e, t);
		var n = Pf;
		if (n && e) {
			var r = Ot(n).hoistableScripts, i = Jf(e), a = r.get(i);
			a || (a = n.querySelector(B(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = kf.get(i)) && Qf(e, t), a = n.createElement("script"), kt(a), Yd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Hf(e, t) {
		jf.M(e, t);
		var n = Pf;
		if (n && e) {
			var r = Ot(n).hoistableScripts, i = Jf(e), a = r.get(i);
			a || (a = n.querySelector(B(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = kf.get(i)) && Qf(e, t), a = n.createElement("script"), kt(a), Yd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Uf(e, t, n, r) {
		var i = (i = ye.current) ? z(i) : null;
		if (!i) throw Error(a(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Wf(n.href), n = Ot(i).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Wf(n.href);
					var o = Ot(i).hoistableStyles, s = o.get(e);
					if (s || (i = i.ownerDocument || i, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = i.querySelector(Gf(e))) && !o._p && (s.instance = o, s.state.loading = 5), kf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, kf.set(e, n), o || qf(i, e, n, s.state))), t && r === null) throw Error(a(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(a(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Jf(n), n = Ot(i).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(a(444, e));
		}
	}
	function Wf(e) {
		return "href=\"" + Jt(e) + "\"";
	}
	function Gf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Kf(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function qf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Yd(t, "link", n), kt(t), e.head.appendChild(t));
	}
	function Jf(e) {
		return "[src=\"" + Jt(e) + "\"]";
	}
	function B(e) {
		return "script[async]" + e;
	}
	function Yf(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Jt(n.href) + "\"]");
				if (r) return t.instance = r, kt(r), r;
				var i = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), kt(r), Yd(r, "style", i), Xf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				i = Wf(n.href);
				var o = e.querySelector(Gf(i));
				if (o) return t.state.loading |= 4, t.instance = o, kt(o), o;
				r = Kf(n), (i = kf.get(i)) && Zf(r, i), o = (e.ownerDocument || e).createElement("link"), kt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Yd(o, "link", r), t.state.loading |= 4, Xf(o, n.precedence, e), t.instance = o;
			case "script": return o = Jf(n.src), (i = e.querySelector(B(o))) ? (t.instance = i, kt(i), i) : (r = n, (i = kf.get(o)) && (r = h({}, n), Qf(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), kt(i), Yd(i, "link", r), e.head.appendChild(i), t.instance = i);
			case "void": return null;
			default: throw Error(a(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Xf(r, n.precedence, e));
		return t.instance;
	}
	function Xf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Zf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Qf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var $f = null;
	function ep(e, t, n) {
		if ($f === null) {
			var r = /* @__PURE__ */ new Map(), i = $f = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = $f, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Ct] || a[gt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function tp(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function np(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function rp(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function ip(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Wf(r.href), a = t.querySelector(Gf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = sp.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, kt(a);
					return;
				}
				a = t.ownerDocument || t, r = Kf(r), (i = kf.get(i)) && Zf(r, i), a = a.createElement("link"), kt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Yd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = sp.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var ap = 0;
	function op(e, t) {
		return e.stylesheets && e.count === 0 && lp(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && lp(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && ap === 0 && (ap = 62500 * Qd());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && lp(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > ap ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function sp() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) lp(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var cp = null;
	function lp(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, cp = /* @__PURE__ */ new Map(), t.forEach(up, e), cp = null, sp.call(e));
	}
	function up(e, t) {
		if (!(t.state.loading & 4)) {
			var n = cp.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), cp.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = sp.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var dp = {
		$$typeof: te,
		Provider: null,
		Consumer: null,
		_currentValue: de,
		_currentValue2: de,
		_threadCount: 0
	};
	function fp(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = at(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = at(0), this.hiddenUpdates = at(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function pp(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new fp(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = vi(3, null, null, t), e.current = a, a.stateNode = e, t = va(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ya(a), e;
	}
	function mp(e) {
		return e ? (e = gi, e) : gi;
	}
	function hp(e, t, n, r, i, a) {
		i = mp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Za(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Qa(e, r, t), n !== null && (Ou(n, e, t), $a(n, e, t));
	}
	function gp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function _p(e, t) {
		gp(e, t), (e = e.alternate) && gp(e, t);
	}
	function vp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pi(e, 67108864);
			t !== null && Ou(t, e, 67108864), _p(e, 67108864);
		}
	}
	function yp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Eu();
			t = dt(t);
			var n = pi(e, t);
			n !== null && Ou(n, e, t), _p(e, t);
		}
	}
	var bp = !0;
	function xp(e, t, n, r) {
		var i = T.T;
		T.T = null;
		var a = E.p;
		try {
			E.p = 2, Cp(e, t, n, r);
		} finally {
			E.p = a, T.T = i;
		}
	}
	function Sp(e, t, n, r) {
		var i = T.T;
		T.T = null;
		var a = E.p;
		try {
			E.p = 8, Cp(e, t, n, r);
		} finally {
			E.p = a, T.T = i;
		}
	}
	function Cp(e, t, n, r) {
		if (bp) {
			var i = wp(r);
			if (i === null) Rd(e, t, r, Tp, n), Ip(e, r);
			else if (Rp(i, e, t, n, r)) r.stopPropagation();
			else if (Ip(e, r), t & 4 && -1 < Fp.indexOf(e)) {
				for (; i !== null;) {
					var a = Et(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = et(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - qe(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									_d(a), !(Zl & 6) && (mu = Fe() + 500, vd(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = pi(a, 2), s !== null && Ou(s, a, 2), Nu(), _p(a, 2);
					}
					if (a = wp(r), a === null && Rd(e, t, r, Tp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Rd(e, t, r, null, n);
		}
	}
	function wp(e) {
		return e = fn(e), Ep(e);
	}
	var Tp = null;
	function Ep(e) {
		if (Tp = null, e = Tt(e), e !== null) {
			var t = c(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = u(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = d(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return Tp = e, null;
	}
	function Dp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ie()) {
				case Le: return 2;
				case Re: return 8;
				case ze:
				case Be: return 32;
				case Ve: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Op = !1, kp = null, Ap = null, jp = null, Mp = /* @__PURE__ */ new Map(), Np = /* @__PURE__ */ new Map(), Pp = [], Fp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Ip(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				kp = null;
				break;
			case "dragenter":
			case "dragleave":
				Ap = null;
				break;
			case "mouseover":
			case "mouseout":
				jp = null;
				break;
			case "pointerover":
			case "pointerout":
				Mp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Np.delete(t.pointerId);
		}
	}
	function Lp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Et(t), t !== null && vp(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Rp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return kp = Lp(kp, e, t, n, r, i), !0;
			case "dragenter": return Ap = Lp(Ap, e, t, n, r, i), !0;
			case "mouseover": return jp = Lp(jp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Mp.set(a, Lp(Mp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Np.set(a, Lp(Np.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function zp(e) {
		var t = Tt(e.target);
		if (t !== null) {
			var n = c(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = u(n), t !== null) {
						e.blockedOn = t, mt(e.priority, function() {
							yp(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = d(n), t !== null) {
						e.blockedOn = t, mt(e.priority, function() {
							yp(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Bp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = wp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				dn = r, n.target.dispatchEvent(r), dn = null;
			} else return t = Et(n), t !== null && vp(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Vp(e, t, n) {
		Bp(e) && n.delete(t);
	}
	function Hp() {
		Op = !1, kp !== null && Bp(kp) && (kp = null), Ap !== null && Bp(Ap) && (Ap = null), jp !== null && Bp(jp) && (jp = null), Mp.forEach(Vp), Np.forEach(Vp);
	}
	function Up(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Op || (Op = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Hp)));
	}
	var Wp = null;
	function Gp(e) {
		Wp !== e && (Wp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Wp === e && (Wp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Ep(r || n) === null) continue;
					break;
				}
				var a = Et(n);
				a !== null && (e.splice(t, 3), t -= 3, Fs(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Kp(e) {
		function t(t) {
			return Up(t, e);
		}
		kp !== null && Up(kp, e), Ap !== null && Up(Ap, e), jp !== null && Up(jp, e), Mp.forEach(t), Np.forEach(t);
		for (var n = 0; n < Pp.length; n++) {
			var r = Pp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Pp.length && (n = Pp[0], n.blockedOn === null);) zp(n), n.blockedOn === null && Pp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[_t] || null;
			if (typeof a == "function") o || Gp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[_t] || null) s = o.formAction;
					else if (Ep(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Gp(n);
			}
		}
	}
	function qp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Jp(e) {
		this._internalRoot = e;
	}
	Yp.prototype.render = Jp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(a(409));
		var n = t.current;
		hp(n, Eu(), e, t, null, null);
	}, Yp.prototype.unmount = Jp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			hp(e.current, 2, null, e, null, null), Nu(), t[vt] = null;
		}
	};
	function Yp(e) {
		this._internalRoot = e;
	}
	Yp.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = pt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Pp.length && t !== 0 && t < Pp[n].priority; n++);
			Pp.splice(n, 0, e), n === 0 && zp(e);
		}
	};
	var Xp = n.version;
	if (Xp !== "19.2.8") throw Error(a(527, Xp, "19.2.8"));
	E.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
		return e = p(t), e = e === null ? null : m(e), e = e === null ? null : e.stateNode, e;
	};
	var Zp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: T,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Qp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Qp.isDisabled && Qp.supportsFiber) try {
			We = Qp.inject(Zp), Ge = Qp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!s(e)) throw Error(a(299));
		var n = !1, r = "", i = ic, o = ac, c = oc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (o = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = pp(e, 1, !1, null, null, n, r, null, i, o, c, qp), e[vt] = t.current, Id(e), new Jp(t);
	}, e.hydrateRoot = function(e, t, n) {
		if (!s(e)) throw Error(a(299));
		var r = !1, i = "", o = ic, c = ac, l = oc, u = null;
		return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (o = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (l = n.onRecoverableError), n.formState !== void 0 && (u = n.formState)), t = pp(e, 1, !0, t, n ?? null, r, i, u, o, c, l, qp), t.context = mp(null), n = t.current, r = Eu(), r = dt(r), i = Za(r), i.callback = null, Qa(n, i, r), n = r, t.current.lanes = n, ot(t, n), _d(t), e[vt] = t.current, Id(e), new Yp(t);
	}, e.version = "19.2.8";
})), d = /* @__PURE__ */ e(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e, t) {
			for (e = e.memoizedState; e !== null && 0 < t;) e = e.next, t--;
			return e;
		}
		function n(e, t, r, i) {
			if (r >= t.length) return i;
			var a = t[r], o = Jf(e) ? e.slice() : z({}, e);
			return o[a] = n(e[a], t, r + 1, i), o;
		}
		function i(e, t, n) {
			if (t.length !== n.length) console.warn("copyWithRename() expects paths of the same length");
			else {
				for (var r = 0; r < n.length - 1; r++) if (t[r] !== n[r]) {
					console.warn("copyWithRename() expects paths to be the same except for the deepest key");
					return;
				}
				return a(e, t, n, 0);
			}
		}
		function a(e, t, n, r) {
			var i = t[r], o = Jf(e) ? e.slice() : z({}, e);
			return r + 1 === t.length ? (o[n[r]] = o[i], Jf(o) ? o.splice(i, 1) : delete o[i]) : o[i] = a(e[i], t, n, r + 1), o;
		}
		function s(e, t, n) {
			var r = t[n], i = Jf(e) ? e.slice() : z({}, e);
			return n + 1 === t.length ? (Jf(i) ? i.splice(r, 1) : delete i[r], i) : (i[r] = s(e[r], t, n + 1), i);
		}
		function c() {
			return !1;
		}
		function u() {
			return null;
		}
		function d() {
			console.error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks");
		}
		function f() {
			console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
		}
		function p() {}
		function m() {}
		function h(e) {
			var t = [];
			return e.forEach(function(e) {
				t.push(e);
			}), t.sort().join(", ");
		}
		function g(e, t, n, r) {
			return new Cr(e, t, n, r);
		}
		function _(e, t) {
			e.context === Fg && (tf(e.current, 2, t, e, null, null), dl());
		}
		function v(e, t) {
			if (Ig !== null) {
				var n = t.staleFamilies;
				t = t.updatedFamilies, Ll(), Sr(e.current, t, n), dl();
			}
		}
		function y(e) {
			Ig = e;
		}
		function b(e) {
			return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
		}
		function x(e) {
			var t = e, n = e;
			if (e.alternate) for (; t.return;) t = t.return;
			else {
				e = t;
				do
					t = e, t.flags & 4098 && (n = t.return), e = t.return;
				while (e);
			}
			return t.tag === 3 ? n : null;
		}
		function ee(e) {
			if (e.tag === 13) {
				var t = e.memoizedState;
				if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
			}
			return null;
		}
		function te(e) {
			if (e.tag === 31) {
				var t = e.memoizedState;
				if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
			}
			return null;
		}
		function ne(e) {
			if (x(e) !== e) throw Error("Unable to find node on an unmounted component.");
		}
		function re(e) {
			var t = e.alternate;
			if (!t) {
				if (t = x(e), t === null) throw Error("Unable to find node on an unmounted component.");
				return t === e ? e : null;
			}
			for (var n = e, r = t;;) {
				var i = n.return;
				if (i === null) break;
				var a = i.alternate;
				if (a === null) {
					if (r = i.return, r !== null) {
						n = r;
						continue;
					}
					break;
				}
				if (i.child === a.child) {
					for (a = i.child; a;) {
						if (a === n) return ne(i), e;
						if (a === r) return ne(i), t;
						a = a.sibling;
					}
					throw Error("Unable to find node on an unmounted component.");
				}
				if (n.return !== r.return) n = i, r = a;
				else {
					for (var o = !1, s = i.child; s;) {
						if (s === n) {
							o = !0, n = i, r = a;
							break;
						}
						if (s === r) {
							o = !0, r = i, n = a;
							break;
						}
						s = s.sibling;
					}
					if (!o) {
						for (s = a.child; s;) {
							if (s === n) {
								o = !0, n = a, r = i;
								break;
							}
							if (s === r) {
								o = !0, r = a, n = i;
								break;
							}
							s = s.sibling;
						}
						if (!o) throw Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
					}
				}
				if (n.alternate !== r) throw Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
			}
			if (n.tag !== 3) throw Error("Unable to find node on an unmounted component.");
			return n.stateNode.current === n ? e : t;
		}
		function ie(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e;
			for (e = e.child; e !== null;) {
				if (t = ie(e), t !== null) return t;
				e = e.sibling;
			}
			return null;
		}
		function ae(e) {
			return typeof e != "object" || !e ? null : (e = Kf && e[Kf] || e["@@iterator"], typeof e == "function" ? e : null);
		}
		function S(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === qf ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case Pf: return "Fragment";
				case If: return "Profiler";
				case Ff: return "StrictMode";
				case Bf: return "Suspense";
				case Vf: return "SuspenseList";
				case Wf: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case Nf: return "Portal";
				case Rf: return e.displayName || "Context";
				case Lf: return (e._context.displayName || "Context") + ".Consumer";
				case zf:
					var t = e.render;
					return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case Hf: return t = e.displayName || null, t === null ? S(e.type) || "Memo" : t;
				case Uf:
					t = e._payload, e = e._init;
					try {
						return S(e(t));
					} catch {}
			}
			return null;
		}
		function oe(e) {
			return typeof e.tag == "number" ? C(e) : typeof e.name == "string" ? e.name : null;
		}
		function C(e) {
			var t = e.type;
			switch (e.tag) {
				case 31: return "Activity";
				case 24: return "Cache";
				case 9: return (t._context.displayName || "Context") + ".Consumer";
				case 10: return t.displayName || "Context";
				case 18: return "DehydratedFragment";
				case 11: return e = t.render, e = e.displayName || e.name || "", t.displayName || (e === "" ? "ForwardRef" : "ForwardRef(" + e + ")");
				case 7: return "Fragment";
				case 26:
				case 27:
				case 5: return t;
				case 4: return "Portal";
				case 3: return "Root";
				case 6: return "Text";
				case 16: return S(t);
				case 8: return t === Ff ? "StrictMode" : "Mode";
				case 22: return "Offscreen";
				case 12: return "Profiler";
				case 21: return "Scope";
				case 13: return "Suspense";
				case 19: return "SuspenseList";
				case 25: return "TracingMarker";
				case 1:
				case 0:
				case 14:
				case 15:
					if (typeof t == "function") return t.displayName || t.name || null;
					if (typeof t == "string") return t;
					break;
				case 29:
					if (t = e._debugInfo, t != null) {
						for (var n = t.length - 1; 0 <= n; n--) if (typeof t[n].name == "string") return t[n].name;
					}
					if (e.return !== null) return C(e.return);
			}
			return null;
		}
		function se(e) {
			return { current: e };
		}
		function ce(e, t) {
			0 > $f ? console.error("Unexpected pop.") : (t !== Qf[$f] && console.error("Unexpected Fiber popped."), e.current = Zf[$f], Zf[$f] = null, Qf[$f] = null, $f--);
		}
		function w(e, t, n) {
			$f++, Zf[$f] = e.current, Qf[$f] = n, e.current = t;
		}
		function le(e) {
			return e === null && console.error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."), e;
		}
		function ue(e, t) {
			w(np, t, e), w(tp, e, e), w(ep, null, e);
			var n = t.nodeType;
			switch (n) {
				case 9:
				case 11:
					n = n === 9 ? "#document" : "#fragment", t = (t = t.documentElement) && (t = t.namespaceURI) ? Hu(t) : WS;
					break;
				default: if (n = t.tagName, t = t.namespaceURI) t = Hu(t), t = Uu(t, n);
				else switch (n) {
					case "svg":
						t = GS;
						break;
					case "math":
						t = KS;
						break;
					default: t = WS;
				}
			}
			n = n.toLowerCase(), n = Gt(null, n), n = {
				context: t,
				ancestorInfo: n
			}, ce(ep, e), w(ep, n, e);
		}
		function T(e) {
			ce(ep, e), ce(tp, e), ce(np, e);
		}
		function E() {
			return le(ep.current);
		}
		function de(e) {
			e.memoizedState !== null && w(rp, e, e);
			var t = le(ep.current), n = e.type, r = Uu(t.context, n);
			n = Gt(t.ancestorInfo, n), r = {
				context: r,
				ancestorInfo: n
			}, t !== r && (w(tp, e, e), w(ep, r, e));
		}
		function fe(e) {
			tp.current === e && (ce(ep, e), ce(tp, e)), rp.current === e && (ce(rp, e), xC._currentValue = bC);
		}
		function pe() {}
		function me() {
			if (ip === 0) {
				ap = console.log, op = console.info, sp = console.warn, cp = console.error, lp = console.group, up = console.groupCollapsed, dp = console.groupEnd;
				var e = {
					configurable: !0,
					enumerable: !0,
					value: pe,
					writable: !0
				};
				Object.defineProperties(console, {
					info: e,
					log: e,
					warn: e,
					error: e,
					group: e,
					groupCollapsed: e,
					groupEnd: e
				});
			}
			ip++;
		}
		function he() {
			if (ip--, ip === 0) {
				var e = {
					configurable: !0,
					enumerable: !0,
					writable: !0
				};
				Object.defineProperties(console, {
					log: z({}, e, { value: ap }),
					info: z({}, e, { value: op }),
					warn: z({}, e, { value: sp }),
					error: z({}, e, { value: cp }),
					group: z({}, e, { value: lp }),
					groupCollapsed: z({}, e, { value: up }),
					groupEnd: z({}, e, { value: dp })
				});
			}
			0 > ip && console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
		}
		function ge(e) {
			var t = Error.prepareStackTrace;
			if (Error.prepareStackTrace = void 0, e = e.stack, Error.prepareStackTrace = t, e.startsWith("Error: react-stack-top-frame\n") && (e = e.slice(29)), t = e.indexOf("\n"), t !== -1 && (e = e.slice(t + 1)), t = e.indexOf("react_stack_bottom_frame"), t !== -1 && (t = e.lastIndexOf("\n", t)), t !== -1) e = e.slice(0, t);
			else return "";
			return e;
		}
		function _e(e) {
			if (fp === void 0) try {
				throw Error();
			} catch (e) {
				var t = e.stack.trim().match(/\n( *(at )?)/);
				fp = t && t[1] || "", pp = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
			}
			return "\n" + fp + e + pp;
		}
		function ve(e, t) {
			if (!e || mp) return "";
			var n = hp.get(e);
			if (n !== void 0) return n;
			mp = !0, n = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
			var r = null;
			r = B.H, B.H = null, me();
			try {
				var i = { DetermineComponentFrameRoot: function() {
					try {
						if (t) {
							var n = function() {
								throw Error();
							};
							if (Object.defineProperty(n.prototype, "props", { set: function() {
								throw Error();
							} }), typeof Reflect == "object" && Reflect.construct) {
								try {
									Reflect.construct(n, []);
								} catch (e) {
									var r = e;
								}
								Reflect.construct(e, [], n);
							} else {
								try {
									n.call();
								} catch (e) {
									r = e;
								}
								e.call(n.prototype);
							}
						} else {
							try {
								throw Error();
							} catch (e) {
								r = e;
							}
							(n = e()) && typeof n.catch == "function" && n.catch(function() {});
						}
					} catch (e) {
						if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
					}
					return [null, null];
				} };
				i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
				var a = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, "name");
				a && a.configurable && Object.defineProperty(i.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
				var o = i.DetermineComponentFrameRoot(), s = o[0], c = o[1];
				if (s && c) {
					var l = s.split("\n"), u = c.split("\n");
					for (o = a = 0; a < l.length && !l[a].includes("DetermineComponentFrameRoot");) a++;
					for (; o < u.length && !u[o].includes("DetermineComponentFrameRoot");) o++;
					if (a === l.length || o === u.length) for (a = l.length - 1, o = u.length - 1; 1 <= a && 0 <= o && l[a] !== u[o];) o--;
					for (; 1 <= a && 0 <= o; a--, o--) if (l[a] !== u[o]) {
						if (a !== 1 || o !== 1) do
							if (a--, o--, 0 > o || l[a] !== u[o]) {
								var d = "\n" + l[a].replace(" at new ", " at ");
								return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), typeof e == "function" && hp.set(e, d), d;
							}
						while (1 <= a && 0 <= o);
						break;
					}
				}
			} finally {
				mp = !1, B.H = r, he(), Error.prepareStackTrace = n;
			}
			return l = (l = e ? e.displayName || e.name : "") ? _e(l) : "", typeof e == "function" && hp.set(e, l), l;
		}
		function ye(e, t) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5: return _e(e.type);
				case 16: return _e("Lazy");
				case 13: return e.child !== t && t !== null ? _e("Suspense Fallback") : _e("Suspense");
				case 19: return _e("SuspenseList");
				case 0:
				case 15: return ve(e.type, !1);
				case 11: return ve(e.type.render, !1);
				case 1: return ve(e.type, !0);
				case 31: return _e("Activity");
				default: return "";
			}
		}
		function be(e) {
			try {
				var t = "", n = null;
				do {
					t += ye(e, n);
					var r = e._debugInfo;
					if (r) for (var i = r.length - 1; 0 <= i; i--) {
						var a = r[i];
						if (typeof a.name == "string") {
							var o = t;
							a: {
								var s = a.name, c = a.env, l = a.debugLocation;
								if (l != null) {
									var u = ge(l), d = u.lastIndexOf("\n"), f = d === -1 ? u : u.slice(d + 1);
									if (f.indexOf(s) !== -1) {
										var p = "\n" + f;
										break a;
									}
								}
								p = _e(s + (c ? " [" + c + "]" : ""));
							}
							t = o + p;
						}
					}
					n = e, e = e.return;
				} while (e);
				return t;
			} catch (e) {
				return "\nError generating stack: " + e.message + "\n" + e.stack;
			}
		}
		function xe(e) {
			return (e = e ? e.displayName || e.name : "") ? _e(e) : "";
		}
		function Se() {
			if (gp === null) return null;
			var e = gp._debugOwner;
			return e == null ? null : oe(e);
		}
		function Ce() {
			if (gp === null) return "";
			var e = gp;
			try {
				var t = "";
				switch (e.tag === 6 && (e = e.return), e.tag) {
					case 26:
					case 27:
					case 5:
						t += _e(e.type);
						break;
					case 13:
						t += _e("Suspense");
						break;
					case 19:
						t += _e("SuspenseList");
						break;
					case 31:
						t += _e("Activity");
						break;
					case 30:
					case 0:
					case 15:
					case 1:
						e._debugOwner || t !== "" || (t += xe(e.type));
						break;
					case 11: e._debugOwner || t !== "" || (t += xe(e.type.render));
				}
				for (; e;) if (typeof e.tag == "number") {
					var n = e;
					e = n._debugOwner;
					var r = n._debugStack;
					if (e && r) {
						var i = ge(r);
						i !== "" && (t += "\n" + i);
					}
				} else if (e.debugStack != null) {
					var a = e.debugStack;
					(e = e.owner) && a && (t += "\n" + ge(a));
				} else break;
				var o = t;
			} catch (e) {
				o = "\nError generating stack: " + e.message + "\n" + e.stack;
			}
			return o;
		}
		function D(e, t, n, r, i, a, o) {
			var s = gp;
			we(e);
			try {
				return e !== null && e._debugTask ? e._debugTask.run(t.bind(null, n, r, i, a, o)) : t(n, r, i, a, o);
			} finally {
				we(s);
			}
			throw Error("runWithFiberInDEV should never be called in production. This is a bug in React.");
		}
		function we(e) {
			B.getCurrentStack = e === null ? null : Ce, _p = !1, gp = e;
		}
		function Te(e) {
			return typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
		}
		function Ee(e) {
			try {
				return De(e), !1;
			} catch {
				return !0;
			}
		}
		function De(e) {
			return "" + e;
		}
		function O(e, t) {
			if (Ee(e)) return console.error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before using it here.", t, Te(e)), De(e);
		}
		function Oe(e, t) {
			if (Ee(e)) return console.error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before using it here.", t, Te(e)), De(e);
		}
		function ke(e) {
			if (Ee(e)) return console.error("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before using it here.", Te(e)), De(e);
		}
		function Ae(e) {
			if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u") return !1;
			var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
			if (t.isDisabled) return !0;
			if (!t.supportsFiber) return console.error("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://react.dev/link/react-devtools"), !0;
			try {
				Mp = t.inject(e), Np = t;
			} catch (e) {
				console.error("React instrumentation encountered an error: %o.", e);
			}
			return !!t.checkDCE;
		}
		function je(e) {
			if (typeof Ap == "function" && jp(e), Np && typeof Np.setStrictMode == "function") try {
				Np.setStrictMode(Mp, e);
			} catch (e) {
				Pp || (Pp = !0, console.error("React instrumentation encountered an error: %o", e));
			}
		}
		function Me(e) {
			return e >>>= 0, e === 0 ? 32 : 31 - (Lp(e) / Rp | 0) | 0;
		}
		function Ne(e) {
			var t = e & 42;
			if (t !== 0) return t;
			switch (e & -e) {
				case 1: return 1;
				case 2: return 2;
				case 4: return 4;
				case 8: return 8;
				case 16: return 16;
				case 32: return 32;
				case 64: return 64;
				case 128: return 128;
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072: return e & 261888;
				case 262144:
				case 524288:
				case 1048576:
				case 2097152: return e & 3932160;
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432: return e & 62914560;
				case 67108864: return 67108864;
				case 134217728: return 134217728;
				case 268435456: return 268435456;
				case 536870912: return 536870912;
				case 1073741824: return 0;
				default: return console.error("Should have found matching lanes. This is a bug in React."), e;
			}
		}
		function Pe(e, t, n) {
			var r = e.pendingLanes;
			if (r === 0) return 0;
			var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
			e = e.warmLanes;
			var s = r & 134217727;
			return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Ne(n))) : i = Ne(o) : i = Ne(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Ne(n))) : i = Ne(o)) : i = Ne(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
		}
		function Fe(e, t) {
			return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
		}
		function Ie(e, t) {
			switch (e) {
				case 1:
				case 2:
				case 4:
				case 8:
				case 64: return t + 250;
				case 16:
				case 32:
				case 128:
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072:
				case 262144:
				case 524288:
				case 1048576:
				case 2097152: return t + 5e3;
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432: return -1;
				case 67108864:
				case 134217728:
				case 268435456:
				case 536870912:
				case 1073741824: return -1;
				default: return console.error("Should have found matching lanes. This is a bug in React."), -1;
			}
		}
		function Le() {
			var e = Vp;
			return Vp <<= 1, !(Vp & 62914560) && (Vp = 4194304), e;
		}
		function Re(e) {
			for (var t = [], n = 0; 31 > n; n++) t.push(e);
			return t;
		}
		function ze(e, t) {
			e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
		}
		function Be(e, t, n, r, i, a) {
			var o = e.pendingLanes;
			e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
			var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
			for (n = o & ~n; 0 < n;) {
				var u = 31 - Ip(n), d = 1 << u;
				s[u] = 0, c[u] = -1;
				var f = l[u];
				if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
					var p = f[u];
					p !== null && (p.lane &= -536870913);
				}
				n &= ~d;
			}
			r !== 0 && Ve(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
		}
		function Ve(e, t, n) {
			e.pendingLanes |= t, e.suspendedLanes &= ~t;
			var r = 31 - Ip(t);
			e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
		}
		function He(e, t) {
			var n = e.entangledLanes |= t;
			for (e = e.entanglements; n;) {
				var r = 31 - Ip(n), i = 1 << r;
				i & t | e[r] & t && (e[r] |= t), n &= ~i;
			}
		}
		function Ue(e, t) {
			var n = t & -t;
			return n = n & 42 ? 1 : We(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
		}
		function We(e) {
			switch (e) {
				case 2:
					e = 1;
					break;
				case 8:
					e = 4;
					break;
				case 32:
					e = 16;
					break;
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072:
				case 262144:
				case 524288:
				case 1048576:
				case 2097152:
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432:
					e = 128;
					break;
				case 268435456:
					e = 134217728;
					break;
				default: e = 0;
			}
			return e;
		}
		function Ge(e, t, n) {
			if (Fp) for (e = e.pendingUpdatersLaneMap; 0 < n;) {
				var r = 31 - Ip(n), i = 1 << r;
				e[r].add(t), n &= ~i;
			}
		}
		function Ke(e, t) {
			if (Fp) for (var n = e.pendingUpdatersLaneMap, r = e.memoizedUpdaters; 0 < t;) {
				var i = 31 - Ip(t);
				e = 1 << i, i = n[i], 0 < i.size && (i.forEach(function(e) {
					var t = e.alternate;
					t !== null && r.has(t) || r.add(e);
				}), i.clear()), t &= ~e;
			}
		}
		function qe(e) {
			return e &= -e, Hp !== 0 && Hp < e ? Up !== 0 && Up < e ? e & 134217727 ? Wp : Gp : Up : Hp;
		}
		function Je() {
			var e = Yf.p;
			return e === 0 ? (e = window.event, e === void 0 ? Wp : pf(e.type)) : e;
		}
		function Ye(e, t) {
			var n = Yf.p;
			try {
				return Yf.p = e, t();
			} finally {
				Yf.p = n;
			}
		}
		function Xe(e) {
			delete e[qp], delete e[Jp], delete e[Xp], delete e[Zp], delete e[Qp];
		}
		function Ze(e) {
			var t = e[qp];
			if (t) return t;
			for (var n = e.parentNode; n;) {
				if (t = n[Yp] || n[qp]) {
					if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Cd(e); e !== null;) {
						if (n = e[qp]) return n;
						e = Cd(e);
					}
					return t;
				}
				e = n, n = e.parentNode;
			}
			return null;
		}
		function Qe(e) {
			if (e = e[qp] || e[Yp]) {
				var t = e.tag;
				if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
			}
			return null;
		}
		function $e(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
			throw Error("getNodeFromInstance: Invalid argument.");
		}
		function et(e) {
			var t = e[$p];
			return t ||= e[$p] = {
				hoistableStyles: /* @__PURE__ */ new Map(),
				hoistableScripts: /* @__PURE__ */ new Map()
			}, t;
		}
		function tt(e) {
			e[em] = !0;
		}
		function nt(e, t) {
			rt(e, t), rt(e + "Capture", t);
		}
		function rt(e, t) {
			nm[e] && console.error("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), nm[e] = t;
			var n = e.toLowerCase();
			for (rm[n] = e, e === "onDoubleClick" && (rm.ondblclick = e), e = 0; e < t.length; e++) tm.add(t[e]);
		}
		function it(e, t) {
			im[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || console.error(e === "select" ? "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set `onChange`." : "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || console.error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
		}
		function at(e) {
			return vp.call(sm, e) ? !0 : vp.call(om, e) ? !1 : am.test(e) ? sm[e] = !0 : (om[e] = !0, console.error("Invalid attribute name: `%s`", e), !1);
		}
		function ot(e, t, n) {
			if (at(t)) {
				if (!e.hasAttribute(t)) {
					switch (typeof n) {
						case "symbol":
						case "object": return n;
						case "function": return n;
						case "boolean": if (!1 === n) return n;
					}
					return n === void 0 ? void 0 : null;
				}
				return e = e.getAttribute(t), e === "" && !0 === n || (O(n, t), e === "" + n ? n : e);
			}
		}
		function st(e, t, n) {
			if (at(t)) {
				if (n === null) e.removeAttribute(t);
				else {
					switch (typeof n) {
						case "undefined":
						case "function":
						case "symbol":
							e.removeAttribute(t);
							return;
						case "boolean":
							var r = t.toLowerCase().slice(0, 5);
							if (r !== "data-" && r !== "aria-") {
								e.removeAttribute(t);
								return;
							}
					}
					O(n, t), e.setAttribute(t, "" + n);
				}
			}
		}
		function ct(e, t, n) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
					case "boolean":
						e.removeAttribute(t);
						return;
				}
				O(n, t), e.setAttribute(t, "" + n);
			}
		}
		function lt(e, t, n, r) {
			if (r === null) e.removeAttribute(n);
			else {
				switch (typeof r) {
					case "undefined":
					case "function":
					case "symbol":
					case "boolean":
						e.removeAttribute(n);
						return;
				}
				O(r, n), e.setAttributeNS(t, n, "" + r);
			}
		}
		function ut(e) {
			switch (typeof e) {
				case "bigint":
				case "boolean":
				case "number":
				case "string":
				case "undefined": return e;
				case "object": return ke(e), e;
				default: return "";
			}
		}
		function dt(e) {
			var t = e.type;
			return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
		}
		function ft(e, t, n) {
			var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
			if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
				var i = r.get, a = r.set;
				return Object.defineProperty(e, t, {
					configurable: !0,
					get: function() {
						return i.call(this);
					},
					set: function(e) {
						ke(e), n = "" + e, a.call(this, e);
					}
				}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
					getValue: function() {
						return n;
					},
					setValue: function(e) {
						ke(e), n = "" + e;
					},
					stopTracking: function() {
						e._valueTracker = null, delete e[t];
					}
				};
			}
		}
		function pt(e) {
			if (!e._valueTracker) {
				var t = dt(e) ? "checked" : "value";
				e._valueTracker = ft(e, t, "" + e[t]);
			}
		}
		function mt(e) {
			if (!e) return !1;
			var t = e._valueTracker;
			if (!t) return !0;
			var n = t.getValue(), r = "";
			return e && (r = dt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
		}
		function ht(e) {
			if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
			try {
				return e.activeElement || e.body;
			} catch {
				return e.body;
			}
		}
		function gt(e) {
			return e.replace(cm, function(e) {
				return "\\" + e.charCodeAt(0).toString(16) + " ";
			});
		}
		function _t(e, t) {
			t.checked === void 0 || t.defaultChecked === void 0 || um || (console.error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components", Se() || "A component", t.type), um = !0), t.value === void 0 || t.defaultValue === void 0 || lm || (console.error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components", Se() || "A component", t.type), lm = !0);
		}
		function vt(e, t, n, r, i, a, o, s) {
			e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? (O(o, "type"), e.type = o) : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ut(t)) : e.value !== "" + ut(t) && (e.value = "" + ut(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : bt(e, o, ut(n)) : bt(e, o, ut(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? (O(s, "name"), e.name = "" + ut(s)) : e.removeAttribute("name");
		}
		function yt(e, t, n, r, i, a, o, s) {
			if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (O(a, "type"), e.type = a), t != null || n != null) {
				if (!(a !== "submit" && a !== "reset" || t != null)) {
					pt(e);
					return;
				}
				n = n == null ? "" : "" + ut(n), t = t == null ? n : "" + ut(t), s || t === e.value || (e.value = t), e.defaultValue = t;
			}
			r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (O(o, "name"), e.name = o), pt(e);
		}
		function bt(e, t, n) {
			t === "number" && ht(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
		}
		function xt(e, t) {
			t.value ?? (typeof t.children == "object" && t.children !== null ? kf.Children.forEach(t.children, function(e) {
				e == null || typeof e == "string" || typeof e == "number" || typeof e == "bigint" || fm || (fm = !0, console.error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>."));
			}) : t.dangerouslySetInnerHTML == null || pm || (pm = !0, console.error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected."))), t.selected == null || dm || (console.error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), dm = !0);
		}
		function St() {
			var e = Se();
			return e ? "\n\nCheck the render method of `" + e + "`." : "";
		}
		function Ct(e, t, n, r) {
			if (e = e.options, t) {
				t = {};
				for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
				for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
			} else {
				for (n = "" + ut(n), t = null, i = 0; i < e.length; i++) {
					if (e[i].value === n) {
						e[i].selected = !0, r && (e[i].defaultSelected = !0);
						return;
					}
					t !== null || e[i].disabled || (t = e[i]);
				}
				t !== null && (t.selected = !0);
			}
		}
		function wt(e, t) {
			for (e = 0; e < hm.length; e++) {
				var n = hm[e];
				if (t[n] != null) {
					var r = Jf(t[n]);
					t.multiple && !r ? console.error("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", n, St()) : !t.multiple && r && console.error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", n, St());
				}
			}
			t.value === void 0 || t.defaultValue === void 0 || mm || (console.error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://react.dev/link/controlled-components"), mm = !0);
		}
		function Tt(e, t) {
			t.value === void 0 || t.defaultValue === void 0 || gm || (console.error("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://react.dev/link/controlled-components", Se() || "A component"), gm = !0), t.children != null && t.value == null && console.error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
		}
		function Et(e, t, n) {
			if (t != null && (t = "" + ut(t), t !== e.value && (e.value = t), n == null)) {
				e.defaultValue !== t && (e.defaultValue = t);
				return;
			}
			e.defaultValue = n == null ? "" : "" + ut(n);
		}
		function Dt(e, t, n, r) {
			if (t == null) {
				if (r != null) {
					if (n != null) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
					if (Jf(r)) {
						if (1 < r.length) throw Error("<textarea> can only have at most one child.");
						r = r[0];
					}
					n = r;
				}
				n ??= "", t = n;
			}
			n = ut(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), pt(e);
		}
		function Ot(e, t) {
			return e.serverProps === void 0 && e.serverTail.length === 0 && e.children.length === 1 && 3 < e.distanceFromLeaf && e.distanceFromLeaf > 15 - t ? Ot(e.children[0], t) : e;
		}
		function kt(e) {
			return "  " + "  ".repeat(e);
		}
		function At(e) {
			return "+ " + "  ".repeat(e);
		}
		function jt(e) {
			return "- " + "  ".repeat(e);
		}
		function Mt(e) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5: return e.type;
				case 16: return "Lazy";
				case 31: return "Activity";
				case 13: return "Suspense";
				case 19: return "SuspenseList";
				case 0:
				case 15: return e = e.type, e.displayName || e.name || null;
				case 11: return e = e.type.render, e.displayName || e.name || null;
				case 1: return e = e.type, e.displayName || e.name || null;
				default: return null;
			}
		}
		function Nt(e, t) {
			return _m.test(e) ? (e = JSON.stringify(e), e.length > t - 2 ? 8 > t ? "{\"...\"}" : "{" + e.slice(0, t - 7) + "...\"}" : "{" + e + "}") : e.length > t ? 5 > t ? "{\"...\"}" : e.slice(0, t - 3) + "..." : e;
		}
		function Pt(e, t, n) {
			var r = 120 - 2 * n;
			if (t === null) return At(n) + Nt(e, r) + "\n";
			if (typeof t == "string") {
				for (var i = 0; i < t.length && i < e.length && t.charCodeAt(i) === e.charCodeAt(i); i++);
				return i > r - 8 && 10 < i && (e = "..." + e.slice(i - 8), t = "..." + t.slice(i - 8)), At(n) + Nt(e, r) + "\n" + jt(n) + Nt(t, r) + "\n";
			}
			return kt(n) + Nt(e, r) + "\n";
		}
		function Ft(e) {
			return Object.prototype.toString.call(e).replace(/^\[object (.*)\]$/, function(e, t) {
				return t;
			});
		}
		function It(e, t) {
			switch (typeof e) {
				case "string": return e = JSON.stringify(e), e.length > t ? 5 > t ? "\"...\"" : e.slice(0, t - 4) + "...\"" : e;
				case "object":
					if (e === null) return "null";
					if (Jf(e)) return "[...]";
					if (e.$$typeof === Mf) return (t = S(e.type)) ? "<" + t + ">" : "<...>";
					var n = Ft(e);
					if (n === "Object") {
						for (var r in n = "", t -= 2, e) if (e.hasOwnProperty(r)) {
							var i = JSON.stringify(r);
							if (i !== "\"" + r + "\"" && (r = i), t -= r.length - 2, i = It(e[r], 15 > t ? t : 15), t -= i.length, 0 > t) {
								n += n === "" ? "..." : ", ...";
								break;
							}
							n += (n === "" ? "" : ",") + r + ":" + i;
						}
						return "{" + n + "}";
					}
					return n;
				case "function": return (t = e.displayName || e.name) ? "function " + t : "function";
				default: return String(e);
			}
		}
		function Lt(e, t) {
			return typeof e != "string" || _m.test(e) ? "{" + It(e, t - 2) + "}" : e.length > t - 2 ? 5 > t ? "\"...\"" : "\"" + e.slice(0, t - 5) + "...\"" : "\"" + e + "\"";
		}
		function Rt(e, t, n) {
			var r = 120 - n.length - e.length, i = [], a;
			for (a in t) if (t.hasOwnProperty(a) && a !== "children") {
				var o = Lt(t[a], 120 - n.length - a.length - 1);
				r -= a.length + o.length + 2, i.push(a + "=" + o);
			}
			return i.length === 0 ? n + "<" + e + ">\n" : 0 < r ? n + "<" + e + " " + i.join(" ") + ">\n" : n + "<" + e + "\n" + n + "  " + i.join("\n" + n + "  ") + "\n" + n + ">\n";
		}
		function zt(e, t, n) {
			var r = "", i = z({}, t), a;
			for (a in e) if (e.hasOwnProperty(a)) {
				delete i[a];
				var o = 120 - 2 * n - a.length - 2, s = It(e[a], o);
				t.hasOwnProperty(a) ? (o = It(t[a], o), r += At(n) + a + ": " + s + "\n", r += jt(n) + a + ": " + o + "\n") : r += At(n) + a + ": " + s + "\n";
			}
			for (var c in i) i.hasOwnProperty(c) && (e = It(i[c], 120 - 2 * n - c.length - 2), r += jt(n) + c + ": " + e + "\n");
			return r;
		}
		function Bt(e, t, n, r) {
			var i = "", a = /* @__PURE__ */ new Map();
			for (l in n) n.hasOwnProperty(l) && a.set(l.toLowerCase(), l);
			if (a.size === 1 && a.has("children")) i += Rt(e, t, kt(r));
			else {
				for (var o in t) if (t.hasOwnProperty(o) && o !== "children") {
					var s = 120 - 2 * (r + 1) - o.length - 1, c = a.get(o.toLowerCase());
					if (c !== void 0) {
						a.delete(o.toLowerCase());
						var l = t[o];
						c = n[c];
						var u = Lt(l, s);
						s = Lt(c, s), typeof l == "object" && l && typeof c == "object" && c && Ft(l) === "Object" && Ft(c) === "Object" && (2 < Object.keys(l).length || 2 < Object.keys(c).length || -1 < u.indexOf("...") || -1 < s.indexOf("...")) ? i += kt(r + 1) + o + "={{\n" + zt(l, c, r + 2) + kt(r + 1) + "}}\n" : (i += At(r + 1) + o + "=" + u + "\n", i += jt(r + 1) + o + "=" + s + "\n");
					} else i += kt(r + 1) + o + "=" + Lt(t[o], s) + "\n";
				}
				a.forEach(function(e) {
					if (e !== "children") {
						var t = 120 - 2 * (r + 1) - e.length - 1;
						i += jt(r + 1) + e + "=" + Lt(n[e], t) + "\n";
					}
				}), i = i === "" ? kt(r) + "<" + e + ">\n" : kt(r) + "<" + e + "\n" + i + kt(r) + ">\n";
			}
			return e = n.children, t = t.children, typeof e == "string" || typeof e == "number" || typeof e == "bigint" ? (a = "", (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (a = "" + t), i += Pt(a, "" + e, r + 1)) : (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (i = e == null ? i + Pt("" + t, null, r + 1) : i + Pt("" + t, void 0, r + 1)), i;
		}
		function Vt(e, t) {
			var n = Mt(e);
			if (n === null) {
				for (n = "", e = e.child; e;) n += Vt(e, t), e = e.sibling;
				return n;
			}
			return kt(t) + "<" + n + ">\n";
		}
		function Ht(e, t) {
			var n = Ot(e, t);
			if (n !== e && (e.children.length !== 1 || e.children[0] !== n)) return kt(t) + "...\n" + Ht(n, t + 1);
			n = "";
			var r = e.fiber._debugInfo;
			if (r) for (var i = 0; i < r.length; i++) {
				var a = r[i].name;
				typeof a == "string" && (n += kt(t) + "<" + a + ">\n", t++);
			}
			if (r = "", i = e.fiber.pendingProps, e.fiber.tag === 6) r = Pt(i, e.serverProps, t), t++;
			else if (a = Mt(e.fiber), a !== null) {
				if (e.serverProps === void 0) {
					r = t;
					var o = 120 - 2 * r - a.length - 2, s = "";
					for (l in i) if (i.hasOwnProperty(l) && l !== "children") {
						var c = Lt(i[l], 15);
						if (o -= l.length + c.length + 2, 0 > o) {
							s += " ...";
							break;
						}
						s += " " + l + "=" + c;
					}
					r = kt(r) + "<" + a + s + ">\n", t++;
				} else e.serverProps === null ? (r = Rt(a, i, At(t)), t++) : typeof e.serverProps == "string" ? console.error("Should not have matched a non HostText fiber to a Text node. This is a bug in React.") : (r = Bt(a, i, e.serverProps, t), t++);
			}
			var l = "";
			for (i = e.fiber.child, a = 0; i && a < e.children.length;) o = e.children[a], o.fiber === i ? (l += Ht(o, t), a++) : l += Vt(i, t), i = i.sibling;
			for (i && 0 < e.children.length && (l += kt(t) + "...\n"), i = e.serverTail, e.serverProps === null && t--, e = 0; e < i.length; e++) a = i[e], l = typeof a == "string" ? l + (jt(t) + Nt(a, 120 - 2 * t) + "\n") : l + Rt(a.type, a.props, jt(t));
			return n + r + l;
		}
		function Ut(e) {
			try {
				return "\n\n" + Ht(e, 0);
			} catch {
				return "";
			}
		}
		function Wt(e, t, n) {
			for (var r = t, i = null, a = 0; r;) r === e && (a = 0), i = {
				fiber: r,
				children: i === null ? [] : [i],
				serverProps: r === t ? n : r === e ? null : void 0,
				serverTail: [],
				distanceFromLeaf: a
			}, a++, r = r.return;
			return i === null ? "" : Ut(i).replaceAll(/^[+-]/gm, ">");
		}
		function Gt(e, t) {
			var n = z({}, e || Sm), r = { tag: t };
			return ym.indexOf(t) !== -1 && (n.aTagInScope = null, n.buttonTagInScope = null, n.nobrTagInScope = null), bm.indexOf(t) !== -1 && (n.pTagInButtonScope = null), vm.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (n.listItemTagAutoclosing = null, n.dlItemTagAutoclosing = null), n.current = r, t === "form" && (n.formTag = r), t === "a" && (n.aTagInScope = r), t === "button" && (n.buttonTagInScope = r), t === "nobr" && (n.nobrTagInScope = r), t === "p" && (n.pTagInButtonScope = r), t === "li" && (n.listItemTagAutoclosing = r), (t === "dd" || t === "dt") && (n.dlItemTagAutoclosing = r), t === "#document" || t === "html" ? n.containerTagInScope = null : n.containerTagInScope ||= r, e !== null || t !== "#document" && t !== "html" && t !== "body" ? !0 === n.implicitRootScope && (n.implicitRootScope = !1) : n.implicitRootScope = !0, n;
		}
		function Kt(e, t, n) {
			switch (t) {
				case "select": return e === "hr" || e === "option" || e === "optgroup" || e === "script" || e === "template" || e === "#text";
				case "optgroup": return e === "option" || e === "#text";
				case "option": return e === "#text";
				case "tr": return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
				case "tbody":
				case "thead":
				case "tfoot": return e === "tr" || e === "style" || e === "script" || e === "template";
				case "colgroup": return e === "col" || e === "template";
				case "table": return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
				case "head": return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
				case "html":
					if (n) break;
					return e === "head" || e === "body" || e === "frameset";
				case "frameset": return e === "frame";
				case "#document": if (!n) return e === "html";
			}
			switch (e) {
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6": return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
				case "rp":
				case "rt": return xm.indexOf(t) === -1;
				case "caption":
				case "col":
				case "colgroup":
				case "frameset":
				case "frame":
				case "tbody":
				case "td":
				case "tfoot":
				case "th":
				case "thead":
				case "tr": return t == null;
				case "head": return n || t === null;
				case "html": return n && t === "#document" || t === null;
				case "body": return n && (t === "#document" || t === "html") || t === null;
			}
			return !0;
		}
		function qt(e, t) {
			switch (e) {
				case "address":
				case "article":
				case "aside":
				case "blockquote":
				case "center":
				case "details":
				case "dialog":
				case "dir":
				case "div":
				case "dl":
				case "fieldset":
				case "figcaption":
				case "figure":
				case "footer":
				case "header":
				case "hgroup":
				case "main":
				case "menu":
				case "nav":
				case "ol":
				case "p":
				case "section":
				case "summary":
				case "ul":
				case "pre":
				case "listing":
				case "table":
				case "hr":
				case "xmp":
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6": return t.pTagInButtonScope;
				case "form": return t.formTag || t.pTagInButtonScope;
				case "li": return t.listItemTagAutoclosing;
				case "dd":
				case "dt": return t.dlItemTagAutoclosing;
				case "button": return t.buttonTagInScope;
				case "a": return t.aTagInScope;
				case "nobr": return t.nobrTagInScope;
			}
			return null;
		}
		function Jt(e, t) {
			for (; e;) {
				switch (e.tag) {
					case 5:
					case 26:
					case 27: if (e.type === t) return e;
				}
				e = e.return;
			}
			return null;
		}
		function Yt(e, t) {
			t ||= Sm;
			var n = t.current;
			if (t = (n = Kt(e, n && n.tag, t.implicitRootScope) ? null : n) ? null : qt(e, t), t = n || t, !t) return !0;
			var r = t.tag;
			if (t = String(!!n) + "|" + e + "|" + r, Cm[t]) return !1;
			Cm[t] = !0;
			var i = (t = gp) ? Jt(t.return, r) : null, a = t !== null && i !== null ? Wt(i, t, null) : "", o = "<" + e + ">";
			return n ? (n = "", r === "table" && e === "tr" && (n += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), console.error("In HTML, %s cannot be a child of <%s>.%s\nThis will cause a hydration error.%s", o, r, n, a)) : console.error("In HTML, %s cannot be a descendant of <%s>.\nThis will cause a hydration error.%s", o, r, a), t && (e = t.return, i === null || e === null || i === e && e._debugOwner === t._debugOwner || D(i, function() {
				console.error("<%s> cannot contain a nested %s.\nSee this log for the ancestor stack trace.", r, o);
			})), !1;
		}
		function Xt(e, t, n) {
			if (n || Kt("#text", t, !1)) return !0;
			if (n = "#text|" + t, Cm[n]) return !1;
			Cm[n] = !0;
			var r = (n = gp) ? Jt(n, t) : null;
			return n = n !== null && r !== null ? Wt(r, n, n.tag === 6 ? null : { children: null }) : "", /\S/.test(e) ? console.error("In HTML, text nodes cannot be a child of <%s>.\nThis will cause a hydration error.%s", t, n) : console.error("In HTML, whitespace text nodes cannot be a child of <%s>. Make sure you don't have any extra whitespace between tags on each line of your source code.\nThis will cause a hydration error.%s", t, n), !1;
		}
		function Zt(e, t) {
			if (t) {
				var n = e.firstChild;
				if (n && n === e.lastChild && n.nodeType === 3) {
					n.nodeValue = t;
					return;
				}
			}
			e.textContent = t;
		}
		function Qt(e) {
			return e.replace(km, function(e, t) {
				return t.toUpperCase();
			});
		}
		function $t(e, t, n) {
			var r = t.indexOf("--") === 0;
			r || (-1 < t.indexOf("-") ? jm.hasOwnProperty(t) && jm[t] || (jm[t] = !0, console.error("Unsupported style property %s. Did you mean %s?", t, Qt(t.replace(Om, "ms-")))) : Dm.test(t) ? jm.hasOwnProperty(t) && jm[t] || (jm[t] = !0, console.error("Unsupported vendor-prefixed style property %s. Did you mean %s?", t, t.charAt(0).toUpperCase() + t.slice(1))) : !Am.test(n) || Mm.hasOwnProperty(n) && Mm[n] || (Mm[n] = !0, console.error("Style property values shouldn't contain a semicolon. Try \"%s: %s\" instead.", t, n.replace(Am, ""))), typeof n == "number" && (isNaN(n) ? Nm || (Nm = !0, console.error("`NaN` is an invalid value for the `%s` css style property.", t)) : isFinite(n) || Pm || (Pm = !0, console.error("`Infinity` is an invalid value for the `%s` css style property.", t)))), n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Fm.has(t) ? t === "float" ? e.cssFloat = n : (Oe(n, t), e[t] = ("" + n).trim()) : e[t] = n + "px";
		}
		function en(e, t, n) {
			if (t != null && typeof t != "object") throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
			if (t && Object.freeze(t), e = e.style, n != null) {
				if (t) {
					var r = {};
					if (n) {
						for (var i in n) if (n.hasOwnProperty(i) && !t.hasOwnProperty(i)) for (var a = wm[i] || [i], o = 0; o < a.length; o++) r[a[o]] = i;
					}
					for (var s in t) if (t.hasOwnProperty(s) && (!n || n[s] !== t[s])) for (i = wm[s] || [s], a = 0; a < i.length; a++) r[i[a]] = s;
					for (var c in s = {}, t) for (i = wm[c] || [c], a = 0; a < i.length; a++) s[i[a]] = c;
					for (var l in c = {}, r) if (i = r[l], (a = s[l]) && i !== a && (o = i + "," + a, !c[o])) {
						c[o] = !0, o = console;
						var u = t[i];
						o.error.call(o, "%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", u == null || typeof u == "boolean" || u === "" ? "Removing" : "Updating", i, a);
					}
				}
				for (var d in n) !n.hasOwnProperty(d) || t != null && t.hasOwnProperty(d) || (d.indexOf("--") === 0 ? e.setProperty(d, "") : d === "float" ? e.cssFloat = "" : e[d] = "");
				for (var f in t) l = t[f], t.hasOwnProperty(f) && n[f] !== l && $t(e, f, l);
			} else for (r in t) t.hasOwnProperty(r) && $t(e, r, t[r]);
		}
		function tn(e) {
			if (e.indexOf("-") === -1) return !1;
			switch (e) {
				case "annotation-xml":
				case "color-profile":
				case "font-face":
				case "font-face-src":
				case "font-face-uri":
				case "font-face-format":
				case "font-face-name":
				case "missing-glyph": return !1;
				default: return !0;
			}
		}
		function nn(e) {
			return Rm.get(e) || e;
		}
		function rn(e, t) {
			if (vp.call(Vm, t) && Vm[t]) return !0;
			if (Um.test(t)) {
				if (e = "aria-" + t.slice(4).toLowerCase(), e = Bm.hasOwnProperty(e) ? e : null, e == null) return console.error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Vm[t] = !0;
				if (t !== e) return console.error("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, e), Vm[t] = !0;
			}
			if (Hm.test(t)) {
				if (e = t.toLowerCase(), e = Bm.hasOwnProperty(e) ? e : null, e == null) return Vm[t] = !0, !1;
				t !== e && (console.error("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, e), Vm[t] = !0);
			}
			return !0;
		}
		function an(e, t) {
			var n = [], r;
			for (r in t) rn(e, r) || n.push(r);
			t = n.map(function(e) {
				return "`" + e + "`";
			}).join(", "), n.length === 1 ? console.error("Invalid aria prop %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props", t, e) : 1 < n.length && console.error("Invalid aria props %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props", t, e);
		}
		function on(e, t, n, r) {
			if (vp.call(Gm, t) && Gm[t]) return !0;
			var i = t.toLowerCase();
			if (i === "onfocusin" || i === "onfocusout") return console.error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Gm[t] = !0;
			if (typeof n == "function" && (e === "form" && t === "action" || e === "input" && t === "formAction" || e === "button" && t === "formAction")) return !0;
			if (r != null) {
				if (e = r.possibleRegistrationNames, r.registrationNameDependencies.hasOwnProperty(t)) return !0;
				if (r = e.hasOwnProperty(i) ? e[i] : null, r != null) return console.error("Invalid event handler property `%s`. Did you mean `%s`?", t, r), Gm[t] = !0;
				if (Km.test(t)) return console.error("Unknown event handler property `%s`. It will be ignored.", t), Gm[t] = !0;
			} else if (Km.test(t)) return qm.test(t) && console.error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Gm[t] = !0;
			if (Jm.test(t) || Ym.test(t)) return !0;
			if (i === "innerhtml") return console.error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Gm[t] = !0;
			if (i === "aria") return console.error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Gm[t] = !0;
			if (i === "is" && n != null && typeof n != "string") return console.error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof n), Gm[t] = !0;
			if (typeof n == "number" && isNaN(n)) return console.error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Gm[t] = !0;
			if (zm.hasOwnProperty(i)) {
				if (i = zm[i], i !== t) return console.error("Invalid DOM property `%s`. Did you mean `%s`?", t, i), Gm[t] = !0;
			} else if (t !== i) return console.error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, i), Gm[t] = !0;
			switch (t) {
				case "dangerouslySetInnerHTML":
				case "children":
				case "style":
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "defaultValue":
				case "defaultChecked":
				case "innerHTML":
				case "ref": return !0;
				case "innerText":
				case "textContent": return !0;
			}
			switch (typeof n) {
				case "boolean": switch (t) {
					case "autoFocus":
					case "checked":
					case "multiple":
					case "muted":
					case "selected":
					case "contentEditable":
					case "spellCheck":
					case "draggable":
					case "value":
					case "autoReverse":
					case "externalResourcesRequired":
					case "focusable":
					case "preserveAlpha":
					case "allowFullScreen":
					case "async":
					case "autoPlay":
					case "controls":
					case "default":
					case "defer":
					case "disabled":
					case "disablePictureInPicture":
					case "disableRemotePlayback":
					case "formNoValidate":
					case "hidden":
					case "loop":
					case "noModule":
					case "noValidate":
					case "open":
					case "playsInline":
					case "readOnly":
					case "required":
					case "reversed":
					case "scoped":
					case "seamless":
					case "itemScope":
					case "capture":
					case "download":
					case "inert": return !0;
					default: return i = t.toLowerCase().slice(0, 5), i === "data-" || i === "aria-" || (n ? console.error("Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s=\"%s\" or %s={value.toString()}.", n, t, t, n, t) : console.error("Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s=\"%s\" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", n, t, t, n, t, t, t), Gm[t] = !0);
				}
				case "function":
				case "symbol": return Gm[t] = !0, !1;
				case "string": if (n === "false" || n === "true") {
					switch (t) {
						case "checked":
						case "selected":
						case "multiple":
						case "muted":
						case "allowFullScreen":
						case "async":
						case "autoPlay":
						case "controls":
						case "default":
						case "defer":
						case "disabled":
						case "disablePictureInPicture":
						case "disableRemotePlayback":
						case "formNoValidate":
						case "hidden":
						case "loop":
						case "noModule":
						case "noValidate":
						case "open":
						case "playsInline":
						case "readOnly":
						case "required":
						case "reversed":
						case "scoped":
						case "seamless":
						case "itemScope":
						case "inert": break;
						default: return !0;
					}
					console.error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", n, t, n === "false" ? "The browser will interpret it as a truthy value." : "Although this works, it will not work as expected if you pass the string \"false\".", t, n), Gm[t] = !0;
				}
			}
			return !0;
		}
		function sn(e, t, n) {
			var r = [], i;
			for (i in t) on(e, i, t[i], n) || r.push(i);
			t = r.map(function(e) {
				return "`" + e + "`";
			}).join(", "), r.length === 1 ? console.error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://react.dev/link/attribute-behavior ", t, e) : 1 < r.length && console.error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://react.dev/link/attribute-behavior ", t, e);
		}
		function cn(e) {
			return Xm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
		}
		function ln() {}
		function un(e) {
			return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
		}
		function dn(e) {
			var t = Qe(e);
			if (t && (e = t.stateNode)) {
				var n = e[Jp] || null;
				a: switch (e = t.stateNode, t.type) {
					case "input":
						if (vt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
							for (n = e; n.parentNode;) n = n.parentNode;
							for (O(t, "name"), n = n.querySelectorAll("input[name=\"" + gt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
								var r = n[t];
								if (r !== e && r.form === e.form) {
									var i = r[Jp] || null;
									if (!i) throw Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
									vt(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
								}
							}
							for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && mt(r);
						}
						break a;
					case "textarea":
						Et(e, n.value, n.defaultValue);
						break a;
					case "select": t = n.value, t != null && Ct(e, !!n.multiple, t, !1);
				}
			}
		}
		function fn(e, t, n) {
			if (eh) return e(t, n);
			eh = !0;
			try {
				return e(t);
			} finally {
				if (eh = !1, (Qm !== null || $m !== null) && (dl(), Qm && (t = Qm, e = $m, $m = Qm = null, dn(t), e))) for (t = 0; t < e.length; t++) dn(e[t]);
			}
		}
		function pn(e, t) {
			var n = e.stateNode;
			if (n === null) return null;
			var r = n[Jp] || null;
			if (r === null) return null;
			n = r[t];
			a: switch (t) {
				case "onClick":
				case "onClickCapture":
				case "onDoubleClick":
				case "onDoubleClickCapture":
				case "onMouseDown":
				case "onMouseDownCapture":
				case "onMouseMove":
				case "onMouseMoveCapture":
				case "onMouseUp":
				case "onMouseUpCapture":
				case "onMouseEnter":
					(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
					break a;
				default: e = !1;
			}
			if (e) return null;
			if (n && typeof n != "function") throw Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof n + "` type.");
			return n;
		}
		function mn() {
			if (oh) return oh;
			var e, t = ah, n = t.length, r, i = "value" in ih ? ih.value : ih.textContent, a = i.length;
			for (e = 0; e < n && t[e] === i[e]; e++);
			var o = n - e;
			for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
			return oh = i.slice(e, 1 < r ? 1 - r : void 0);
		}
		function hn(e) {
			var t = e.keyCode;
			return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
		}
		function gn() {
			return !0;
		}
		function _n() {
			return !1;
		}
		function vn(e) {
			function t(t, n, r, i, a) {
				for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
				return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? gn : _n, this.isPropagationStopped = _n, this;
			}
			return z(t.prototype, {
				preventDefault: function() {
					this.defaultPrevented = !0;
					var e = this.nativeEvent;
					e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = gn);
				},
				stopPropagation: function() {
					var e = this.nativeEvent;
					e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = gn);
				},
				persist: function() {},
				isPersistent: gn
			}), t;
		}
		function yn(e) {
			var t = this.nativeEvent;
			return t.getModifierState ? t.getModifierState(e) : (e = wh[e]) ? !!t[e] : !1;
		}
		function bn() {
			return yn;
		}
		function xn(e, t) {
			switch (e) {
				case "keyup": return jh.indexOf(t.keyCode) !== -1;
				case "keydown": return t.keyCode !== Mh;
				case "keypress":
				case "mousedown":
				case "focusout": return !0;
				default: return !1;
			}
		}
		function Sn(e) {
			return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
		}
		function Cn(e, t) {
			switch (e) {
				case "compositionend": return Sn(t);
				case "keypress": return t.which === Lh ? (zh = !0, Rh) : null;
				case "textInput": return e = t.data, e === Rh && zh ? null : e;
				default: return null;
			}
		}
		function wn(e, t) {
			if (Bh) return e === "compositionend" || !Nh && xn(e, t) ? (e = mn(), oh = ah = ih = null, Bh = !1, e) : null;
			switch (e) {
				case "paste": return null;
				case "keypress":
					if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
						if (t.char && 1 < t.char.length) return t.char;
						if (t.which) return String.fromCharCode(t.which);
					}
					return null;
				case "compositionend": return Ih && t.locale !== "ko" ? null : t.data;
				default: return null;
			}
		}
		function Tn(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t === "input" ? !!Vh[e.type] : t === "textarea";
		}
		function En(e) {
			if (!th) return !1;
			e = "on" + e;
			var t = e in document;
			return t ||= (t = document.createElement("div"), t.setAttribute(e, "return;"), typeof t[e] == "function"), t;
		}
		function Dn(e, t, n, r) {
			Qm ? $m ? $m.push(r) : $m = [r] : Qm = r, t = hu(t, "onChange"), 0 < t.length && (n = new ch("onChange", "change", null, n, r), e.push({
				event: n,
				listeners: t
			}));
		}
		function On(e) {
			lu(e, 0);
		}
		function kn(e) {
			if (mt($e(e))) return e;
		}
		function An(e, t) {
			if (e === "change") return t;
		}
		function jn() {
			Hh && (Hh.detachEvent("onpropertychange", Mn), Uh = Hh = null);
		}
		function Mn(e) {
			if (e.propertyName === "value" && kn(Uh)) {
				var t = [];
				Dn(t, Uh, e, un(e)), fn(On, t);
			}
		}
		function Nn(e, t, n) {
			e === "focusin" ? (jn(), Hh = t, Uh = n, Hh.attachEvent("onpropertychange", Mn)) : e === "focusout" && jn();
		}
		function Pn(e) {
			if (e === "selectionchange" || e === "keyup" || e === "keydown") return kn(Uh);
		}
		function Fn(e, t) {
			if (e === "click") return kn(t);
		}
		function In(e, t) {
			if (e === "input" || e === "change") return kn(t);
		}
		function Ln(e, t) {
			return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
		}
		function Rn(e, t) {
			if (Gh(e, t)) return !0;
			if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
			var n = Object.keys(e), r = Object.keys(t);
			if (n.length !== r.length) return !1;
			for (r = 0; r < n.length; r++) {
				var i = n[r];
				if (!vp.call(t, i) || !Gh(e[i], t[i])) return !1;
			}
			return !0;
		}
		function zn(e) {
			for (; e && e.firstChild;) e = e.firstChild;
			return e;
		}
		function Bn(e, t) {
			var n = zn(e);
			e = 0;
			for (var r; n;) {
				if (n.nodeType === 3) {
					if (r = e + n.textContent.length, e <= t && r >= t) return {
						node: n,
						offset: t - e
					};
					e = r;
				}
				a: {
					for (; n;) {
						if (n.nextSibling) {
							n = n.nextSibling;
							break a;
						}
						n = n.parentNode;
					}
					n = void 0;
				}
				n = zn(n);
			}
		}
		function Vn(e, t) {
			return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Vn(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
		}
		function Hn(e) {
			e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
			for (var t = ht(e.document); t instanceof e.HTMLIFrameElement;) {
				try {
					var n = typeof t.contentWindow.location.href == "string";
				} catch {
					n = !1;
				}
				if (n) e = t.contentWindow;
				else break;
				t = ht(e.document);
			}
			return t;
		}
		function Un(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
		}
		function Wn(e, t, n) {
			var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
			Xh || qh == null || qh !== ht(r) || (r = qh, "selectionStart" in r && Un(r) ? r = {
				start: r.selectionStart,
				end: r.selectionEnd
			} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
				anchorNode: r.anchorNode,
				anchorOffset: r.anchorOffset,
				focusNode: r.focusNode,
				focusOffset: r.focusOffset
			}), Yh && Rn(Yh, r) || (Yh = r, r = hu(Jh, "onSelect"), 0 < r.length && (t = new ch("onSelect", "select", null, t, n), e.push({
				event: t,
				listeners: r
			}), t.target = qh)));
		}
		function Gn(e, t) {
			var n = {};
			return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
		}
		function Kn(e) {
			if (Qh[e]) return Qh[e];
			if (!Zh[e]) return e;
			var t = Zh[e], n;
			for (n in t) if (t.hasOwnProperty(n) && n in $h) return Qh[e] = t[n];
			return e;
		}
		function qn(e, t) {
			sg.set(e, t), nt(t, [e]);
		}
		function Jn(e) {
			for (var t = hg, n = 0; n < e.length; n++) {
				var r = e[n];
				if (typeof r == "object" && r) {
					if (Jf(r) && r.length === 2 && typeof r[0] == "string") {
						if (t !== hg && t !== vg) return gg;
						t = vg;
					} else return gg;
				} else {
					if (typeof r == "function" || typeof r == "string" && 50 < r.length || t !== hg && t !== _g) return gg;
					t = _g;
				}
			}
			return t;
		}
		function Yn(e, t, n, r) {
			for (var i in e) vp.call(e, i) && i[0] !== "_" && Xn(i, e[i], t, n, r);
		}
		function Xn(e, t, n, r, i) {
			switch (typeof t) {
				case "object":
					if (t === null) {
						t = "null";
						break;
					}
					if (t.$$typeof === Mf) {
						var a = S(t.type) || "…", o = t.key;
						t = t.props;
						var s = Object.keys(t), c = s.length;
						if (o == null && c === 0) {
							t = "<" + a + " />";
							break;
						}
						if (3 > r || c === 1 && s[0] === "children" && o == null) {
							t = "<" + a + " … />";
							break;
						}
						for (var l in n.push([i + "\xA0\xA0".repeat(r) + e, "<" + a]), o !== null && Xn("key", o, n, r + 1, i), e = !1, t) l === "children" ? t.children != null && (!Jf(t.children) || 0 < t.children.length) && (e = !0) : vp.call(t, l) && l[0] !== "_" && Xn(l, t[l], n, r + 1, i);
						n.push(["", e ? ">…</" + a + ">" : "/>"]);
						return;
					}
					if (a = Object.prototype.toString.call(t), a = a.slice(8, a.length - 1), a === "Array") {
						if (l = Jn(t), l === _g || l === hg) {
							t = JSON.stringify(t);
							break;
						}
						if (l === vg) {
							for (n.push([i + "\xA0\xA0".repeat(r) + e, ""]), e = 0; e < t.length; e++) a = t[e], Xn(a[0], a[1], n, r + 1, i);
							return;
						}
					}
					if (a === "Promise") {
						if (t.status === "fulfilled") {
							if (a = n.length, Xn(e, t.value, n, r, i), n.length > a) {
								n = n[a], n[1] = "Promise<" + (n[1] || "Object") + ">";
								return;
							}
						} else if (t.status === "rejected" && (a = n.length, Xn(e, t.reason, n, r, i), n.length > a)) {
							n = n[a], n[1] = "Rejected Promise<" + n[1] + ">";
							return;
						}
						n.push(["\xA0\xA0".repeat(r) + e, "Promise"]);
						return;
					}
					a === "Object" && (l = Object.getPrototypeOf(t)) && typeof l.constructor == "function" && (a = l.constructor.name), n.push([i + "\xA0\xA0".repeat(r) + e, a === "Object" ? 3 > r ? "" : "…" : a]), 3 > r && Yn(t, n, r + 1, i);
					return;
				case "function":
					t = t.name === "" ? "() => {}" : t.name + "() {}";
					break;
				case "string":
					t = t === mg ? "…" : JSON.stringify(t);
					break;
				case "undefined":
					t = "undefined";
					break;
				case "boolean":
					t = t ? "true" : "false";
					break;
				default: t = String(t);
			}
			n.push([i + "\xA0\xA0".repeat(r) + e, t]);
		}
		function Zn(e, t, n, r) {
			var i = !0;
			for (o in e) o in t || (n.push([yg + "\xA0\xA0".repeat(r) + o, "…"]), i = !1);
			for (var a in t) if (a in e) {
				var o = e[a], s = t[a];
				if (o !== s) {
					if (r === 0 && a === "children") i = "\xA0\xA0".repeat(r) + a, n.push([yg + i, "…"], [bg + i, "…"]);
					else {
						if (!(3 <= r)) {
							if (typeof o == "object" && typeof s == "object" && o !== null && s !== null && o.$$typeof === s.$$typeof) {
								if (s.$$typeof === Mf) {
									if (o.type === s.type && o.key === s.key) {
										o = S(s.type) || "…", i = "\xA0\xA0".repeat(r) + a, o = "<" + o + " … />", n.push([yg + i, o], [bg + i, o]), i = !1;
										continue;
									}
								} else {
									var c = Object.prototype.toString.call(o), l = Object.prototype.toString.call(s);
									if (c === l && (l === "[object Object]" || l === "[object Array]")) {
										c = [xg + "\xA0\xA0".repeat(r) + a, l === "[object Array]" ? "Array" : ""], n.push(c), l = n.length, Zn(o, s, n, r + 1) ? l === n.length && (c[1] = "Referentially unequal but deeply equal objects. Consider memoization.") : i = !1;
										continue;
									}
								}
							} else if (typeof o == "function" && typeof s == "function" && o.name === s.name && o.length === s.length && (c = Function.prototype.toString.call(o), l = Function.prototype.toString.call(s), c === l)) {
								o = s.name === "" ? "() => {}" : s.name + "() {}", n.push([xg + "\xA0\xA0".repeat(r) + a, o + " Referentially unequal function closure. Consider memoization."]);
								continue;
							}
						}
						Xn(a, o, n, r, yg), Xn(a, s, n, r, bg);
					}
					i = !1;
				}
			} else n.push([bg + "\xA0\xA0".repeat(r) + a, "…"]), i = !1;
			return i;
		}
		function Qn(e) {
			H = e & 63 ? "Blocking" : e & 64 ? "Gesture" : e & 4194176 ? "Transition" : e & 62914560 ? "Suspense" : e & 2080374784 ? "Idle" : "Other";
		}
		function $n(e, t, n, r) {
			Sg && (Eg.start = t, Eg.end = n, Tg.color = "warning", Tg.tooltipText = r, Tg.properties = null, (e = e._debugTask) ? e.run(performance.measure.bind(performance, r, Eg)) : performance.measure(r, Eg));
		}
		function er(e, t, n) {
			$n(e, t, n, "Reconnect");
		}
		function tr(e, t, n, r, i) {
			var a = C(e);
			if (a !== null && Sg) {
				var o = e.alternate, s = e.actualDuration;
				if (o === null || o.child !== e.child) for (var c = e.child; c !== null; c = c.sibling) s -= c.actualDuration;
				r = .5 > s ? r ? "tertiary-light" : "primary-light" : 10 > s ? r ? "tertiary" : "primary" : 100 > s ? r ? "tertiary-dark" : "primary-dark" : "error";
				var l = e.memoizedProps;
				s = e._debugTask, l !== null && o !== null && o.memoizedProps !== l ? (c = [Dg], l = Zn(o.memoizedProps, l, c, 0), 1 < c.length && (l && !wg && (o.lanes & i) === 0 && 100 < e.actualDuration ? (wg = !0, c[0] = kg, Tg.color = "warning", Tg.tooltipText = Og) : (Tg.color = r, Tg.tooltipText = a), Tg.properties = c, Eg.start = t, Eg.end = n, s == null ? performance.measure("​" + a, Eg) : s.run(performance.measure.bind(performance, "​" + a, Eg)))) : s == null ? console.timeStamp(a, t, n, Cg, void 0, r) : s.run(console.timeStamp.bind(console, a, t, n, Cg, void 0, r));
			}
		}
		function nr(e, t, n, r) {
			if (Sg) {
				var i = C(e);
				if (i !== null) {
					for (var a = null, o = [], s = 0; s < r.length; s++) {
						var c = r[s];
						a == null && c.source !== null && (a = c.source._debugTask), c = c.value, o.push(["Error", typeof c == "object" && c && typeof c.message == "string" ? String(c.message) : String(c)]);
					}
					e.key !== null && Xn("key", e.key, o, 0, ""), e.memoizedProps !== null && Yn(e.memoizedProps, o, 0, ""), a ??= e._debugTask, e = {
						start: t,
						end: n,
						detail: { devtools: {
							color: "error",
							track: Cg,
							tooltipText: e.tag === 13 ? "Hydration failed" : "Error boundary caught an error",
							properties: o
						} }
					}, a ? a.run(performance.measure.bind(performance, "​" + i, e)) : performance.measure("​" + i, e);
				}
			}
		}
		function rr(e, t, n, r, i) {
			if (i !== null) {
				if (Sg) {
					var a = C(e);
					if (a !== null) {
						r = [];
						for (var o = 0; o < i.length; o++) {
							var s = i[o].value;
							r.push(["Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
						}
						e.key !== null && Xn("key", e.key, r, 0, ""), e.memoizedProps !== null && Yn(e.memoizedProps, r, 0, ""), t = {
							start: t,
							end: n,
							detail: { devtools: {
								color: "error",
								track: Cg,
								tooltipText: "A lifecycle or effect errored",
								properties: r
							} }
						}, (e = e._debugTask) ? e.run(performance.measure.bind(performance, "​" + a, t)) : performance.measure("​" + a, t);
					}
				}
			} else a = C(e), a !== null && Sg && (i = 1 > r ? "secondary-light" : 100 > r ? "secondary" : 500 > r ? "secondary-dark" : "error", (e = e._debugTask) ? e.run(console.timeStamp.bind(console, a, t, n, Cg, void 0, i)) : console.timeStamp(a, t, n, Cg, void 0, i));
		}
		function ir(e, t, n, r) {
			if (Sg && !(t <= e)) {
				var i = (n & 738197653) === n ? "tertiary-dark" : "primary-dark";
				n = (n & 536870912) === n ? "Prepared" : (n & 201326741) === n ? "Hydrated" : "Render", r ? r.run(console.timeStamp.bind(console, n, e, t, H, V, i)) : console.timeStamp(n, e, t, H, V, i);
			}
		}
		function ar(e, t, n, r) {
			!Sg || t <= e || (n = (n & 738197653) === n ? "tertiary-dark" : "primary-dark", r ? r.run(console.timeStamp.bind(console, "Prewarm", e, t, H, V, n)) : console.timeStamp("Prewarm", e, t, H, V, n));
		}
		function or(e, t, n, r) {
			!Sg || t <= e || (n = (n & 738197653) === n ? "tertiary-dark" : "primary-dark", r ? r.run(console.timeStamp.bind(console, "Suspended", e, t, H, V, n)) : console.timeStamp("Suspended", e, t, H, V, n));
		}
		function sr(e, t, n, r, i, a) {
			if (Sg && !(t <= e)) {
				n = [];
				for (var o = 0; o < r.length; o++) {
					var s = r[o].value;
					n.push(["Recoverable Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
				}
				e = {
					start: e,
					end: t,
					detail: { devtools: {
						color: "primary-dark",
						track: H,
						trackGroup: V,
						tooltipText: i ? "Hydration Failed" : "Recovered after Error",
						properties: n
					} }
				}, a ? a.run(performance.measure.bind(performance, "Recovered", e)) : performance.measure("Recovered", e);
			}
		}
		function cr(e, t, n, r) {
			!Sg || t <= e || (r ? r.run(console.timeStamp.bind(console, "Errored", e, t, H, V, "error")) : console.timeStamp("Errored", e, t, H, V, "error"));
		}
		function lr(e, t, n, r) {
			!Sg || t <= e || (r ? r.run(console.timeStamp.bind(console, n, e, t, H, V, "secondary-light")) : console.timeStamp(n, e, t, H, V, "secondary-light"));
		}
		function ur(e, t, n, r, i) {
			if (Sg && !(t <= e)) {
				for (var a = [], o = 0; o < n.length; o++) {
					var s = n[o].value;
					a.push(["Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
				}
				e = {
					start: e,
					end: t,
					detail: { devtools: {
						color: "error",
						track: H,
						trackGroup: V,
						tooltipText: r ? "Remaining Effects Errored" : "Commit Errored",
						properties: a
					} }
				}, i ? i.run(performance.measure.bind(performance, "Errored", e)) : performance.measure("Errored", e);
			}
		}
		function dr(e, t, n) {
			!Sg || t <= e || (n ? n.run(console.timeStamp.bind(console, "Animating", e, t, H, V, "secondary-dark")) : console.timeStamp("Animating", e, t, H, V, "secondary-dark"));
		}
		function fr() {
			for (var e = Ng, t = Pg = Ng = 0; t < e;) {
				var n = Mg[t];
				Mg[t++] = null;
				var r = Mg[t];
				Mg[t++] = null;
				var i = Mg[t];
				Mg[t++] = null;
				var a = Mg[t];
				if (Mg[t++] = null, r !== null && i !== null) {
					var o = r.pending;
					o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
				}
				a !== 0 && gr(n, i, a);
			}
		}
		function pr(e, t, n, r) {
			Mg[Ng++] = e, Mg[Ng++] = t, Mg[Ng++] = n, Mg[Ng++] = r, Pg |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
		}
		function mr(e, t, n, r) {
			return pr(e, t, n, r), _r(e);
		}
		function hr(e, t) {
			return pr(e, null, null, t), _r(e);
		}
		function gr(e, t, n) {
			e.lanes |= n;
			var r = e.alternate;
			r !== null && (r.lanes |= n);
			for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & Ag || (i = !0)), e = a, a = a.return;
			return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ip(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
		}
		function _r(e) {
			if (qx > Kx) throw Qx = qx = 0, $x = Jx = null, Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
			Qx > Zx && (Qx = 0, $x = null, console.error("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.")), e.alternate === null && e.flags & 4098 && Jl(e);
			for (var t = e, n = t.return; n !== null;) t.alternate === null && t.flags & 4098 && Jl(e), t = n, n = t.return;
			return t.tag === 3 ? t.stateNode : null;
		}
		function vr(e) {
			if (Ig === null) return e;
			var t = Ig(e);
			return t === void 0 ? e : t.current;
		}
		function yr(e) {
			if (Ig === null) return e;
			var t = Ig(e);
			return t === void 0 ? e != null && typeof e.render == "function" && (t = vr(e.render), e.render !== t) ? (t = {
				$$typeof: zf,
				render: t
			}, e.displayName !== void 0 && (t.displayName = e.displayName), t) : e : t.current;
		}
		function br(e, t) {
			if (Ig === null) return !1;
			var n = e.elementType;
			t = t.type;
			var r = !1, i = typeof t == "object" && t ? t.$$typeof : null;
			switch (e.tag) {
				case 1:
					typeof t == "function" && (r = !0);
					break;
				case 0:
					(typeof t == "function" || i === Uf) && (r = !0);
					break;
				case 11:
					(i === zf || i === Uf) && (r = !0);
					break;
				case 14:
				case 15:
					(i === Hf || i === Uf) && (r = !0);
					break;
				default: return !1;
			}
			return !!(r && (e = Ig(n), e !== void 0 && e === Ig(t)));
		}
		function xr(e) {
			Ig !== null && typeof WeakSet == "function" && (Lg === null && (Lg = /* @__PURE__ */ new WeakSet()), Lg.add(e));
		}
		function Sr(e, t, n) {
			do {
				var r = e, i = r.alternate, a = r.child, o = r.sibling, s = r.tag;
				r = r.type;
				var c = null;
				switch (s) {
					case 0:
					case 15:
					case 1:
						c = r;
						break;
					case 11: c = r.render;
				}
				if (Ig === null) throw Error("Expected resolveFamily to be set during hot reload.");
				var l = !1;
				if (r = !1, c !== null && (c = Ig(c), c !== void 0 && (n.has(c) ? r = !0 : t.has(c) && (s === 1 ? r = !0 : l = !0))), Lg !== null && (Lg.has(e) || i !== null && Lg.has(i)) && (r = !0), r && (e._debugNeedsRemount = !0), (r || l) && (i = hr(e, 2), i !== null && ol(i, e, 2)), a === null || r || Sr(a, t, n), o === null) break;
				e = o;
			} while (1);
		}
		function Cr(e, t, n, r) {
			this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null, this.actualDuration = -0, this.actualStartTime = -1.1, this.treeBaseDuration = this.selfBaseDuration = -0, this._debugTask = this._debugStack = this._debugOwner = this._debugInfo = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, Hg || typeof Object.preventExtensions != "function" || Object.preventExtensions(this);
		}
		function wr(e) {
			return e = e.prototype, !(!e || !e.isReactComponent);
		}
		function Tr(e, t) {
			var n = e.alternate;
			switch (n === null ? (n = g(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n._debugOwner = e._debugOwner, n._debugStack = e._debugStack, n._debugTask = e._debugTask, n._debugHookTypes = e._debugHookTypes, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null, n.actualDuration = -0, n.actualStartTime = -1.1), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
				lanes: t.lanes,
				firstContext: t.firstContext,
				_debugThenableState: t._debugThenableState
			}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n.selfBaseDuration = e.selfBaseDuration, n.treeBaseDuration = e.treeBaseDuration, n._debugInfo = e._debugInfo, n._debugNeedsRemount = e._debugNeedsRemount, n.tag) {
				case 0:
				case 15:
					n.type = vr(e.type);
					break;
				case 1:
					n.type = vr(e.type);
					break;
				case 11: n.type = yr(e.type);
			}
			return n;
		}
		function Er(e, t) {
			e.flags &= 65011714;
			var n = e.alternate;
			return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
				lanes: t.lanes,
				firstContext: t.firstContext,
				_debugThenableState: t._debugThenableState
			}, e.selfBaseDuration = n.selfBaseDuration, e.treeBaseDuration = n.treeBaseDuration), e;
		}
		function Dr(e, t, n, r, i, a) {
			var o = 0, s = e;
			if (typeof e == "function") wr(e) && (o = 1), s = vr(s);
			else if (typeof e == "string") o = E(), o = Gd(e, n, o) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
			else a: switch (e) {
				case Wf: return t = g(31, n, t, i), t.elementType = Wf, t.lanes = a, t;
				case Pf: return kr(n.children, i, a, t);
				case Ff:
					o = 8, i |= zg, i |= Bg;
					break;
				case If: return e = n, r = i, typeof e.id != "string" && console.error("Profiler must specify an \"id\" of type `string` as a prop. Received the type `%s` instead.", typeof e.id), t = g(12, e, t, r | W), t.elementType = If, t.lanes = a, t.stateNode = {
					effectDuration: 0,
					passiveEffectDuration: 0
				}, t;
				case Bf: return t = g(13, n, t, i), t.elementType = Bf, t.lanes = a, t;
				case Vf: return t = g(19, n, t, i), t.elementType = Vf, t.lanes = a, t;
				default:
					if (typeof e == "object" && e) switch (e.$$typeof) {
						case Rf:
							o = 10;
							break a;
						case Lf:
							o = 9;
							break a;
						case zf:
							o = 11, s = yr(s);
							break a;
						case Hf:
							o = 14;
							break a;
						case Uf:
							o = 16, s = null;
							break a;
					}
					s = "", (e === void 0 || typeof e == "object" && e && Object.keys(e).length === 0) && (s += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? n = "null" : Jf(e) ? n = "array" : e !== void 0 && e.$$typeof === Mf ? (n = "<" + (S(e.type) || "Unknown") + " />", s = " Did you accidentally export a JSX literal instead of a component?") : n = typeof e, (o = r ? oe(r) : null) && (s += "\n\nCheck the render method of `" + o + "`."), o = 29, n = Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (n + "." + s)), s = null;
			}
			return t = g(o, n, t, i), t.elementType = e, t.type = s, t.lanes = a, t._debugOwner = r, t;
		}
		function Or(e, t, n) {
			return t = Dr(e.type, e.key, e.props, e._owner, t, n), t._debugOwner = e._owner, t._debugStack = e._debugStack, t._debugTask = e._debugTask, t;
		}
		function kr(e, t, n, r) {
			return e = g(7, e, r, t), e.lanes = n, e;
		}
		function Ar(e, t, n) {
			return e = g(6, e, null, t), e.lanes = n, e;
		}
		function jr(e) {
			var t = g(18, null, null, U);
			return t.stateNode = e, t;
		}
		function Mr(e, t, n) {
			return t = g(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
				containerInfo: e.containerInfo,
				pendingChildren: null,
				implementation: e.implementation
			}, t;
		}
		function Nr(e, t) {
			if (typeof e == "object" && e) {
				var n = Ug.get(e);
				return n === void 0 ? (t = {
					value: e,
					source: t,
					stack: be(t)
				}, Ug.set(e, t), t) : n;
			}
			return {
				value: e,
				source: t,
				stack: be(t)
			};
		}
		function Pr(e, t) {
			Br(), Wg[Gg++] = qg, Wg[Gg++] = Kg, Kg = e, qg = t;
		}
		function Fr(e, t, n) {
			Br(), Jg[Yg++] = Zg, Jg[Yg++] = Qg, Jg[Yg++] = Xg, Xg = e;
			var r = Zg;
			e = Qg;
			var i = 32 - Ip(r) - 1;
			r &= ~(1 << i), n += 1;
			var a = 32 - Ip(t) + i;
			if (30 < a) {
				var o = i - i % 5;
				a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Zg = 1 << 32 - Ip(t) + i | n << i | r, Qg = a + e;
			} else Zg = 1 << a | n << i | r, Qg = e;
		}
		function Ir(e) {
			Br(), e.return !== null && (Pr(e, 1), Fr(e, 1, 0));
		}
		function Lr(e) {
			for (; e === Kg;) Kg = Wg[--Gg], Wg[Gg] = null, qg = Wg[--Gg], Wg[Gg] = null;
			for (; e === Xg;) Xg = Jg[--Yg], Jg[Yg] = null, Qg = Jg[--Yg], Jg[Yg] = null, Zg = Jg[--Yg], Jg[Yg] = null;
		}
		function Rr() {
			return Br(), Xg === null ? null : {
				id: Zg,
				overflow: Qg
			};
		}
		function zr(e, t) {
			Br(), Jg[Yg++] = Zg, Jg[Yg++] = Qg, Jg[Yg++] = Xg, Zg = t.id, Qg = t.overflow, Xg = e;
		}
		function Br() {
			G || console.error("Expected to be hydrating. This is a bug in React. Please file an issue.");
		}
		function Vr(e, t) {
			if (e.return === null) {
				if (n_ === null) n_ = {
					fiber: e,
					children: [],
					serverProps: void 0,
					serverTail: [],
					distanceFromLeaf: t
				};
				else {
					if (n_.fiber !== e) throw Error("Saw multiple hydration diff roots in a pass. This is a bug in React.");
					n_.distanceFromLeaf > t && (n_.distanceFromLeaf = t);
				}
				return n_;
			}
			var n = Vr(e.return, t + 1).children;
			return 0 < n.length && n[n.length - 1].fiber === e ? (n = n[n.length - 1], n.distanceFromLeaf > t && (n.distanceFromLeaf = t), n) : (t = {
				fiber: e,
				children: [],
				serverProps: void 0,
				serverTail: [],
				distanceFromLeaf: t
			}, n.push(t), t);
		}
		function Hr() {
			G && console.error("We should not be hydrating here. This is a bug in React. Please file a bug.");
		}
		function Ur(e, t) {
			t_ || (e = Vr(e, 0), e.serverProps = null, t !== null && (t = bd(t), e.serverTail.push(t)));
		}
		function Wr(e) {
			var t = 1 < arguments.length && arguments[1] !== void 0 && arguments[1], n = "", r = n_;
			throw r !== null && (n_ = null, n = Ut(r)), Xr(Nr(Error("Hydration failed because the server rendered " + (t ? "text" : "HTML") + " didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\nhttps://react.dev/link/hydration-mismatch" + n), e)), a_;
		}
		function Gr(e) {
			var t = e.stateNode, n = e.type, r = e.memoizedProps;
			switch (t[qp] = e, t[Jp] = r, vu(n, r), n) {
				case "dialog":
					L("cancel", t), L("close", t);
					break;
				case "iframe":
				case "object":
				case "embed":
					L("load", t);
					break;
				case "video":
				case "audio":
					for (n = 0; n < pS.length; n++) L(pS[n], t);
					break;
				case "source":
					L("error", t);
					break;
				case "img":
				case "image":
				case "link":
					L("error", t), L("load", t);
					break;
				case "details":
					L("toggle", t);
					break;
				case "input":
					it("input", r), L("invalid", t), _t(t, r), yt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
					break;
				case "option":
					xt(t, r);
					break;
				case "select":
					it("select", r), L("invalid", t), wt(t, r);
					break;
				case "textarea": it("textarea", r), L("invalid", t), Tt(t, r), Dt(t, r.value, r.defaultValue, r.children);
			}
			n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || wu(t.textContent, n) ? (r.popover != null && (L("beforetoggle", t), L("toggle", t)), r.onScroll != null && L("scroll", t), r.onScrollEnd != null && L("scrollend", t), r.onClick != null && (t.onclick = ln), t = !0) : t = !1, t || Wr(e, !0);
		}
		function Kr(e) {
			for ($g = e.return; $g;) switch ($g.tag) {
				case 5:
				case 31:
				case 13:
					i_ = !1;
					return;
				case 27:
				case 3:
					i_ = !0;
					return;
				default: $g = $g.return;
			}
		}
		function qr(e) {
			if (e !== $g) return !1;
			if (!G) return Kr(e), G = !0, !1;
			var t = e.tag, n;
			if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Wu(e.type, e.memoizedProps)), n = !n), n && e_) {
				for (n = e_; n;) {
					var r = Vr(e, 0), i = bd(n);
					r.serverTail.push(i), n = i.type === "Suspense" ? Sd(n) : yd(n.nextSibling);
				}
				Wr(e);
			}
			if (Kr(e), t === 13) {
				if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
				e_ = Sd(e);
			} else if (t === 31) {
				if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
				e_ = Sd(e);
			} else t === 27 ? (t = e_, td(e.type) ? (e = rC, rC = null, e_ = e) : e_ = t) : e_ = $g ? yd(e.stateNode.nextSibling) : null;
			return !0;
		}
		function Jr() {
			e_ = $g = null, t_ = G = !1;
		}
		function Yr() {
			var e = r_;
			return e !== null && (hx === null ? hx = e : hx.push.apply(hx, e), r_ = null), e;
		}
		function Xr(e) {
			r_ === null ? r_ = [e] : r_.push(e);
		}
		function Zr() {
			var e = n_;
			if (e !== null) {
				n_ = null;
				for (var t = Ut(e); 0 < e.children.length;) e = e.children[0];
				D(e.fiber, function() {
					console.error("A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\n%s%s", "https://react.dev/link/hydration-mismatch", t);
				});
			}
		}
		function Qr() {
			u_ = l_ = null, d_ = !1;
		}
		function $r(e, t, n) {
			w(o_, t._currentValue, e), t._currentValue = n, w(s_, t._currentRenderer, e), t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== c_ && console.error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = c_;
		}
		function ei(e, t) {
			e._currentValue = o_.current;
			var n = s_.current;
			ce(s_, t), e._currentRenderer = n, ce(o_, t);
		}
		function ti(e, t, n) {
			for (; e !== null;) {
				var r = e.alternate;
				if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
				e = e.return;
			}
			e !== n && console.error("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
		}
		function ni(e, t, n, r) {
			var i = e.child;
			for (i !== null && (i.return = e); i !== null;) {
				var a = i.dependencies;
				if (a !== null) {
					var o = i.child;
					a = a.firstContext;
					a: for (; a !== null;) {
						var s = a;
						a = i;
						for (var c = 0; c < t.length; c++) if (s.context === t[c]) {
							a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), ti(a.return, n, e), r || (o = null);
							break a;
						}
						a = s.next;
					}
				} else if (i.tag === 18) {
					if (o = i.return, o === null) throw Error("We just came from a parent so we must have had a parent. This is a bug in React.");
					o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), ti(o, n, e), o = null;
				} else o = i.child;
				if (o !== null) o.return = i;
				else for (o = i; o !== null;) {
					if (o === e) {
						o = null;
						break;
					}
					if (i = o.sibling, i !== null) {
						i.return = o.return, o = i;
						break;
					}
					o = o.return;
				}
				i = o;
			}
		}
		function ri(e, t, n, r) {
			e = null;
			for (var i = t, a = !1; i !== null;) {
				if (!a) {
					if (i.flags & 524288) a = !0;
					else if (i.flags & 262144) break;
				}
				if (i.tag === 10) {
					var o = i.alternate;
					if (o === null) throw Error("Should have a current fiber. This is a bug in React.");
					if (o = o.memoizedProps, o !== null) {
						var s = i.type;
						Gh(i.pendingProps.value, o.value) || (e === null ? e = [s] : e.push(s));
					}
				} else if (i === rp.current) {
					if (o = i.alternate, o === null) throw Error("Should have a current fiber. This is a bug in React.");
					o.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [xC] : e.push(xC));
				}
				i = i.return;
			}
			e !== null && ni(t, e, n, r), t.flags |= 262144;
		}
		function ii(e) {
			for (e = e.firstContext; e !== null;) {
				if (!Gh(e.context._currentValue, e.memoizedValue)) return !0;
				e = e.next;
			}
			return !1;
		}
		function ai(e) {
			l_ = e, u_ = null, e = e.dependencies, e !== null && (e.firstContext = null);
		}
		function oi(e) {
			return d_ && console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."), ci(l_, e);
		}
		function si(e, t) {
			return l_ === null && ai(e), ci(e, t);
		}
		function ci(e, t) {
			var n = t._currentValue;
			if (t = {
				context: t,
				memoizedValue: n,
				next: null
			}, u_ === null) {
				if (e === null) throw Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
				u_ = t, e.dependencies = {
					lanes: 0,
					firstContext: t,
					_debugThenableState: null
				}, e.flags |= 524288;
			} else u_ = u_.next = t;
			return n;
		}
		function li() {
			return {
				controller: new f_(),
				data: /* @__PURE__ */ new Map(),
				refCount: 0
			};
		}
		function ui(e) {
			e.controller.signal.aborted && console.warn("A cache instance was retained after it was already freed. This likely indicates a bug in React."), e.refCount++;
		}
		function di(e) {
			e.refCount--, 0 > e.refCount && console.warn("A cache instance was released after it was already freed. This likely indicates a bug in React."), e.refCount === 0 && p_(m_, function() {
				e.controller.abort();
			});
		}
		function fi(e, t, n) {
			e & 127 ? 0 > A_ && (A_ = g_(), j_ = __(t), N_ = t, n != null && (P_ = C(n)), (Wb & (Fb | Ib)) !== Pb && (O_ = !0, M_ = v_), e = qu(), t = Ku(), e !== L_ || t !== I_ ? L_ = -1.1 : t !== null && (M_ = v_), F_ = e, I_ = t) : e & 4194048 && 0 > V_ && (V_ = g_(), U_ = __(t), W_ = t, n != null && (G_ = C(n)), 0 > B_) && (e = qu(), t = Ku(), (e !== J_ || t !== q_) && (J_ = -1.1), K_ = e, q_ = t);
		}
		function pi(e) {
			if (0 > A_) {
				A_ = g_(), j_ = e._debugTask == null ? null : e._debugTask, (Wb & (Fb | Ib)) !== Pb && (M_ = v_);
				var t = qu(), n = Ku();
				t !== L_ || n !== I_ ? L_ = -1.1 : n !== null && (M_ = v_), F_ = t, I_ = n;
			}
			0 > V_ && (V_ = g_(), U_ = e._debugTask == null ? null : e._debugTask, 0 > B_) && (e = qu(), t = Ku(), (e !== J_ || t !== q_) && (J_ = -1.1), K_ = e, q_ = t);
		}
		function mi() {
			var e = T_;
			return T_ = 0, e;
		}
		function hi(e) {
			var t = T_;
			return T_ = e, t;
		}
		function gi(e) {
			var t = T_;
			return T_ += e, t;
		}
		function _i() {
			q = K = -1.1;
		}
		function vi() {
			var e = K;
			return K = -1.1, e;
		}
		function yi(e) {
			0 <= e && (K = e);
		}
		function bi() {
			var e = E_;
			return E_ = -0, e;
		}
		function xi(e) {
			0 <= e && (E_ = e);
		}
		function Si() {
			var e = D_;
			return D_ = null, e;
		}
		function Ci() {
			var e = O_;
			return O_ = !1, e;
		}
		function wi(e) {
			w_ = g_(), 0 > e.actualStartTime && (e.actualStartTime = w_);
		}
		function Ti(e) {
			if (0 <= w_) {
				var t = g_() - w_;
				e.actualDuration += t, e.selfBaseDuration = t, w_ = -1;
			}
		}
		function Ei(e) {
			if (0 <= w_) {
				var t = g_() - w_;
				e.actualDuration += t, w_ = -1;
			}
		}
		function Di() {
			if (0 <= w_) {
				var e = g_(), t = e - w_;
				w_ = -1, T_ += t, E_ += t, q = e;
			}
		}
		function Oi(e) {
			D_ === null && (D_ = []), D_.push(e), C_ === null && (C_ = []), C_.push(e);
		}
		function ki() {
			w_ = g_(), 0 > K && (K = w_);
		}
		function Ai(e) {
			for (var t = e.child; t;) e.actualDuration += t.actualDuration, t = t.sibling;
		}
		function ji(e, t) {
			if (iv === null) {
				var n = iv = [];
				av = 0, ov = iu(), sv = {
					status: "pending",
					value: void 0,
					then: function(e) {
						n.push(e);
					}
				};
			}
			return av++, t.then(Mi, Mi), t;
		}
		function Mi() {
			if (--av === 0 && (-1 < V_ || (B_ = -1.1), iv !== null)) {
				sv !== null && (sv.status = "fulfilled");
				var e = iv;
				iv = null, ov = 0, sv = null;
				for (var t = 0; t < e.length; t++) (0, e[t])();
			}
		}
		function Ni(e, t) {
			var n = [], r = {
				status: "pending",
				value: null,
				reason: null,
				then: function(e) {
					n.push(e);
				}
			};
			return e.then(function() {
				r.status = "fulfilled", r.value = t;
				for (var e = 0; e < n.length; e++) (0, n[e])(t);
			}, function(e) {
				for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
			}), r;
		}
		function Pi() {
			var e = lv.current;
			return e === null ? Gb.pooledCache : e;
		}
		function Fi(e, t) {
			t === null ? w(lv, lv.current, e) : w(lv, t.pool, e);
		}
		function Ii() {
			var e = Pi();
			return e === null ? null : {
				parent: h_._currentValue,
				pool: e
			};
		}
		function Li() {
			return {
				didWarnAboutUncachedPromise: !1,
				thenables: []
			};
		}
		function Ri(e) {
			return e = e.status, e === "fulfilled" || e === "rejected";
		}
		function zi(e, t, n) {
			B.actQueue !== null && (B.didUsePromise = !0);
			var r = e.thenables;
			if (n = r[n], n === void 0 ? r.push(t) : n !== t && (e.didWarnAboutUncachedPromise || (e.didWarnAboutUncachedPromise = !0, console.error("A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.")), t.then(ln, ln), t = n), t._debugInfo === void 0) {
				e = performance.now(), r = t.displayName;
				var i = {
					name: typeof r == "string" ? r : "Promise",
					start: e,
					end: e,
					value: t
				};
				t._debugInfo = [{ awaited: i }], t.status !== "fulfilled" && t.status !== "rejected" && (e = function() {
					i.end = performance.now();
				}, t.then(e, e));
			}
			switch (t.status) {
				case "fulfilled": return t.value;
				case "rejected": throw e = t.reason, Hi(e), e;
				default:
					if (typeof t.status == "string") t.then(ln, ln);
					else {
						if (e = Gb, e !== null && 100 < e.shellSuspendCounter) throw Error("An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
						e = t, e.status = "pending", e.then(function(e) {
							if (t.status === "pending") {
								var n = t;
								n.status = "fulfilled", n.value = e;
							}
						}, function(e) {
							if (t.status === "pending") {
								var n = t;
								n.status = "rejected", n.reason = e;
							}
						});
					}
					switch (t.status) {
						case "fulfilled": return t.value;
						case "rejected": throw e = t.reason, Hi(e), e;
					}
					throw Hv = t, Uv = !0, Rv;
			}
		}
		function Bi(e) {
			try {
				return Lv(e);
			} catch (e) {
				throw typeof e == "object" && e && typeof e.then == "function" ? (Hv = e, Uv = !0, Rv) : e;
			}
		}
		function Vi() {
			if (Hv === null) throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
			var e = Hv;
			return Hv = null, Uv = !1, e;
		}
		function Hi(e) {
			if (e === Rv || e === Bv) throw Error("Hooks are not supported inside an async component. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
		}
		function Ui(e) {
			var t = J;
			return e != null && (J = t === null ? e : t.concat(e)), t;
		}
		function Wi() {
			var e = J;
			if (e != null) {
				for (var t = e.length - 1; 0 <= t; t--) if (e[t].name != null) {
					var n = e[t].debugTask;
					if (n != null) return n;
				}
			}
			return null;
		}
		function k(e, t, n) {
			for (var r = Object.keys(e.props), i = 0; i < r.length; i++) {
				var a = r[i];
				if (a !== "children" && a !== "key") {
					t === null && (t = Or(e, n.mode, 0), t._debugInfo = J, t.return = n), D(t, function(e) {
						console.error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", e);
					}, a);
					break;
				}
			}
		}
		function Gi(e) {
			var t = Gv;
			return Gv += 1, Wv === null && (Wv = Li()), zi(Wv, e, t);
		}
		function Ki(e, t) {
			t = t.props.ref, e.ref = t === void 0 ? null : t;
		}
		function qi(e, t) {
			throw t.$$typeof === jf ? Error("A React Element from an older version of React was rendered. This is not supported. It can happen if:\n- Multiple copies of the \"react\" package is used.\n- A library pre-bundled an old copy of \"react\" or \"react/jsx-runtime\".\n- A compiler tries to \"inline\" JSX instead of using the runtime.") : (e = Object.prototype.toString.call(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead."));
		}
		function Ji(e, t) {
			var n = Wi();
			n === null ? qi(e, t) : n.run(qi.bind(null, e, t));
		}
		function Yi(e, t) {
			var n = C(e) || "Component";
			Yv[n] || (Yv[n] = !0, t = t.displayName || t.name || "Component", e.tag === 3 ? console.error("Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.\n  root.render(%s)", t, t, t) : console.error("Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.\n  <%s>{%s}</%s>", t, t, n, t, n));
		}
		function Xi(e, t) {
			var n = Wi();
			n === null ? Yi(e, t) : n.run(Yi.bind(null, e, t));
		}
		function Zi(e, t) {
			var n = C(e) || "Component";
			Xv[n] || (Xv[n] = !0, t = String(t), e.tag === 3 ? console.error("Symbols are not valid as a React child.\n  root.render(%s)", t) : console.error("Symbols are not valid as a React child.\n  <%s>%s</%s>", n, t, n));
		}
		function Qi(e, t) {
			var n = Wi();
			n === null ? Zi(e, t) : n.run(Zi.bind(null, e, t));
		}
		function $i(e) {
			function t(t, n) {
				if (e) {
					var r = t.deletions;
					r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
				}
			}
			function n(n, r) {
				if (!e) return null;
				for (; r !== null;) t(n, r), r = r.sibling;
				return null;
			}
			function r(e) {
				for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
				return t;
			}
			function i(e, t) {
				return e = Tr(e, t), e.index = 0, e.sibling = null, e;
			}
			function a(t, n, r) {
				return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
			}
			function o(t) {
				return e && t.alternate === null && (t.flags |= 67108866), t;
			}
			function s(e, t, n, r) {
				return t === null || t.tag !== 6 ? (t = Ar(n, e.mode, r), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = J, t) : (t = i(t, n), t.return = e, t._debugInfo = J, t);
			}
			function c(e, t, n, r) {
				var a = n.type;
				return a === Pf ? (t = u(e, t, n.props.children, r, n.key), k(n, t, e), t) : t !== null && (t.elementType === a || br(t, n) || typeof a == "object" && a && a.$$typeof === Uf && Bi(a) === t.type) ? (t = i(t, n.props), Ki(t, n), t.return = e, t._debugOwner = n._owner, t._debugInfo = J, t) : (t = Or(n, e.mode, r), Ki(t, n), t.return = e, t._debugInfo = J, t);
			}
			function l(e, t, n, r) {
				return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Mr(n, e.mode, r), t.return = e, t._debugInfo = J, t) : (t = i(t, n.children || []), t.return = e, t._debugInfo = J, t);
			}
			function u(e, t, n, r, a) {
				return t === null || t.tag !== 7 ? (t = kr(n, e.mode, r, a), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = J, t) : (t = i(t, n), t.return = e, t._debugInfo = J, t);
			}
			function d(e, t, n) {
				if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ar("" + t, e.mode, n), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = J, t;
				if (typeof t == "object" && t) {
					switch (t.$$typeof) {
						case Mf: return n = Or(t, e.mode, n), Ki(n, t), n.return = e, e = Ui(t._debugInfo), n._debugInfo = J, J = e, n;
						case Nf: return t = Mr(t, e.mode, n), t.return = e, t._debugInfo = J, t;
						case Uf:
							var r = Ui(t._debugInfo);
							return t = Bi(t), e = d(e, t, n), J = r, e;
					}
					if (Jf(t) || ae(t)) return n = kr(t, e.mode, n, null), n.return = e, n._debugOwner = e, n._debugTask = e._debugTask, e = Ui(t._debugInfo), n._debugInfo = J, J = e, n;
					if (typeof t.then == "function") return r = Ui(t._debugInfo), e = d(e, Gi(t), n), J = r, e;
					if (t.$$typeof === Rf) return d(e, si(e, t), n);
					Ji(e, t);
				}
				return typeof t == "function" && Xi(e, t), typeof t == "symbol" && Qi(e, t), null;
			}
			function f(e, t, n, r) {
				var i = t === null ? null : t.key;
				if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? s(e, t, "" + n, r) : null;
				if (typeof n == "object" && n) {
					switch (n.$$typeof) {
						case Mf: return n.key === i ? (i = Ui(n._debugInfo), e = c(e, t, n, r), J = i, e) : null;
						case Nf: return n.key === i ? l(e, t, n, r) : null;
						case Uf: return i = Ui(n._debugInfo), n = Bi(n), e = f(e, t, n, r), J = i, e;
					}
					if (Jf(n) || ae(n)) return i === null ? (i = Ui(n._debugInfo), e = u(e, t, n, r, null), J = i, e) : null;
					if (typeof n.then == "function") return i = Ui(n._debugInfo), e = f(e, t, Gi(n), r), J = i, e;
					if (n.$$typeof === Rf) return f(e, t, si(e, n), r);
					Ji(e, n);
				}
				return typeof n == "function" && Xi(e, n), typeof n == "symbol" && Qi(e, n), null;
			}
			function p(e, t, n, r, i) {
				if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, s(t, e, "" + r, i);
				if (typeof r == "object" && r) {
					switch (r.$$typeof) {
						case Mf: return n = e.get(r.key === null ? n : r.key) || null, e = Ui(r._debugInfo), t = c(t, n, r, i), J = e, t;
						case Nf: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
						case Uf:
							var a = Ui(r._debugInfo);
							return r = Bi(r), t = p(e, t, n, r, i), J = a, t;
					}
					if (Jf(r) || ae(r)) return n = e.get(n) || null, e = Ui(r._debugInfo), t = u(t, n, r, i, null), J = e, t;
					if (typeof r.then == "function") return a = Ui(r._debugInfo), t = p(e, t, n, Gi(r), i), J = a, t;
					if (r.$$typeof === Rf) return p(e, t, n, si(t, r), i);
					Ji(t, r);
				}
				return typeof r == "function" && Xi(t, r), typeof r == "symbol" && Qi(t, r), null;
			}
			function h(e, t, n, r) {
				if (typeof n != "object" || !n) return r;
				switch (n.$$typeof) {
					case Mf:
					case Nf:
						m(e, t, n);
						var i = n.key;
						if (typeof i != "string") break;
						if (r === null) {
							r = /* @__PURE__ */ new Set(), r.add(i);
							break;
						}
						if (!r.has(i)) {
							r.add(i);
							break;
						}
						D(t, function() {
							console.error("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", i);
						});
						break;
					case Uf: n = Bi(n), h(e, t, n, r);
				}
				return r;
			}
			function _(i, o, s, c) {
				for (var l = null, u = null, m = null, g = o, _ = o = 0, v = null; g !== null && _ < s.length; _++) {
					g.index > _ ? (v = g, g = null) : v = g.sibling;
					var y = f(i, g, s[_], c);
					if (y === null) {
						g === null && (g = v);
						break;
					}
					l = h(i, y, s[_], l), e && g && y.alternate === null && t(i, g), o = a(y, o, _), m === null ? u = y : m.sibling = y, m = y, g = v;
				}
				if (_ === s.length) return n(i, g), G && Pr(i, _), u;
				if (g === null) {
					for (; _ < s.length; _++) g = d(i, s[_], c), g !== null && (l = h(i, g, s[_], l), o = a(g, o, _), m === null ? u = g : m.sibling = g, m = g);
					return G && Pr(i, _), u;
				}
				for (g = r(g); _ < s.length; _++) v = p(g, i, _, s[_], c), v !== null && (l = h(i, v, s[_], l), e && v.alternate !== null && g.delete(v.key === null ? _ : v.key), o = a(v, o, _), m === null ? u = v : m.sibling = v, m = v);
				return e && g.forEach(function(e) {
					return t(i, e);
				}), G && Pr(i, _), u;
			}
			function v(i, o, s, c) {
				if (s == null) throw Error("An iterable object provided no iterator.");
				for (var l = null, u = null, m = o, g = o = 0, _ = null, v = null, y = s.next(); m !== null && !y.done; g++, y = s.next()) {
					m.index > g ? (_ = m, m = null) : _ = m.sibling;
					var b = f(i, m, y.value, c);
					if (b === null) {
						m === null && (m = _);
						break;
					}
					v = h(i, b, y.value, v), e && m && b.alternate === null && t(i, m), o = a(b, o, g), u === null ? l = b : u.sibling = b, u = b, m = _;
				}
				if (y.done) return n(i, m), G && Pr(i, g), l;
				if (m === null) {
					for (; !y.done; g++, y = s.next()) m = d(i, y.value, c), m !== null && (v = h(i, m, y.value, v), o = a(m, o, g), u === null ? l = m : u.sibling = m, u = m);
					return G && Pr(i, g), l;
				}
				for (m = r(m); !y.done; g++, y = s.next()) _ = p(m, i, g, y.value, c), _ !== null && (v = h(i, _, y.value, v), e && _.alternate !== null && m.delete(_.key === null ? g : _.key), o = a(_, o, g), u === null ? l = _ : u.sibling = _, u = _);
				return e && m.forEach(function(e) {
					return t(i, e);
				}), G && Pr(i, g), l;
			}
			function y(e, r, a, s) {
				if (typeof a == "object" && a && a.type === Pf && a.key === null && (k(a, null, e), a = a.props.children), typeof a == "object" && a) {
					switch (a.$$typeof) {
						case Mf:
							var c = Ui(a._debugInfo);
							a: {
								for (var l = a.key; r !== null;) {
									if (r.key === l) {
										if (l = a.type, l === Pf) {
											if (r.tag === 7) {
												n(e, r.sibling), s = i(r, a.props.children), s.return = e, s._debugOwner = a._owner, s._debugInfo = J, k(a, s, e), e = s;
												break a;
											}
										} else if (r.elementType === l || br(r, a) || typeof l == "object" && l && l.$$typeof === Uf && Bi(l) === r.type) {
											n(e, r.sibling), s = i(r, a.props), Ki(s, a), s.return = e, s._debugOwner = a._owner, s._debugInfo = J, e = s;
											break a;
										}
										n(e, r);
										break;
									}
									t(e, r), r = r.sibling;
								}
								a.type === Pf ? (s = kr(a.props.children, e.mode, s, a.key), s.return = e, s._debugOwner = e, s._debugTask = e._debugTask, s._debugInfo = J, k(a, s, e), e = s) : (s = Or(a, e.mode, s), Ki(s, a), s.return = e, s._debugInfo = J, e = s);
							}
							return e = o(e), J = c, e;
						case Nf:
							a: {
								for (c = a, a = c.key; r !== null;) {
									if (r.key === a) {
										if (r.tag === 4 && r.stateNode.containerInfo === c.containerInfo && r.stateNode.implementation === c.implementation) {
											n(e, r.sibling), s = i(r, c.children || []), s.return = e, e = s;
											break a;
										}
										n(e, r);
										break;
									}
									t(e, r), r = r.sibling;
								}
								s = Mr(c, e.mode, s), s.return = e, e = s;
							}
							return o(e);
						case Uf: return c = Ui(a._debugInfo), a = Bi(a), e = y(e, r, a, s), J = c, e;
					}
					if (Jf(a)) return c = Ui(a._debugInfo), e = _(e, r, a, s), J = c, e;
					if (ae(a)) {
						if (c = Ui(a._debugInfo), l = ae(a), typeof l != "function") throw Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
						var u = l.call(a);
						return u === a ? (e.tag !== 0 || Object.prototype.toString.call(e.type) !== "[object GeneratorFunction]" || Object.prototype.toString.call(u) !== "[object Generator]") && (qv || console.error("Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."), qv = !0) : a.entries !== l || Kv || (console.error("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Kv = !0), e = v(e, r, u, s), J = c, e;
					}
					if (typeof a.then == "function") return c = Ui(a._debugInfo), e = y(e, r, Gi(a), s), J = c, e;
					if (a.$$typeof === Rf) return y(e, r, si(e, a), s);
					Ji(e, a);
				}
				return typeof a == "string" && a !== "" || typeof a == "number" || typeof a == "bigint" ? (c = "" + a, r !== null && r.tag === 6 ? (n(e, r.sibling), s = i(r, c), s.return = e, e = s) : (n(e, r), s = Ar(c, e.mode, s), s.return = e, s._debugOwner = e, s._debugTask = e._debugTask, s._debugInfo = J, e = s), o(e)) : (typeof a == "function" && Xi(e, a), typeof a == "symbol" && Qi(e, a), n(e, r));
			}
			return function(e, t, n, r) {
				var i = J;
				J = null;
				try {
					Gv = 0;
					var a = y(e, t, n, r);
					return Wv = null, a;
				} catch (t) {
					if (t === Rv || t === Bv) throw t;
					var o = g(29, t, null, e.mode);
					o.lanes = r, o.return = e;
					var s = o._debugInfo = J;
					if (o._debugOwner = e._debugOwner, o._debugTask = e._debugTask, s != null) {
						for (var c = s.length - 1; 0 <= c; c--) if (typeof s[c].stack == "string") {
							o._debugOwner = s[c], o._debugTask = s[c].debugTask;
							break;
						}
					}
					return o;
				} finally {
					J = i;
				}
			};
		}
		function ea(e, t) {
			var n = Jf(e);
			return e = !n && typeof ae(e) == "function", n || e ? (n = n ? "array" : "iterable", console.error("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", n, t, n), !1) : !0;
		}
		function ta(e) {
			e.updateQueue = {
				baseState: e.memoizedState,
				firstBaseUpdate: null,
				lastBaseUpdate: null,
				shared: {
					pending: null,
					lanes: 0,
					hiddenCallbacks: null
				},
				callbacks: null
			};
		}
		function na(e, t) {
			e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
				baseState: e.baseState,
				firstBaseUpdate: e.firstBaseUpdate,
				lastBaseUpdate: e.lastBaseUpdate,
				shared: e.shared,
				callbacks: null
			});
		}
		function ra(e) {
			return {
				lane: e,
				tag: $v,
				payload: null,
				callback: null,
				next: null
			};
		}
		function ia(e, t, n) {
			var r = e.updateQueue;
			if (r === null) return null;
			if (r = r.shared, ay === r && !iy) {
				var i = C(e);
				console.error("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.\n\nPlease update the following component: %s", i), iy = !0;
			}
			return (Wb & Fb) === Pb ? (pr(e, r, t, n), _r(e)) : (i = r.pending, i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = _r(e), gr(e, null, n), t);
		}
		function aa(e, t, n) {
			if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
				var r = t.lanes;
				r &= e.pendingLanes, n |= r, t.lanes = n, He(e, n);
			}
		}
		function oa(e, t) {
			var n = e.updateQueue, r = e.alternate;
			if (r !== null && (r = r.updateQueue, n === r)) {
				var i = null, a = null;
				if (n = n.firstBaseUpdate, n !== null) {
					do {
						var o = {
							lane: n.lane,
							tag: n.tag,
							payload: n.payload,
							callback: null,
							next: null
						};
						a === null ? i = a = o : a = a.next = o, n = n.next;
					} while (n !== null);
					a === null ? i = a = t : a = a.next = t;
				} else i = a = t;
				n = {
					baseState: r.baseState,
					firstBaseUpdate: i,
					lastBaseUpdate: a,
					shared: r.shared,
					callbacks: r.callbacks
				}, e.updateQueue = n;
				return;
			}
			e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
		}
		function sa() {
			if (oy) {
				var e = sv;
				if (e !== null) throw e;
			}
		}
		function ca(e, t, n, r) {
			oy = !1;
			var i = e.updateQueue;
			ry = !1, ay = i.shared;
			var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
			if (s !== null) {
				i.shared.pending = null;
				var c = s, l = c.next;
				c.next = null, o === null ? a = l : o.next = l, o = c;
				var u = e.alternate;
				u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
			}
			if (a !== null) {
				var d = i.baseState;
				o = 0, u = l = c = null, s = a;
				do {
					var f = s.lane & -536870913, p = f !== s.lane;
					if (p ? (Q & f) === f : (r & f) === f) {
						f !== 0 && f === ov && (oy = !0), u !== null && (u = u.next = {
							lane: 0,
							tag: s.tag,
							payload: s.payload,
							callback: null,
							next: null
						});
						a: {
							f = e;
							var m = s, h = t, g = n;
							switch (m.tag) {
								case ey:
									if (m = m.payload, typeof m == "function") {
										d_ = !0;
										var _ = m.call(g, d, h);
										if (f.mode & zg) {
											je(!0);
											try {
												m.call(g, d, h);
											} finally {
												je(!1);
											}
										}
										d_ = !1, d = _;
										break a;
									}
									d = m;
									break a;
								case ny: f.flags = f.flags & -65537 | 128;
								case $v:
									if (_ = m.payload, typeof _ == "function") {
										if (d_ = !0, m = _.call(g, d, h), f.mode & zg) {
											je(!0);
											try {
												_.call(g, d, h);
											} finally {
												je(!1);
											}
										}
										d_ = !1;
									} else m = _;
									if (m == null) break a;
									d = z({}, d, m);
									break a;
								case ty: ry = !0;
							}
						}
						f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
					} else p = {
						lane: f,
						tag: s.tag,
						payload: s.payload,
						callback: s.callback,
						next: null
					}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
					if (s = s.next, s === null) {
						if (s = i.shared.pending, s === null) break;
						p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
					}
				} while (1);
				u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), lx |= o, e.lanes = o, e.memoizedState = d;
			}
			ay = null;
		}
		function la(e, t) {
			if (typeof e != "function") throw Error("Invalid argument passed as callback. Expected a function. Instead received: " + e);
			e.call(t);
		}
		function ua(e, t) {
			var n = e.shared.hiddenCallbacks;
			if (n !== null) for (e.shared.hiddenCallbacks = null, e = 0; e < n.length; e++) la(n[e], t);
		}
		function da(e, t) {
			var n = e.callbacks;
			if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) la(n[e], t);
		}
		function fa(e, t) {
			var n = sx;
			w(cy, n, e), w(sy, t, e), sx = n | t.baseLanes;
		}
		function pa(e) {
			w(cy, sx, e), w(sy, sy.current, e);
		}
		function ma(e) {
			sx = cy.current, ce(sy, e), ce(cy, e);
		}
		function ha(e) {
			var t = e.alternate;
			w(py, py.current & dy, e), w(ly, e, e), uy === null && (t === null || sy.current !== null || t.memoizedState !== null) && (uy = e);
		}
		function ga(e) {
			w(py, py.current, e), w(ly, e, e), uy === null && (uy = e);
		}
		function _a(e) {
			e.tag === 22 ? (w(py, py.current, e), w(ly, e, e), uy === null && (uy = e)) : va(e);
		}
		function va(e) {
			w(py, py.current, e), w(ly, ly.current, e);
		}
		function ya(e) {
			ce(ly, e), uy === e && (uy = null), ce(py, e);
		}
		function ba(e) {
			for (var t = e; t !== null;) {
				if (t.tag === 13) {
					var n = t.memoizedState;
					if (n !== null && (n = n.dehydrated, n === null || gd(n) || _d(n))) return t;
				} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
					if (t.flags & 128) return t;
				} else if (t.child !== null) {
					t.child.return = t, t = t.child;
					continue;
				}
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return null;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
			return null;
		}
		function A() {
			var e = X;
			Fy === null ? Fy = [e] : Fy.push(e);
		}
		function j() {
			var e = X;
			if (Fy !== null && (Iy++, Fy[Iy] !== e)) {
				var t = C(Y);
				if (!by.has(t) && (by.add(t), Fy !== null)) {
					for (var n = "", r = 0; r <= Iy; r++) {
						var i = Fy[r], a = r === Iy ? e : i;
						for (i = r + 1 + ". " + i; 30 > i.length;) i += " ";
						i += a + "\n", n += i;
					}
					console.error("React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks\n\n   Previous render            Next render\n   ------------------------------------------------------\n%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n", t, n);
				}
			}
		}
		function xa(e) {
			e == null || Jf(e) || console.error("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", X, typeof e);
		}
		function Sa() {
			var e = C(Y);
			Cy.has(e) || (Cy.add(e), console.error("ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState.", e));
		}
		function Ca() {
			throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
		}
		function wa(e, t) {
			if (Ly) return !1;
			if (t === null) return console.error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", X), !1;
			e.length !== t.length && console.error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", X, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
			for (var n = 0; n < t.length && n < e.length; n++) if (!Gh(e[n], t[n])) return !1;
			return !0;
		}
		function Ta(e, t, n, r, i, a) {
			wy = a, Y = t, Fy = e === null ? null : e._debugHookTypes, Iy = -1, Ly = e !== null && e.type !== t.type, (Object.prototype.toString.call(n) === "[object AsyncFunction]" || Object.prototype.toString.call(n) === "[object AsyncGeneratorFunction]") && (a = C(Y), Sy.has(a) || (Sy.add(a), console.error("%s is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.", a === null ? "An unknown Component" : "<" + a + ">"))), t.memoizedState = null, t.updateQueue = null, t.lanes = 0, B.H = e !== null && e.memoizedState !== null ? Vy : Fy === null ? zy : By, ky = a = (t.mode & zg) !== U;
			var o = xv(n, r, i);
			if (ky = !1, Oy && (o = Da(t, n, r, i)), a) {
				je(!0);
				try {
					o = Da(t, n, r, i);
				} finally {
					je(!1);
				}
			}
			return Ea(e, t), o;
		}
		function Ea(e, t) {
			t._debugHookTypes = Fy, t.dependencies === null ? My !== null && (t.dependencies = {
				lanes: 0,
				firstContext: null,
				_debugThenableState: My
			}) : t.dependencies._debugThenableState = My, B.H = Ry;
			var n = Ty !== null && Ty.next !== null;
			if (wy = 0, Fy = X = Ey = Ty = Y = null, Iy = -1, e !== null && (e.flags & 65011712) != (t.flags & 65011712) && console.error("Internal React error: Expected static flag was missing. Please notify the React team."), Dy = !1, jy = 0, My = null, n) throw Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
			e === null || sb || (e = e.dependencies, e !== null && ii(e) && (sb = !0)), Uv ? (Uv = !1, e = !0) : e = !1, e && (t = C(t) || "Unknown", xy.has(t) || Sy.has(t) || (xy.add(t), console.error("`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary.")));
		}
		function Da(e, t, n, r) {
			Y = e;
			var i = 0;
			do {
				if (Oy && (My = null), jy = 0, Oy = !1, i >= Py) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
				if (i += 1, Ly = !1, Ey = Ty = null, e.updateQueue != null) {
					var a = e.updateQueue;
					a.lastEffect = null, a.events = null, a.stores = null, a.memoCache != null && (a.memoCache.index = 0);
				}
				Iy = -1, B.H = Hy, a = xv(t, n, r);
			} while (Oy);
			return a;
		}
		function Oa() {
			var e = B.H, t = e.useState()[0];
			return t = typeof t.then == "function" ? Fa(t) : t, e = e.useState()[0], (Ty === null ? null : Ty.memoizedState) !== e && (Y.flags |= 1024), t;
		}
		function ka() {
			var e = Ay !== 0;
			return Ay = 0, e;
		}
		function Aa(e, t, n) {
			t.updateQueue = e.updateQueue, t.flags = (t.mode & Bg) === U ? t.flags & -2053 : t.flags & -402655237, e.lanes &= ~n;
		}
		function ja(e) {
			if (Dy) {
				for (e = e.memoizedState; e !== null;) {
					var t = e.queue;
					t !== null && (t.pending = null), e = e.next;
				}
				Dy = !1;
			}
			wy = 0, Fy = Ey = Ty = Y = null, Iy = -1, X = null, Oy = !1, jy = Ay = 0, My = null;
		}
		function Ma() {
			var e = {
				memoizedState: null,
				baseState: null,
				baseQueue: null,
				queue: null,
				next: null
			};
			return Ey === null ? Y.memoizedState = Ey = e : Ey = Ey.next = e, Ey;
		}
		function Na() {
			if (Ty === null) {
				var e = Y.alternate;
				e = e === null ? null : e.memoizedState;
			} else e = Ty.next;
			var t = Ey === null ? Y.memoizedState : Ey.next;
			if (t !== null) Ey = t, Ty = e;
			else {
				if (e === null) throw Y.alternate === null ? Error("Update hook called on initial render. This is likely a bug in React. Please file an issue.") : Error("Rendered more hooks than during the previous render.");
				Ty = e, e = {
					memoizedState: Ty.memoizedState,
					baseState: Ty.baseState,
					baseQueue: Ty.baseQueue,
					queue: Ty.queue,
					next: null
				}, Ey === null ? Y.memoizedState = Ey = e : Ey = Ey.next = e;
			}
			return Ey;
		}
		function Pa() {
			return {
				lastEffect: null,
				events: null,
				stores: null,
				memoCache: null
			};
		}
		function Fa(e) {
			var t = jy;
			return jy += 1, My === null && (My = Li()), e = zi(My, e, t), t = Y, (Ey === null ? t.memoizedState : Ey.next) === null && (t = t.alternate, B.H = t !== null && t.memoizedState !== null ? Vy : zy), e;
		}
		function Ia(e) {
			if (typeof e == "object" && e) {
				if (typeof e.then == "function") return Fa(e);
				if (e.$$typeof === Rf) return oi(e);
			}
			throw Error("An unsupported type was passed to use(): " + String(e));
		}
		function La(e) {
			var t = null, n = Y.updateQueue;
			if (n !== null && (t = n.memoCache), t == null) {
				var r = Y.alternate;
				r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
					data: r.data.map(function(e) {
						return e.slice();
					}),
					index: 0
				})));
			}
			if (t ??= {
				data: [],
				index: 0
			}, n === null && (n = Pa(), Y.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0 || Ly) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = Gf;
			else n.length !== e && console.error("Expected a constant size argument for each invocation of useMemoCache. The previous cache was allocated with size %s but size %s was requested.", n.length, e);
			return t.index++, n;
		}
		function Ra(e, t) {
			return typeof t == "function" ? t(e) : t;
		}
		function za(e, t, n) {
			var r = Ma();
			if (n !== void 0) {
				var i = n(t);
				if (ky) {
					je(!0);
					try {
						n(t);
					} finally {
						je(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = qo.bind(null, Y, e), [r.memoizedState, e];
		}
		function Ba(e) {
			return Va(Na(), Ty, e);
		}
		function Va(e, t, n) {
			var r = e.queue;
			if (r === null) throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
			r.lastRenderedReducer = n;
			var i = e.baseQueue, a = r.pending;
			if (a !== null) {
				if (i !== null) {
					var o = i.next;
					i.next = a.next, a.next = o;
				}
				t.baseQueue !== i && console.error("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), t.baseQueue = i = a, r.pending = null;
			}
			if (a = e.baseState, i === null) e.memoizedState = a;
			else {
				t = i.next;
				var s = o = null, c = null, l = t, u = !1;
				do {
					var d = l.lane & -536870913;
					if (d === l.lane ? (wy & d) === d : (Q & d) === d) {
						var f = l.revertLane;
						if (f === 0) c !== null && (c = c.next = {
							lane: 0,
							revertLane: 0,
							gesture: null,
							action: l.action,
							hasEagerState: l.hasEagerState,
							eagerState: l.eagerState,
							next: null
						}), d === ov && (u = !0);
						else if ((wy & f) === f) {
							l = l.next, f === ov && (u = !0);
							continue;
						} else d = {
							lane: 0,
							revertLane: l.revertLane,
							gesture: null,
							action: l.action,
							hasEagerState: l.hasEagerState,
							eagerState: l.eagerState,
							next: null
						}, c === null ? (s = c = d, o = a) : c = c.next = d, Y.lanes |= f, lx |= f;
						d = l.action, ky && n(a, d), a = l.hasEagerState ? l.eagerState : n(a, d);
					} else f = {
						lane: d,
						revertLane: l.revertLane,
						gesture: l.gesture,
						action: l.action,
						hasEagerState: l.hasEagerState,
						eagerState: l.eagerState,
						next: null
					}, c === null ? (s = c = f, o = a) : c = c.next = f, Y.lanes |= d, lx |= d;
					l = l.next;
				} while (l !== null && l !== t);
				if (c === null ? o = a : c.next = s, !Gh(a, e.memoizedState) && (sb = !0, u && (n = sv, n !== null))) throw n;
				e.memoizedState = a, e.baseState = o, e.baseQueue = c, r.lastRenderedState = a;
			}
			return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
		}
		function Ha(e) {
			var t = Na(), n = t.queue;
			if (n === null) throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
			n.lastRenderedReducer = e;
			var r = n.dispatch, i = n.pending, a = t.memoizedState;
			if (i !== null) {
				n.pending = null;
				var o = i = i.next;
				do
					a = e(a, o.action), o = o.next;
				while (o !== i);
				Gh(a, t.memoizedState) || (sb = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), n.lastRenderedState = a;
			}
			return [a, r];
		}
		function Ua(e, t, n) {
			var r = Y, i = Ma();
			if (G) {
				if (n === void 0) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
				var a = n();
				yy || a === n() || (console.error("The result of getServerSnapshot should be cached to avoid an infinite loop"), yy = !0);
			} else {
				if (a = t(), yy || (n = t(), Gh(a, n) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), yy = !0)), Gb === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
				Q & 127 || Ga(r, t, a);
			}
			return i.memoizedState = a, n = {
				value: a,
				getSnapshot: t
			}, i.queue = n, yo(qa.bind(null, r, n, e), [e]), r.flags |= 2048, ho(hy | vy, { destroy: void 0 }, Ka.bind(null, r, n, a, t), null), a;
		}
		function Wa(e, t, n) {
			var r = Y, i = Na(), a = G;
			if (a) {
				if (n === void 0) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
				n = n();
			} else if (n = t(), !yy) {
				var o = t();
				Gh(n, o) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), yy = !0);
			}
			if ((o = !Gh((Ty || i).memoizedState, n)) && (i.memoizedState = n, sb = !0), i = i.queue, vo(2048, vy, qa.bind(null, r, i, e), [e]), i.getSnapshot !== t || o || Ey !== null && Ey.memoizedState.tag & hy) {
				if (r.flags |= 2048, ho(hy | vy, { destroy: void 0 }, Ka.bind(null, r, i, n, t), null), Gb === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
				a || wy & 127 || Ga(r, t, n);
			}
			return n;
		}
		function Ga(e, t, n) {
			e.flags |= 16384, e = {
				getSnapshot: t,
				value: n
			}, t = Y.updateQueue, t === null ? (t = Pa(), Y.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
		}
		function Ka(e, t, n, r) {
			t.value = n, t.getSnapshot = r, Ja(t) && Ya(e);
		}
		function qa(e, t, n) {
			return n(function() {
				Ja(t) && (fi(2, "updateSyncExternalStore()", e), Ya(e));
			});
		}
		function Ja(e) {
			var t = e.getSnapshot;
			e = e.value;
			try {
				var n = t();
				return !Gh(e, n);
			} catch {
				return !0;
			}
		}
		function Ya(e) {
			var t = hr(e, 2);
			t !== null && ol(t, e, 2);
		}
		function Xa(e) {
			var t = Ma();
			if (typeof e == "function") {
				var n = e;
				if (e = n(), ky) {
					je(!0);
					try {
						n();
					} finally {
						je(!1);
					}
				}
			}
			return t.memoizedState = t.baseState = e, t.queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ra,
				lastRenderedState: e
			}, t;
		}
		function Za(e) {
			e = Xa(e);
			var t = e.queue, n = Jo.bind(null, Y, t);
			return t.dispatch = n, [e.memoizedState, n];
		}
		function Qa(e) {
			var t = Ma();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Xo.bind(null, Y, !0, n), n.dispatch = t, [e, t];
		}
		function $a(e, t) {
			return eo(Na(), Ty, e, t);
		}
		function eo(e, t, n, r) {
			return e.baseState = n, Va(e, Ty, typeof r == "function" ? r : Ra);
		}
		function to(e, t) {
			var n = Na();
			return Ty === null ? (n.baseState = e, [e, n.queue.dispatch]) : eo(n, Ty, e, t);
		}
		function no(e, t, n, r, i) {
			if (Zo(e)) throw Error("Cannot update form state while rendering.");
			if (e = t.action, e !== null) {
				var a = {
					payload: i,
					action: e,
					next: null,
					isTransition: !0,
					status: "pending",
					value: null,
					reason: null,
					listeners: [],
					then: function(e) {
						a.listeners.push(e);
					}
				};
				B.T === null ? a.isTransition = !1 : n(!0), r(a), n = t.pending, n === null ? (a.next = t.pending = a, ro(t, a)) : (a.next = n.next, t.pending = n.next = a);
			}
		}
		function ro(e, t) {
			var n = t.action, r = t.payload, i = e.state;
			if (t.isTransition) {
				var a = B.T, o = {};
				o._updatedFibers = /* @__PURE__ */ new Set(), B.T = o;
				try {
					var s = n(i, r), c = B.S;
					c !== null && c(o, s), io(e, t, s);
				} catch (n) {
					oo(e, t, n);
				} finally {
					a !== null && o.types !== null && (a.types !== null && a.types !== o.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), a.types = o.types), B.T = a, a === null && o._updatedFibers && (e = o._updatedFibers.size, o._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
				}
			} else try {
				o = n(i, r), io(e, t, o);
			} catch (n) {
				oo(e, t, n);
			}
		}
		function io(e, t, n) {
			typeof n == "object" && n && typeof n.then == "function" ? (B.asyncTransitions++, n.then(Fo, Fo), n.then(function(n) {
				ao(e, t, n);
			}, function(n) {
				return oo(e, t, n);
			}), t.isTransition || console.error("An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.")) : ao(e, t, n);
		}
		function ao(e, t, n) {
			t.status = "fulfilled", t.value = n, so(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ro(e, n)));
		}
		function oo(e, t, n) {
			var r = e.pending;
			if (e.pending = null, r !== null) {
				r = r.next;
				do
					t.status = "rejected", t.reason = n, so(t), t = t.next;
				while (t !== r);
			}
			e.action = null;
		}
		function so(e) {
			e = e.listeners;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
		function co(e, t) {
			return t;
		}
		function lo(e, t) {
			if (G) {
				var n = Gb.formState;
				if (n !== null) {
					a: {
						var r = Y;
						if (G) {
							if (e_) {
								b: {
									for (var i = e_, a = i_; i.nodeType !== 8;) {
										if (!a) {
											i = null;
											break b;
										}
										if (i = yd(i.nextSibling), i === null) {
											i = null;
											break b;
										}
									}
									a = i.data, i = a === BS || a === VS ? i : null;
								}
								if (i) {
									e_ = yd(i.nextSibling), r = i.data === BS;
									break a;
								}
							}
							Wr(r);
						}
						r = !1;
					}
					r && (t = n[0]);
				}
			}
			return n = Ma(), n.memoizedState = n.baseState = t, r = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: co,
				lastRenderedState: t
			}, n.queue = r, n = Jo.bind(null, Y, r), r.dispatch = n, r = Xa(!1), a = Xo.bind(null, Y, !1, r.queue), r = Ma(), i = {
				state: t,
				dispatch: null,
				action: e,
				pending: null
			}, r.queue = i, n = no.bind(null, Y, i, a, n), i.dispatch = n, r.memoizedState = e, [
				t,
				n,
				!1
			];
		}
		function uo(e) {
			return fo(Na(), Ty, e);
		}
		function fo(e, t, n) {
			if (t = Va(e, t, co)[0], e = Ba(Ra)[0], typeof t == "object" && t && typeof t.then == "function") try {
				var r = Fa(t);
			} catch (e) {
				throw e === Rv ? Bv : e;
			}
			else r = t;
			t = Na();
			var i = t.queue, a = i.dispatch;
			return n !== t.memoizedState && (Y.flags |= 2048, ho(hy | vy, { destroy: void 0 }, po.bind(null, i, n), null)), [
				r,
				a,
				e
			];
		}
		function po(e, t) {
			e.action = t;
		}
		function mo(e) {
			var t = Na(), n = Ty;
			if (n !== null) return fo(t, n, e);
			Na(), t = t.memoizedState, n = Na();
			var r = n.queue.dispatch;
			return n.memoizedState = e, [
				t,
				r,
				!1
			];
		}
		function ho(e, t, n, r) {
			return e = {
				tag: e,
				create: n,
				deps: r,
				inst: t,
				next: null
			}, t = Y.updateQueue, t === null && (t = Pa(), Y.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
		}
		function go(e) {
			var t = Ma();
			return e = { current: e }, t.memoizedState = e;
		}
		function _o(e, t, n, r) {
			var i = Ma();
			Y.flags |= e, i.memoizedState = ho(hy | t, { destroy: void 0 }, n, r === void 0 ? null : r);
		}
		function vo(e, t, n, r) {
			var i = Na();
			r = r === void 0 ? null : r;
			var a = i.memoizedState.inst;
			Ty !== null && r !== null && wa(r, Ty.memoizedState.deps) ? i.memoizedState = ho(t, a, n, r) : (Y.flags |= e, i.memoizedState = ho(hy | t, a, n, r));
		}
		function yo(e, t) {
			(Y.mode & Bg) === U ? _o(8390656, vy, e, t) : _o(276826112, vy, e, t);
		}
		function bo(e) {
			Y.flags |= 4;
			var t = Y.updateQueue;
			if (t === null) t = Pa(), Y.updateQueue = t, t.events = [e];
			else {
				var n = t.events;
				n === null ? t.events = [e] : n.push(e);
			}
		}
		function xo(e) {
			var t = Ma(), n = { impl: e };
			return t.memoizedState = n, function() {
				if ((Wb & Fb) !== Pb) throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
				return n.impl.apply(void 0, arguments);
			};
		}
		function M(e) {
			var t = Na().memoizedState;
			return bo({
				ref: t,
				nextImpl: e
			}), function() {
				if ((Wb & Fb) !== Pb) throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
				return t.impl.apply(void 0, arguments);
			};
		}
		function So(e, t) {
			var n = 4194308;
			return (Y.mode & Bg) !== U && (n |= 134217728), _o(n, _y, e, t);
		}
		function Co(e, t) {
			if (typeof t == "function") {
				e = e();
				var n = t(e);
				return function() {
					typeof n == "function" ? n() : t(null);
				};
			}
			if (t != null) return t.hasOwnProperty("current") || console.error("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(t).join(", ") + "}"), e = e(), t.current = e, function() {
				t.current = null;
			};
		}
		function wo(e, t, n) {
			typeof t != "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t === null ? "null" : typeof t), n = n == null ? null : n.concat([e]);
			var r = 4194308;
			(Y.mode & Bg) !== U && (r |= 134217728), _o(r, _y, Co.bind(null, t, e), n);
		}
		function To(e, t, n) {
			typeof t != "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t === null ? "null" : typeof t), n = n == null ? null : n.concat([e]), vo(4, _y, Co.bind(null, t, e), n);
		}
		function Eo(e, t) {
			return Ma().memoizedState = [e, t === void 0 ? null : t], e;
		}
		function Do(e, t) {
			var n = Na();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			return t !== null && wa(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
		}
		function Oo(e, t) {
			var n = Ma();
			t = t === void 0 ? null : t;
			var r = e();
			if (ky) {
				je(!0);
				try {
					e();
				} finally {
					je(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		}
		function ko(e, t) {
			var n = Na();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			if (t !== null && wa(t, r[1])) return r[0];
			if (r = e(), ky) {
				je(!0);
				try {
					e();
				} finally {
					je(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		}
		function Ao(e, t) {
			return No(Ma(), e, t);
		}
		function jo(e, t) {
			return Po(Na(), Ty.memoizedState, e, t);
		}
		function Mo(e, t) {
			var n = Na();
			return Ty === null ? No(n, e, t) : Po(n, Ty.memoizedState, e, t);
		}
		function No(e, t, n) {
			return n === void 0 || wy & 1073741824 && !(Q & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = al(), Y.lanes |= e, lx |= e, n);
		}
		function Po(e, t, n, r) {
			return Gh(n, t) ? n : sy.current === null ? !(wy & 42) || wy & 1073741824 && !(Q & 261930) ? (sb = !0, e.memoizedState = n) : (e = al(), Y.lanes |= e, lx |= e, t) : (e = No(e, n, r), Gh(e, t) || (sb = !0), e);
		}
		function Fo() {
			B.asyncTransitions--;
		}
		function Io(e, t, n, r, i) {
			var a = Yf.p;
			Yf.p = a !== 0 && a < Up ? a : Up;
			var o = B.T, s = {};
			s._updatedFibers = /* @__PURE__ */ new Set(), B.T = s, Xo(e, !1, t, n);
			try {
				var c = i(), l = B.S;
				if (l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function") {
					B.asyncTransitions++, c.then(Fo, Fo);
					var u = Ni(c, r);
					Yo(e, t, u, il(e));
				} else Yo(e, t, r, il(e));
			} catch (n) {
				Yo(e, t, {
					then: function() {},
					status: "rejected",
					reason: n
				}, il(e));
			} finally {
				Yf.p = a, o !== null && s.types !== null && (o.types !== null && o.types !== s.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), o.types = s.types), B.T = o, o === null && s._updatedFibers && (e = s._updatedFibers.size, s._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
			}
		}
		function Lo(e, t, n, r) {
			if (e.tag !== 5) throw Error("Expected the form instance to be a HostComponent. This is a bug in React.");
			var i = Ro(e).queue;
			pi(e), Io(e, i, t, bC, n === null ? p : function() {
				return zo(e), n(r);
			});
		}
		function Ro(e) {
			var t = e.memoizedState;
			if (t !== null) return t;
			t = {
				memoizedState: bC,
				baseState: bC,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Ra,
					lastRenderedState: bC
				},
				next: null
			};
			var n = {};
			return t.next = {
				memoizedState: n,
				baseState: n,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Ra,
					lastRenderedState: n
				},
				next: null
			}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
		}
		function zo(e) {
			B.T === null && console.error("requestFormReset was called outside a transition or action. To fix, move to an action, or wrap with startTransition.");
			var t = Ro(e);
			t.next === null && (t = e.alternate.memoizedState), Yo(e, t.next.queue, {}, il(e));
		}
		function Bo() {
			var e = Xa(!1);
			return e = Io.bind(null, Y, e.queue, !0, !1), Ma().memoizedState = e, [!1, e];
		}
		function Vo() {
			var e = Ba(Ra)[0], t = Na().memoizedState;
			return [typeof e == "boolean" ? e : Fa(e), t];
		}
		function Ho() {
			var e = Ha(Ra)[0], t = Na().memoizedState;
			return [typeof e == "boolean" ? e : Fa(e), t];
		}
		function Uo() {
			return oi(xC);
		}
		function Wo() {
			var e = Ma(), t = Gb.identifierPrefix;
			if (G) {
				var n = Qg, r = Zg;
				n = (r & ~(1 << 32 - Ip(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Ay++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Ny++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		}
		function Go() {
			return Ma().memoizedState = Ko.bind(null, Y);
		}
		function Ko(e, t) {
			for (var n = e.return; n !== null;) {
				switch (n.tag) {
					case 24:
					case 3:
						var r = il(n), i = ra(r), a = ia(n, i, r);
						a !== null && (fi(r, "refresh()", e), ol(a, n, r), aa(a, n, r)), e = li(), t != null && a !== null && console.error("The seed argument is not enabled outside experimental channels."), i.payload = { cache: e };
						return;
				}
				n = n.return;
			}
		}
		function qo(e, t, n) {
			var r = arguments;
			typeof r[3] == "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), r = il(e);
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null
			};
			Zo(e) ? Qo(t, i) : (i = mr(e, t, i, r), i !== null && (fi(r, "dispatch()", e), ol(i, e, r), $o(i, t, r)));
		}
		function Jo(e, t, n) {
			var r = arguments;
			typeof r[3] == "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), r = il(e), Yo(e, t, n, r) && fi(r, "setState()", e);
		}
		function Yo(e, t, n, r) {
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null
			};
			if (Zo(e)) Qo(t, i);
			else {
				var a = e.alternate;
				if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) {
					var o = B.H;
					B.H = Wy;
					try {
						var s = t.lastRenderedState, c = a(s, n);
						if (i.hasEagerState = !0, i.eagerState = c, Gh(c, s)) return pr(e, t, i, 0), Gb === null && fr(), !1;
					} catch {} finally {
						B.H = o;
					}
				}
				if (n = mr(e, t, i, r), n !== null) return ol(n, e, r), $o(n, t, r), !0;
			}
			return !1;
		}
		function Xo(e, t, n, r) {
			if (B.T === null && ov === 0 && console.error("An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition."), r = {
				lane: 2,
				revertLane: iu(),
				gesture: null,
				action: r,
				hasEagerState: !1,
				eagerState: null,
				next: null
			}, Zo(e)) {
				if (t) throw Error("Cannot update optimistic state while rendering.");
				console.error("Cannot call startTransition while rendering.");
			} else t = mr(e, n, r, 2), t !== null && (fi(2, "setOptimistic()", e), ol(t, e, 2));
		}
		function Zo(e) {
			var t = e.alternate;
			return e === Y || t !== null && t === Y;
		}
		function Qo(e, t) {
			Oy = Dy = !0;
			var n = e.pending;
			n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
		}
		function $o(e, t, n) {
			if (n & 4194048) {
				var r = t.lanes;
				r &= e.pendingLanes, n |= r, t.lanes = n, He(e, n);
			}
		}
		function es(e) {
			if (e !== null && typeof e != "function") {
				var t = String(e);
				nb.has(t) || (nb.add(t), console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", e));
			}
		}
		function ts(e, t, n, r) {
			var i = e.memoizedState, a = n(r, i);
			if (e.mode & zg) {
				je(!0);
				try {
					a = n(r, i);
				} finally {
					je(!1);
				}
			}
			a === void 0 && (t = S(t) || "Component", Qy.has(t) || (Qy.add(t), console.error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", t))), i = a == null ? i : z({}, i, a), e.memoizedState = i, e.lanes === 0 && (e.updateQueue.baseState = i);
		}
		function ns(e, t, n, r, i, a, o) {
			var s = e.stateNode;
			if (typeof s.shouldComponentUpdate == "function") {
				if (n = s.shouldComponentUpdate(r, a, o), e.mode & zg) {
					je(!0);
					try {
						n = s.shouldComponentUpdate(r, a, o);
					} finally {
						je(!1);
					}
				}
				return n === void 0 && console.error("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", S(t) || "Component"), n;
			}
			return t.prototype && t.prototype.isPureReactComponent ? !Rn(n, r) || !Rn(i, a) : !0;
		}
		function rs(e, t, n, r) {
			var i = t.state;
			typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== i && (e = C(e) || "Component", qy.has(e) || (qy.add(e), console.error("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", e)), rb.enqueueReplaceState(t, t.state, null));
		}
		function is(e, t) {
			var n = t;
			if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
			if (e = e.defaultProps) for (var i in n === t && (n = z({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
			return n;
		}
		function as(e) {
			pg(e), console.warn("%s\n\n%s\n", ib ? "An error occurred in the <" + ib + "> component." : "An error occurred in one of your React components.", "Consider adding an error boundary to your tree to customize error handling behavior.\nVisit https://react.dev/link/error-boundaries to learn more about error boundaries.");
		}
		function os(e) {
			var t = ib ? "The above error occurred in the <" + ib + "> component." : "The above error occurred in one of your React components.", n = "React will try to recreate this component tree from scratch using the error boundary you provided, " + ((ab || "Anonymous") + ".");
			if (typeof e == "object" && e && typeof e.environmentName == "string") {
				var r = e.environmentName;
				e = [
					"%o\n\n%s\n\n%s\n",
					e,
					t,
					n
				].slice(0), typeof e[0] == "string" ? e.splice(0, 1, SC + " " + e[0], CC, TC + r + TC, wC) : e.splice(0, 0, SC, CC, TC + r + TC, wC), e.unshift(console), r = EC.apply(console.error, e), r();
			} else console.error("%o\n\n%s\n\n%s\n", e, t, n);
		}
		function ss(e) {
			pg(e);
		}
		function cs(e, t) {
			try {
				ib = t.source ? C(t.source) : null, ab = null;
				var n = t.value;
				if (B.actQueue !== null) B.thrownErrors.push(n);
				else {
					var r = e.onUncaughtError;
					r(n, { componentStack: t.stack });
				}
			} catch (e) {
				setTimeout(function() {
					throw e;
				});
			}
		}
		function ls(e, t, n) {
			try {
				ib = n.source ? C(n.source) : null, ab = C(t);
				var r = e.onCaughtError;
				r(n.value, {
					componentStack: n.stack,
					errorBoundary: t.tag === 1 ? t.stateNode : null
				});
			} catch (e) {
				setTimeout(function() {
					throw e;
				});
			}
		}
		function us(e, t, n) {
			return n = ra(n), n.tag = ny, n.payload = { element: null }, n.callback = function() {
				D(t.source, cs, e, t);
			}, n;
		}
		function ds(e) {
			return e = ra(e), e.tag = ny, e;
		}
		function fs(e, t, n, r) {
			var i = n.type.getDerivedStateFromError;
			if (typeof i == "function") {
				var a = r.value;
				e.payload = function() {
					return i(a);
				}, e.callback = function() {
					xr(n), D(r.source, ls, t, n, r);
				};
			}
			var o = n.stateNode;
			o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
				xr(n), D(r.source, ls, t, n, r), typeof i != "function" && (wx === null ? wx = /* @__PURE__ */ new Set([this]) : wx.add(this)), kv(this, r), typeof i == "function" || !(n.lanes & 2) && console.error("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", C(n) || "Unknown");
			});
		}
		function ps(e, t, n, r, i) {
			if (n.flags |= 32768, Fp && Yl(e, i), typeof r == "object" && r && typeof r.then == "function") {
				if (t = n.alternate, t !== null && ri(t, n, i, !0), G && (t_ = !0), n = ly.current, n !== null) {
					switch (n.tag) {
						case 31:
						case 13: return uy === null ? bl() : n.alternate === null && cx === Lb && (cx = Bb), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Vv ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Bl(e, r, i)), !1;
						case 22: return n.flags |= 65536, r === Vv ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
							transitions: null,
							markerInstances: null,
							retryQueue: /* @__PURE__ */ new Set([r])
						}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Bl(e, r, i)), !1;
					}
					throw Error("Unexpected Suspense handler tag (" + n.tag + "). This is a bug in React.");
				}
				return Bl(e, r, i), bl(), !1;
			}
			if (G) return t_ = !0, t = ly.current, t === null ? (r !== a_ && Xr(Nr(Error("There was an error while hydrating but React was able to recover by instead client rendering the entire root.", { cause: r }), n)), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = Nr(r, n), i = us(e.stateNode, r, i), oa(e, i), cx !== Vb && (cx = zb)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== a_ && Xr(Nr(Error("There was an error while hydrating but React was able to recover by instead client rendering from the nearest Suspense boundary.", { cause: r }), n))), !1;
			var a = Nr(Error("There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.", { cause: r }), n);
			if (mx === null ? mx = [a] : mx.push(a), cx !== Vb && (cx = zb), t === null) return !0;
			r = Nr(r, n), n = t;
			do {
				switch (n.tag) {
					case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = us(n.stateNode, r, e), oa(n, e), !1;
					case 1: if (t = n.type, a = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || a !== null && typeof a.componentDidCatch == "function" && (wx === null || !wx.has(a)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = ds(i), fs(i, e, n, r), oa(n, i), !1;
				}
				n = n.return;
			} while (n !== null);
			return !1;
		}
		function ms(e, t, n, r) {
			t.child = e === null ? Qv(t, null, n, r) : Zv(t, e.child, n, r);
		}
		function hs(e, t, n, r, i) {
			n = n.render;
			var a = t.ref;
			if ("ref" in r) {
				var o = {};
				for (var s in r) s !== "ref" && (o[s] = r[s]);
			} else o = r;
			return ai(t), r = Ta(e, t, n, o, a, i), s = ka(), e !== null && !sb ? (Aa(e, t, i), zs(e, t, i)) : (G && s && Ir(t), t.flags |= 1, ms(e, t, r, i), t.child);
		}
		function gs(e, t, n, r, i) {
			if (e === null) {
				var a = n.type;
				return typeof a == "function" && !wr(a) && a.defaultProps === void 0 && n.compare === null ? (n = vr(a), t.tag = 15, t.type = n, ks(t, a), _s(e, t, n, r, i)) : (e = Dr(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
			}
			if (a = e.child, !Bs(e, i)) {
				var o = a.memoizedProps;
				if (n = n.compare, n = n === null ? Rn : n, n(o, r) && e.ref === t.ref) return zs(e, t, i);
			}
			return t.flags |= 1, e = Tr(a, r), e.ref = t.ref, e.return = t, t.child = e;
		}
		function _s(e, t, n, r, i) {
			if (e !== null) {
				var a = e.memoizedProps;
				if (Rn(a, r) && e.ref === t.ref && t.type === e.type) {
					if (sb = !1, t.pendingProps = r = a, Bs(e, i)) e.flags & 131072 && (sb = !0);
					else return t.lanes = e.lanes, zs(e, t, i);
				}
			}
			return Ts(e, t, n, r, i);
		}
		function vs(e, t, n, r) {
			var i = r.children, a = e === null ? null : e.memoizedState;
			if (e === null && t.stateNode === null && (t.stateNode = {
				_visibility: Ag,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), r.mode === "hidden") {
				if (t.flags & 128) {
					if (a = a === null ? n : a.baseLanes | n, e !== null) {
						for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
						r = i & ~a;
					} else r = 0, t.child = null;
					return bs(e, t, a, n, r);
				}
				if (n & 536870912) t.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, e !== null && Fi(t, a === null ? null : a.cachePool), a === null ? pa(t) : fa(t, a), _a(t);
				else return r = t.lanes = 536870912, bs(e, t, a === null ? n : a.baseLanes | n, n, r);
			} else a === null ? (e !== null && Fi(t, null), pa(t), va(t)) : (Fi(t, a.cachePool), fa(t, a), va(t), t.memoizedState = null);
			return ms(e, t, i, n), t.child;
		}
		function ys(e, t) {
			return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
				_visibility: Ag,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), t.sibling;
		}
		function bs(e, t, n, r, i) {
			var a = Pi();
			return a = a === null ? null : {
				parent: h_._currentValue,
				pool: a
			}, t.memoizedState = {
				baseLanes: n,
				cachePool: a
			}, e !== null && Fi(t, null), pa(t), _a(t), e !== null && ri(e, t, r, !0), t.childLanes = i, null;
		}
		function xs(e, t) {
			var n = t.hidden;
			return n !== void 0 && console.error("<Activity> doesn't accept a hidden prop. Use mode=\"hidden\" instead.\n- <Activity %s>\n+ <Activity %s>", !0 === n ? "hidden" : !1 === n ? "hidden={false}" : "hidden={...}", n ? "mode=\"hidden\"" : "mode=\"visible\""), t = Ps({
				mode: t.mode,
				children: t.children
			}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
		}
		function Ss(e, t, n) {
			return Zv(t, e.child, null, n), e = xs(t, t.pendingProps), e.flags |= 2, ya(t), t.memoizedState = null, e;
		}
		function Cs(e, t, n) {
			var r = t.pendingProps, i = !!(t.flags & 128);
			if (t.flags &= -129, e === null) {
				if (G) {
					if (r.mode === "hidden") return e = xs(t, r), t.lanes = 536870912, ys(null, e);
					if (ga(t), (e = e_) ? (n = hd(e, i_), n = n !== null && n.data === AS ? n : null, n !== null && (r = {
						dehydrated: n,
						treeContext: Rr(),
						retryLane: 536870912,
						hydrationErrors: null
					}, t.memoizedState = r, r = jr(n), r.return = t, t.child = r, $g = t, e_ = null)) : n = null, n === null) throw Ur(t, e), Wr(t);
					return t.lanes = 536870912, null;
				}
				return xs(t, r);
			}
			var a = e.memoizedState;
			if (a !== null) {
				var o = a.dehydrated;
				if (ga(t), i) {
					if (t.flags & 256) t.flags &= -257, t = Ss(e, t, n);
					else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
					else throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
				} else if (Hr(), n & 536870912 && yl(t), sb || ri(e, t, n, !1), i = (n & e.childLanes) !== 0, sb || i) {
					if (r = Gb, r !== null && (o = Ue(r, n), o !== 0 && o !== a.retryLane)) throw a.retryLane = o, hr(e, o), ol(r, e, o), ob;
					bl(), t = Ss(e, t, n);
				} else e = a.treeContext, e_ = yd(o.nextSibling), $g = t, G = !0, r_ = null, t_ = !1, n_ = null, i_ = !1, e !== null && zr(t, e), t = xs(t, r), t.flags |= 4096;
				return t;
			}
			return a = e.child, r = {
				mode: r.mode,
				children: r.children
			}, n & 536870912 && (n & e.lanes) !== 0 && yl(t), e = Tr(a, r), e.ref = t.ref, t.child = e, e.return = t, e;
		}
		function ws(e, t) {
			var n = t.ref;
			if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
			else {
				if (typeof n != "function" && typeof n != "object") throw Error("Expected ref to be a function, an object returned by React.createRef(), or undefined/null.");
				(e === null || e.ref !== n) && (t.flags |= 4194816);
			}
		}
		function Ts(e, t, n, r, i) {
			if (n.prototype && typeof n.prototype.render == "function") {
				var a = S(n) || "Unknown";
				cb[a] || (console.error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", a, a), cb[a] = !0);
			}
			return t.mode & zg && uv.recordLegacyContextWarning(t, null), e === null && (ks(t, t.type), n.contextTypes && (a = S(n) || "Unknown", ub[a] || (ub[a] = !0, console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)", a)))), ai(t), n = Ta(e, t, n, r, void 0, i), r = ka(), e !== null && !sb ? (Aa(e, t, i), zs(e, t, i)) : (G && r && Ir(t), t.flags |= 1, ms(e, t, n, i), t.child);
		}
		function Es(e, t, n, r, i, a) {
			return ai(t), Iy = -1, Ly = e !== null && e.type !== t.type, t.updateQueue = null, n = Da(t, r, n, i), Ea(e, t), r = ka(), e !== null && !sb ? (Aa(e, t, a), zs(e, t, a)) : (G && r && Ir(t), t.flags |= 1, ms(e, t, n, a), t.child);
		}
		function Ds(e, t, n, r, i) {
			switch (u(t)) {
				case !1:
					var a = t.stateNode, o = new t.type(t.memoizedProps, a.context).state;
					a.updater.enqueueSetState(a, o, null);
					break;
				case !0:
					t.flags |= 128, t.flags |= 65536, a = Error("Simulated error coming from DevTools");
					var s = i & -i;
					if (t.lanes |= s, o = Gb, o === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
					s = ds(s), fs(s, o, t, Nr(a, t)), oa(t, s);
			}
			if (ai(t), t.stateNode === null) {
				if (o = Fg, a = n.contextType, "contextType" in n && a !== null && (a === void 0 || a.$$typeof !== Rf) && !tb.has(n) && (tb.add(n), s = a === void 0 ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof a == "object" ? a.$$typeof === Lf ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(a).join(", ") + "}." : " However, it is set to a " + typeof a + ".", console.error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", S(n) || "Component", s)), typeof a == "object" && a && (o = oi(a)), a = new n(r, o), t.mode & zg) {
					je(!0);
					try {
						a = new n(r, o);
					} finally {
						je(!1);
					}
				}
				if (o = t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = rb, t.stateNode = a, a._reactInternals = t, a._reactInternalInstance = Ky, typeof n.getDerivedStateFromProps == "function" && o === null && (o = S(n) || "Component", Jy.has(o) || (Jy.add(o), console.error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", o, a.state === null ? "null" : "undefined", o))), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function") {
					var c = s = o = null;
					if (typeof a.componentWillMount == "function" && !0 !== a.componentWillMount.__suppressDeprecationWarning ? o = "componentWillMount" : typeof a.UNSAFE_componentWillMount == "function" && (o = "UNSAFE_componentWillMount"), typeof a.componentWillReceiveProps == "function" && !0 !== a.componentWillReceiveProps.__suppressDeprecationWarning ? s = "componentWillReceiveProps" : typeof a.UNSAFE_componentWillReceiveProps == "function" && (s = "UNSAFE_componentWillReceiveProps"), typeof a.componentWillUpdate == "function" && !0 !== a.componentWillUpdate.__suppressDeprecationWarning ? c = "componentWillUpdate" : typeof a.UNSAFE_componentWillUpdate == "function" && (c = "UNSAFE_componentWillUpdate"), o !== null || s !== null || c !== null) {
						a = S(n) || "Component";
						var l = typeof n.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
						Xy.has(a) || (Xy.add(a), console.error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://react.dev/link/unsafe-component-lifecycles", a, l, o === null ? "" : "\n  " + o, s === null ? "" : "\n  " + s, c === null ? "" : "\n  " + c));
					}
				}
				a = t.stateNode, o = S(n) || "Component", a.render || (n.prototype && typeof n.prototype.render == "function" ? console.error("No `render` method found on the %s instance: did you accidentally return an object from the constructor?", o) : console.error("No `render` method found on the %s instance: you may have forgotten to define `render`.", o)), !a.getInitialState || a.getInitialState.isReactClassApproved || a.state || console.error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), a.getDefaultProps && !a.getDefaultProps.isReactClassApproved && console.error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), a.contextType && console.error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), n.childContextTypes && !eb.has(n) && (eb.add(n), console.error("%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)", o)), n.contextTypes && !$y.has(n) && ($y.add(n), console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)", o)), typeof a.componentShouldUpdate == "function" && console.error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), n.prototype && n.prototype.isPureReactComponent && a.shouldComponentUpdate !== void 0 && console.error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", S(n) || "A pure component"), typeof a.componentDidUnmount == "function" && console.error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof a.componentDidReceiveProps == "function" && console.error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof a.componentWillRecieveProps == "function" && console.error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof a.UNSAFE_componentWillRecieveProps == "function" && console.error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o), s = a.props !== r, a.props !== void 0 && s && console.error("When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o), a.defaultProps && console.error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof a.getSnapshotBeforeUpdate != "function" || typeof a.componentDidUpdate == "function" || Yy.has(n) || (Yy.add(n), console.error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", S(n))), typeof a.getDerivedStateFromProps == "function" && console.error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof a.getDerivedStateFromError == "function" && console.error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof n.getSnapshotBeforeUpdate == "function" && console.error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o), (s = a.state) && (typeof s != "object" || Jf(s)) && console.error("%s.state: must be set to an object or null", o), typeof a.getChildContext == "function" && typeof n.childContextTypes != "object" && console.error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o), a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, ta(t), o = n.contextType, a.context = typeof o == "object" && o ? oi(o) : Fg, a.state === r && (o = S(n) || "Component", Zy.has(o) || (Zy.add(o), console.error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", o))), t.mode & zg && uv.recordLegacyContextWarning(t, a), uv.recordUnsafeLifecycleWarnings(t, a), a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (ts(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && (console.error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", C(t) || "Component"), rb.enqueueReplaceState(a, a.state, null)), ca(t, r, a, i), sa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Bg) !== U && (t.flags |= 134217728), a = !0;
			} else if (e === null) {
				a = t.stateNode;
				var d = t.memoizedProps;
				s = is(n, d), a.props = s;
				var f = a.context;
				c = n.contextType, o = Fg, typeof c == "object" && c && (o = oi(c)), l = n.getDerivedStateFromProps, c = typeof l == "function" || typeof a.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, c || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (d || f !== o) && rs(t, a, r, o), ry = !1;
				var p = t.memoizedState;
				a.state = p, ca(t, r, a, i), sa(), f = t.memoizedState, d || p !== f || ry ? (typeof l == "function" && (ts(t, n, l, r), f = t.memoizedState), (s = ry || ns(t, n, s, r, p, f, o)) ? (c || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Bg) !== U && (t.flags |= 134217728)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Bg) !== U && (t.flags |= 134217728), t.memoizedProps = r, t.memoizedState = f), a.props = r, a.state = f, a.context = o, a = s) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Bg) !== U && (t.flags |= 134217728), a = !1);
			} else {
				a = t.stateNode, na(e, t), o = t.memoizedProps, c = is(n, o), a.props = c, l = t.pendingProps, p = a.context, f = n.contextType, s = Fg, typeof f == "object" && f && (s = oi(f)), d = n.getDerivedStateFromProps, (f = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== l || p !== s) && rs(t, a, r, s), ry = !1, p = t.memoizedState, a.state = p, ca(t, r, a, i), sa();
				var m = t.memoizedState;
				o !== l || p !== m || ry || e !== null && e.dependencies !== null && ii(e.dependencies) ? (typeof d == "function" && (ts(t, n, d, r), m = t.memoizedState), (c = ry || ns(t, n, c, r, p, m, s) || e !== null && e.dependencies !== null && ii(e.dependencies)) ? (f || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, m, s), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, m, s)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = m), a.props = r, a.state = m, a.context = s, a = c) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), a = !1);
			}
			if (s = a, ws(e, t), o = !!(t.flags & 128), s || o) {
				if (s = t.stateNode, we(t), o && typeof n.getDerivedStateFromError != "function") n = null, w_ = -1;
				else if (n = Cv(s), t.mode & zg) {
					je(!0);
					try {
						Cv(s);
					} finally {
						je(!1);
					}
				}
				t.flags |= 1, e !== null && o ? (t.child = Zv(t, e.child, null, i), t.child = Zv(t, null, n, i)) : ms(e, t, n, i), t.memoizedState = s.state, e = t.child;
			} else e = zs(e, t, i);
			return i = t.stateNode, a && i.props !== r && (fb || console.error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", C(t) || "a component"), fb = !0), e;
		}
		function Os(e, t, n, r) {
			return Jr(), t.flags |= 256, ms(e, t, n, r), t.child;
		}
		function ks(e, t) {
			t && t.childContextTypes && console.error("childContextTypes cannot be defined on a function component.\n  %s.childContextTypes = ...", t.displayName || t.name || "Component"), typeof t.getDerivedStateFromProps == "function" && (e = S(t) || "Unknown", db[e] || (console.error("%s: Function components do not support getDerivedStateFromProps.", e), db[e] = !0)), typeof t.contextType == "object" && t.contextType !== null && (t = S(t) || "Unknown", lb[t] || (console.error("%s: Function components do not support contextType.", t), lb[t] = !0));
		}
		function As(e) {
			return {
				baseLanes: e,
				cachePool: Ii()
			};
		}
		function js(e, t, n) {
			return e = e === null ? 0 : e.childLanes & ~n, t && (e |= fx), e;
		}
		function Ms(e, t, n) {
			var r, i = t.pendingProps;
			c(t) && (t.flags |= 128);
			var a = !1, o = !!(t.flags & 128);
			if ((r = o) || (r = e !== null && e.memoizedState === null ? !1 : (py.current & fy) !== 0), r && (a = !0, t.flags &= -129), r = !!(t.flags & 32), t.flags &= -33, e === null) {
				if (G) {
					if (a ? ha(t) : va(t), (e = e_) ? (n = hd(e, i_), n = n !== null && n.data !== AS ? n : null, n !== null && (r = {
						dehydrated: n,
						treeContext: Rr(),
						retryLane: 536870912,
						hydrationErrors: null
					}, t.memoizedState = r, r = jr(n), r.return = t, t.child = r, $g = t, e_ = null)) : n = null, n === null) throw Ur(t, e), Wr(t);
					return _d(n) ? t.lanes = 32 : t.lanes = 536870912, null;
				}
				var s = i.children;
				if (i = i.fallback, a) {
					va(t);
					var l = t.mode;
					return s = Ps({
						mode: "hidden",
						children: s
					}, l), i = kr(i, l, n, null), s.return = t, i.return = t, s.sibling = i, t.child = s, i = t.child, i.memoizedState = As(n), i.childLanes = js(e, r, n), t.memoizedState = hb, ys(null, i);
				}
				return ha(t), Ns(t, s);
			}
			var u = e.memoizedState;
			if (u !== null) {
				var d = u.dehydrated;
				if (d !== null) {
					if (o) t.flags & 256 ? (ha(t), t.flags &= -257, t = Fs(e, t, n)) : t.memoizedState === null ? (va(t), s = i.fallback, l = t.mode, i = Ps({
						mode: "visible",
						children: i.children
					}, l), s = kr(s, l, n, null), s.flags |= 2, i.return = t, s.return = t, i.sibling = s, t.child = i, Zv(t, e.child, null, n), i = t.child, i.memoizedState = As(n), i.childLanes = js(e, r, n), t.memoizedState = hb, t = ys(null, i)) : (va(t), t.child = e.child, t.flags |= 128, t = null);
					else if (ha(t), Hr(), n & 536870912 && yl(t), _d(d)) {
						if (r = d.nextSibling && d.nextSibling.dataset, r) {
							s = r.dgst;
							var f = r.msg;
							l = r.stck;
							var p = r.cstck;
						}
						a = f, r = s, i = l, d = p, s = a, l = d, s = Error(s || "The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering."), s.stack = i || "", s.digest = r, r = l === void 0 ? null : l, i = {
							value: s,
							source: null,
							stack: r
						}, typeof r == "string" && Ug.set(s, i), Xr(i), t = Fs(e, t, n);
					} else if (sb || ri(e, t, n, !1), r = (n & e.childLanes) !== 0, sb || r) {
						if (r = Gb, r !== null && (i = Ue(r, n), i !== 0 && i !== u.retryLane)) throw u.retryLane = i, hr(e, i), ol(r, e, i), ob;
						gd(d) || bl(), t = Fs(e, t, n);
					} else gd(d) ? (t.flags |= 192, t.child = e.child, t = null) : (e = u.treeContext, e_ = yd(d.nextSibling), $g = t, G = !0, r_ = null, t_ = !1, n_ = null, i_ = !1, e !== null && zr(t, e), t = Ns(t, i.children), t.flags |= 4096);
					return t;
				}
			}
			return a ? (va(t), s = i.fallback, l = t.mode, p = e.child, d = p.sibling, i = Tr(p, {
				mode: "hidden",
				children: i.children
			}), i.subtreeFlags = p.subtreeFlags & 65011712, d === null ? (s = kr(s, l, n, null), s.flags |= 2) : s = Tr(d, s), s.return = t, i.return = t, i.sibling = s, t.child = i, ys(null, i), i = t.child, s = e.child.memoizedState, s === null ? s = As(n) : (l = s.cachePool, l === null ? l = Ii() : (p = h_._currentValue, l = l.parent === p ? l : {
				parent: p,
				pool: p
			}), s = {
				baseLanes: s.baseLanes | n,
				cachePool: l
			}), i.memoizedState = s, i.childLanes = js(e, r, n), t.memoizedState = hb, ys(e.child, i)) : (u !== null && (n & 62914560) === n && (n & e.lanes) !== 0 && yl(t), ha(t), n = e.child, e = n.sibling, n = Tr(n, {
				mode: "visible",
				children: i.children
			}), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n);
		}
		function Ns(e, t) {
			return t = Ps({
				mode: "visible",
				children: t
			}, e.mode), t.return = e, e.child = t;
		}
		function Ps(e, t) {
			return e = g(22, e, null, t), e.lanes = 0, e;
		}
		function Fs(e, t, n) {
			return Zv(t, e.child, null, n), e = Ns(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
		}
		function Is(e, t, n) {
			e.lanes |= t;
			var r = e.alternate;
			r !== null && (r.lanes |= t), ti(e.return, t, n);
		}
		function Ls(e, t, n, r, i, a) {
			var o = e.memoizedState;
			o === null ? e.memoizedState = {
				isBackwards: t,
				rendering: null,
				renderingStartTime: 0,
				last: r,
				tail: n,
				tailMode: i,
				treeForkCount: a
			} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
		}
		function Rs(e, t, n) {
			var r = t.pendingProps, i = r.revealOrder, a = r.tail, o = r.children, s = py.current;
			if ((r = (s & fy) !== 0) ? (s = s & dy | fy, t.flags |= 128) : s &= dy, w(py, s, t), s = i ?? "null", i !== "forwards" && i !== "unstable_legacy-backwards" && i !== "together" && i !== "independent" && !pb[s]) {
				if (pb[s] = !0, i == null) console.error("The default for the <SuspenseList revealOrder=\"...\"> prop is changing. To be future compatible you must explictly specify either \"independent\" (the current default), \"together\", \"forwards\" or \"legacy_unstable-backwards\".");
				else if (i === "backwards") console.error("The rendering order of <SuspenseList revealOrder=\"backwards\"> is changing. To be future compatible you must specify revealOrder=\"legacy_unstable-backwards\" instead.");
				else if (typeof i == "string") switch (i.toLowerCase()) {
					case "together":
					case "forwards":
					case "backwards":
					case "independent":
						console.error("\"%s\" is not a valid value for revealOrder on <SuspenseList />. Use lowercase \"%s\" instead.", i, i.toLowerCase());
						break;
					case "forward":
					case "backward":
						console.error("\"%s\" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use \"%ss\" instead.", i, i.toLowerCase());
						break;
					default: console.error("\"%s\" is not a supported revealOrder on <SuspenseList />. Did you mean \"independent\", \"together\", \"forwards\" or \"backwards\"?", i);
				}
				else console.error("%s is not a supported value for revealOrder on <SuspenseList />. Did you mean \"independent\", \"together\", \"forwards\" or \"backwards\"?", i);
			}
			s = a ?? "null", mb[s] || (a == null ? (i === "forwards" || i === "backwards" || i === "unstable_legacy-backwards") && (mb[s] = !0, console.error("The default for the <SuspenseList tail=\"...\"> prop is changing. To be future compatible you must explictly specify either \"visible\" (the current default), \"collapsed\" or \"hidden\".")) : a !== "visible" && a !== "collapsed" && a !== "hidden" ? (mb[s] = !0, console.error("\"%s\" is not a supported value for tail on <SuspenseList />. Did you mean \"visible\", \"collapsed\" or \"hidden\"?", a)) : i !== "forwards" && i !== "backwards" && i !== "unstable_legacy-backwards" && (mb[s] = !0, console.error("<SuspenseList tail=\"%s\" /> is only valid if revealOrder is \"forwards\" or \"backwards\". Did you mean to specify revealOrder=\"forwards\"?", a)));
			a: if ((i === "forwards" || i === "backwards" || i === "unstable_legacy-backwards") && o != null && !1 !== o) {
				if (Jf(o)) {
					for (s = 0; s < o.length; s++) if (!ea(o[s], s)) break a;
				} else if (s = ae(o), typeof s == "function") {
					if (s = s.call(o)) for (var c = s.next(), l = 0; !c.done; c = s.next()) {
						if (!ea(c.value, l)) break a;
						l++;
					}
				} else console.error("A single row was passed to a <SuspenseList revealOrder=\"%s\" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?", i);
			}
			if (ms(e, t, o, n), G ? (Br(), o = qg) : o = 0, !r && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
				if (e.tag === 13) e.memoizedState !== null && Is(e, n, t);
				else if (e.tag === 19) Is(e, n, t);
				else if (e.child !== null) {
					e.child.return = e, e = e.child;
					continue;
				}
				if (e === t) break a;
				for (; e.sibling === null;) {
					if (e.return === null || e.return === t) break a;
					e = e.return;
				}
				e.sibling.return = e.return, e = e.sibling;
			}
			switch (i) {
				case "forwards":
					for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && ba(e) === null && (i = n), n = n.sibling;
					n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Ls(t, !1, i, n, a, o);
					break;
				case "backwards":
				case "unstable_legacy-backwards":
					for (n = null, i = t.child, t.child = null; i !== null;) {
						if (e = i.alternate, e !== null && ba(e) === null) {
							t.child = i;
							break;
						}
						e = i.sibling, i.sibling = n, n = i, i = e;
					}
					Ls(t, !0, n, null, a, o);
					break;
				case "together":
					Ls(t, !1, null, null, void 0, o);
					break;
				default: t.memoizedState = null;
			}
			return t.child;
		}
		function zs(e, t, n) {
			if (e !== null && (t.dependencies = e.dependencies), w_ = -1, lx |= t.lanes, (n & t.childLanes) === 0) {
				if (e !== null) {
					if (ri(e, t, n, !1), (n & t.childLanes) === 0) return null;
				} else return null;
			}
			if (e !== null && t.child !== e.child) throw Error("Resuming work not yet implemented.");
			if (t.child !== null) {
				for (e = t.child, n = Tr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Tr(e, e.pendingProps), n.return = t;
				n.sibling = null;
			}
			return t.child;
		}
		function Bs(e, t) {
			return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ii(e)));
		}
		function Vs(e, t, n) {
			switch (t.tag) {
				case 3:
					ue(t, t.stateNode.containerInfo), $r(t, h_, e.memoizedState.cache), Jr();
					break;
				case 27:
				case 5:
					de(t);
					break;
				case 4:
					ue(t, t.stateNode.containerInfo);
					break;
				case 10:
					$r(t, t.type, t.memoizedProps.value);
					break;
				case 12:
					(n & t.childLanes) !== 0 && (t.flags |= 4), t.flags |= 2048;
					var r = t.stateNode;
					r.effectDuration = -0, r.passiveEffectDuration = -0;
					break;
				case 31:
					if (t.memoizedState !== null) return t.flags |= 128, ga(t), null;
					break;
				case 13:
					if (r = t.memoizedState, r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (ha(t), e = zs(e, t, n), e === null ? null : e.sibling) : Ms(e, t, n) : (ha(t), t.flags |= 128, null);
					ha(t);
					break;
				case 19:
					var i = !!(e.flags & 128);
					if (r = (n & t.childLanes) !== 0, r ||= (ri(e, t, n, !1), (n & t.childLanes) !== 0), i) {
						if (r) return Rs(e, t, n);
						t.flags |= 128;
					}
					if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), w(py, py.current, t), r) break;
					return null;
				case 22: return t.lanes = 0, vs(e, t, n, t.pendingProps);
				case 24: $r(t, h_, e.memoizedState.cache);
			}
			return zs(e, t, n);
		}
		function Hs(e, t, n) {
			if (t._debugNeedsRemount && e !== null) {
				n = Dr(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes), n._debugStack = t._debugStack, n._debugTask = t._debugTask;
				var r = t.return;
				if (r === null) throw Error("Cannot swap the root fiber.");
				if (e.alternate = null, t.alternate = null, n.index = t.index, n.sibling = t.sibling, n.return = t.return, n.ref = t.ref, n._debugInfo = t._debugInfo, t === r.child) r.child = n;
				else {
					var i = r.child;
					if (i === null) throw Error("Expected parent to have a child.");
					for (; i.sibling !== t;) if (i = i.sibling, i === null) throw Error("Expected to find the previous sibling.");
					i.sibling = n;
				}
				return t = r.deletions, t === null ? (r.deletions = [e], r.flags |= 16) : t.push(e), n.flags |= 2, n;
			}
			if (e !== null) {
				if (e.memoizedProps !== t.pendingProps || t.type !== e.type) sb = !0;
				else {
					if (!Bs(e, n) && !(t.flags & 128)) return sb = !1, Vs(e, t, n);
					sb = !!(e.flags & 131072);
				}
			} else sb = !1, (r = G) && (Br(), r = !!(t.flags & 1048576)), r && (r = t.index, Br(), Fr(t, qg, r));
			switch (t.lanes = 0, t.tag) {
				case 16:
					a: if (r = t.pendingProps, e = Bi(t.elementType), t.type = e, typeof e == "function") wr(e) ? (r = is(e, r), t.tag = 1, t.type = e = vr(e), t = Ds(null, t, e, r, n)) : (t.tag = 0, ks(t, e), t.type = e = vr(e), t = Ts(null, t, e, r, n));
					else {
						if (e != null) {
							if (i = e.$$typeof, i === zf) {
								t.tag = 11, t.type = e = yr(e), t = hs(null, t, e, r, n);
								break a;
							}
							if (i === Hf) {
								t.tag = 14, t = gs(null, t, e, r, n);
								break a;
							}
						}
						throw t = "", typeof e == "object" && e && e.$$typeof === Uf && (t = " Did you wrap a component in React.lazy() more than once?"), n = S(e) || e, Error("Element type is invalid. Received a promise that resolves to: " + n + ". Lazy element type must resolve to a class or function." + t);
					}
					return t;
				case 0: return Ts(e, t, t.type, t.pendingProps, n);
				case 1: return r = t.type, i = is(r, t.pendingProps), Ds(e, t, r, i, n);
				case 3:
					a: {
						if (ue(t, t.stateNode.containerInfo), e === null) throw Error("Should have a current fiber. This is a bug in React.");
						r = t.pendingProps;
						var a = t.memoizedState;
						i = a.element, na(e, t), ca(t, r, null, n);
						var o = t.memoizedState;
						if (r = o.cache, $r(t, h_, r), r !== a.cache && ni(t, [h_], n, !0), sa(), r = o.element, a.isDehydrated) {
							if (a = {
								element: r,
								isDehydrated: !1,
								cache: o.cache
							}, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
								t = Os(e, t, r, n);
								break a;
							}
							if (r !== i) {
								i = Nr(Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t), Xr(i), t = Os(e, t, r, n);
								break a;
							}
							switch (e = t.stateNode.containerInfo, e.nodeType) {
								case 9:
									e = e.body;
									break;
								default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
							}
							for (e_ = yd(e.firstChild), $g = t, G = !0, r_ = null, t_ = !1, n_ = null, i_ = !0, n = Qv(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
						} else {
							if (Jr(), r === i) {
								t = zs(e, t, n);
								break a;
							}
							ms(e, t, r, n);
						}
						t = t.child;
					}
					return t;
				case 26: return ws(e, t), e === null ? (n = Md(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : G || (n = t.type, e = t.pendingProps, r = le(np.current), r = Vu(r).createElement(n), r[qp] = t, r[Jp] = e, Du(r, n, e), tt(r), t.stateNode = r) : t.memoizedState = Md(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
				case 27: return de(t), e === null && G && (r = le(np.current), i = E(), r = t.stateNode = Dd(t.type, t.pendingProps, r, i, !1), t_ || (i = Lu(r, t.type, t.pendingProps, i), i !== null && (Vr(t, 0).serverProps = i)), $g = t, i_ = !0, i = e_, td(t.type) ? (rC = i, e_ = yd(r.firstChild)) : e_ = i), ms(e, t, t.pendingProps.children, n), ws(e, t), e === null && (t.flags |= 4194304), t.child;
				case 5: return e === null && G && (a = E(), r = Yt(t.type, a.ancestorInfo), i = e_, (o = !i) || (o = pd(i, t.type, t.pendingProps, i_), o === null ? a = !1 : (t.stateNode = o, t_ || (a = Lu(o, t.type, t.pendingProps, a), a !== null && (Vr(t, 0).serverProps = a)), $g = t, e_ = yd(o.firstChild), i_ = !1, a = !0), o = !a), o && (r && Ur(t, i), Wr(t))), de(t), i = t.type, a = t.pendingProps, o = e === null ? null : e.memoizedProps, r = a.children, Wu(i, a) ? r = null : o !== null && Wu(i, o) && (t.flags |= 32), t.memoizedState !== null && (i = Ta(e, t, Oa, null, null, n), xC._currentValue = i), ws(e, t), ms(e, t, r, n), t.child;
				case 6: return e === null && G && (n = t.pendingProps, e = E(), r = e.ancestorInfo.current, n = r == null || Xt(n, r.tag, e.ancestorInfo.implicitRootScope), e = e_, (r = !e) || (r = md(e, t.pendingProps, i_), r === null ? r = !1 : (t.stateNode = r, $g = t, e_ = null, r = !0), r = !r), r && (n && Ur(t, e), Wr(t))), null;
				case 13: return Ms(e, t, n);
				case 4: return ue(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Zv(t, null, r, n) : ms(e, t, r, n), t.child;
				case 11: return hs(e, t, t.type, t.pendingProps, n);
				case 7: return ms(e, t, t.pendingProps, n), t.child;
				case 8: return ms(e, t, t.pendingProps.children, n), t.child;
				case 12: return t.flags |= 4, t.flags |= 2048, r = t.stateNode, r.effectDuration = -0, r.passiveEffectDuration = -0, ms(e, t, t.pendingProps.children, n), t.child;
				case 10: return r = t.type, i = t.pendingProps, a = i.value, "value" in i || gb || (gb = !0, console.error("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?")), $r(t, r, a), ms(e, t, i.children, n), t.child;
				case 9: return i = t.type._context, r = t.pendingProps.children, typeof r != "function" && console.error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), ai(t), i = oi(i), r = xv(r, i, void 0), t.flags |= 1, ms(e, t, r, n), t.child;
				case 14: return gs(e, t, t.type, t.pendingProps, n);
				case 15: return _s(e, t, t.type, t.pendingProps, n);
				case 19: return Rs(e, t, n);
				case 31: return Cs(e, t, n);
				case 22: return vs(e, t, n, t.pendingProps);
				case 24: return ai(t), r = oi(h_), e === null ? (i = Pi(), i === null && (i = Gb, a = li(), i.pooledCache = a, ui(a), a !== null && (i.pooledCacheLanes |= n), i = a), t.memoizedState = {
					parent: r,
					cache: i
				}, ta(t), $r(t, h_, i)) : ((e.lanes & n) !== 0 && (na(e, t), ca(t, null, null, n), sa()), i = e.memoizedState, a = t.memoizedState, i.parent === r ? (r = a.cache, $r(t, h_, r), r !== i.cache && ni(t, [h_], n, !0)) : (i = {
					parent: r,
					cache: r
				}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), $r(t, h_, r))), ms(e, t, t.pendingProps.children, n), t.child;
				case 29: throw t.pendingProps;
			}
			throw Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
		}
		function Us(e) {
			e.flags |= 4;
		}
		function Ws(e, t, n, r, i) {
			if ((t = (e.mode & Vg) !== U) && (t = !1), t) {
				if (e.flags |= 16777216, (i & 335544128) === i) {
					if (e.stateNode.complete) e.flags |= 8192;
					else if (gl()) e.flags |= 8192;
					else throw Hv = Vv, zv;
				}
			} else e.flags &= -16777217;
		}
		function Gs(e, t) {
			if (t.type !== "stylesheet" || (t.state.loading & cC) !== iC) e.flags &= -16777217;
			else if (e.flags |= 16777216, !Kd(t)) {
				if (gl()) e.flags |= 8192;
				else throw Hv = Vv, zv;
			}
		}
		function Ks(e, t) {
			t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Le(), e.lanes |= t, px |= t);
		}
		function qs(e, t) {
			if (!G) switch (e.tailMode) {
				case "hidden":
					t = e.tail;
					for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
					n === null ? e.tail = null : n.sibling = null;
					break;
				case "collapsed":
					n = e.tail;
					for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
					r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
			}
		}
		function Js(e) {
			var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
			if (t) {
				if ((e.mode & W) !== U) {
					for (var i = e.selfBaseDuration, a = e.child; a !== null;) n |= a.lanes | a.childLanes, r |= a.subtreeFlags & 65011712, r |= a.flags & 65011712, i += a.treeBaseDuration, a = a.sibling;
					e.treeBaseDuration = i;
				} else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
			} else if ((e.mode & W) !== U) {
				i = e.actualDuration, a = e.selfBaseDuration;
				for (var o = e.child; o !== null;) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, i += o.actualDuration, a += o.treeBaseDuration, o = o.sibling;
				e.actualDuration = i, e.treeBaseDuration = a;
			} else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
			return e.subtreeFlags |= r, e.childLanes = n, t;
		}
		function Ys(e, t, n) {
			var r = t.pendingProps;
			switch (Lr(t), t.tag) {
				case 16:
				case 15:
				case 0:
				case 11:
				case 7:
				case 8:
				case 12:
				case 9:
				case 14: return Js(t), null;
				case 1: return Js(t), null;
				case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ei(h_, t), T(t), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (qr(t) ? (Zr(), Us(t)) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Yr())), Js(t), null;
				case 26:
					var i = t.type, a = t.memoizedState;
					return e === null ? (Us(t), a === null ? (Js(t), Ws(t, i, null, r, n)) : (Js(t), Gs(t, a))) : a ? a === e.memoizedState ? (Js(t), t.flags &= -16777217) : (Us(t), Js(t), Gs(t, a)) : (e = e.memoizedProps, e !== r && Us(t), Js(t), Ws(t, i, e, r, n)), null;
				case 27:
					if (fe(t), n = le(np.current), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Us(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
							return Js(t), null;
						}
						e = E(), qr(t) ? Gr(t, e) : (e = Dd(i, r, n, e, !0), t.stateNode = e, Us(t));
					}
					return Js(t), null;
				case 5:
					if (fe(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Us(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
							return Js(t), null;
						}
						var o = E();
						if (qr(t)) Gr(t, o);
						else {
							switch (a = le(np.current), Yt(i, o.ancestorInfo), o = o.context, a = Vu(a), o) {
								case GS:
									a = a.createElementNS(Lm, i);
									break;
								case KS:
									a = a.createElementNS(Im, i);
									break;
								default: switch (i) {
									case "svg":
										a = a.createElementNS(Lm, i);
										break;
									case "math":
										a = a.createElementNS(Im, i);
										break;
									case "script":
										a = a.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild);
										break;
									case "select":
										a = typeof r.is == "string" ? a.createElement("select", { is: r.is }) : a.createElement("select"), r.multiple ? a.multiple = !0 : r.size && (a.size = r.size);
										break;
									default: a = typeof r.is == "string" ? a.createElement(i, { is: r.is }) : a.createElement(i), i.indexOf("-") === -1 && (i !== i.toLowerCase() && console.error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", i), Object.prototype.toString.call(a) !== "[object HTMLUnknownElement]" || vp.call(YS, i) || (YS[i] = !0, console.error("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", i)));
								}
							}
							a[qp] = t, a[Jp] = r;
							a: for (o = t.child; o !== null;) {
								if (o.tag === 5 || o.tag === 6) a.appendChild(o.stateNode);
								else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
									o.child.return = o, o = o.child;
									continue;
								}
								if (o === t) break a;
								for (; o.sibling === null;) {
									if (o.return === null || o.return === t) break a;
									o = o.return;
								}
								o.sibling.return = o.return, o = o.sibling;
							}
							t.stateNode = a;
							a: switch (Du(a, i, r), i) {
								case "button":
								case "input":
								case "select":
								case "textarea":
									r = !!r.autoFocus;
									break a;
								case "img":
									r = !0;
									break a;
								default: r = !1;
							}
							r && Us(t);
						}
					}
					return Js(t), Ws(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
				case 6:
					if (e && t.stateNode != null) e.memoizedProps !== r && Us(t);
					else {
						if (typeof r != "string" && t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
						if (e = le(np.current), n = E(), qr(t)) {
							if (e = t.stateNode, n = t.memoizedProps, i = !t_, r = null, a = $g, a !== null) switch (a.tag) {
								case 3:
									i && (i = xd(e, n, r), i !== null && (Vr(t, 0).serverProps = i));
									break;
								case 27:
								case 5: r = a.memoizedProps, i && (i = xd(e, n, r), i !== null && (Vr(t, 0).serverProps = i));
							}
							e[qp] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || wu(e.nodeValue, n)), e || Wr(t, !0);
						} else i = n.ancestorInfo.current, i != null && Xt(r, i.tag, n.ancestorInfo.implicitRootScope), e = Vu(e).createTextNode(r), e[qp] = t, t.stateNode = e;
					}
					return Js(t), null;
				case 31:
					if (n = t.memoizedState, e === null || e.memoizedState !== null) {
						if (r = qr(t), n !== null) {
							if (e === null) {
								if (!r) throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
								if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated activity instance. This error is likely caused by a bug in React. Please file an issue.");
								e[qp] = t, Js(t), (t.mode & W) !== U && n !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
							} else Zr(), Jr(), !(t.flags & 128) && (n = t.memoizedState = null), t.flags |= 4, Js(t), (t.mode & W) !== U && n !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
							e = !1;
						} else n = Yr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
						if (!e) return t.flags & 256 ? (ya(t), t) : (ya(t), null);
						if (t.flags & 128) throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
					}
					return Js(t), null;
				case 13:
					if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
						if (i = r, a = qr(t), i !== null && i.dehydrated !== null) {
							if (e === null) {
								if (!a) throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
								if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
								a[qp] = t, Js(t), (t.mode & W) !== U && i !== null && (i = t.child, i !== null && (t.treeBaseDuration -= i.treeBaseDuration));
							} else Zr(), Jr(), !(t.flags & 128) && (i = t.memoizedState = null), t.flags |= 4, Js(t), (t.mode & W) !== U && i !== null && (i = t.child, i !== null && (t.treeBaseDuration -= i.treeBaseDuration));
							i = !1;
						} else i = Yr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
						if (!i) return t.flags & 256 ? (ya(t), t) : (ya(t), null);
					}
					return ya(t), t.flags & 128 ? (t.lanes = n, (t.mode & W) !== U && Ai(t), t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), a = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (a = r.memoizedState.cachePool.pool), a !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Ks(t, t.updateQueue), Js(t), (t.mode & W) !== U && n && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration)), null);
				case 4: return T(t), e === null && du(t.stateNode.containerInfo), Js(t), null;
				case 10: return ei(t.type, t), Js(t), null;
				case 19:
					if (ce(py, t), r = t.memoizedState, r === null) return Js(t), null;
					if (i = !!(t.flags & 128), a = r.rendering, a === null) {
						if (i) qs(r, !1);
						else {
							if (cx !== Lb || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
								if (a = ba(e), a !== null) {
									for (t.flags |= 128, qs(r, !1), e = a.updateQueue, t.updateQueue = e, Ks(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Er(n, e), n = n.sibling;
									return w(py, py.current & dy | fy, t), G && Pr(t, r.treeForkCount), t.child;
								}
								e = e.sibling;
							}
							r.tail !== null && Cp() > bx && (t.flags |= 128, i = !0, qs(r, !1), t.lanes = 4194304);
						}
					} else {
						if (!i) {
							if (e = ba(a), e !== null) {
								if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Ks(t, e), qs(r, !0), r.tail === null && r.tailMode === "hidden" && !a.alternate && !G) return Js(t), null;
							} else 2 * Cp() - r.renderingStartTime > bx && n !== 536870912 && (t.flags |= 128, i = !0, qs(r, !1), t.lanes = 4194304);
						}
						r.isBackwards ? (a.sibling = t.child, t.child = a) : (e = r.last, e === null ? t.child = a : e.sibling = a, r.last = a);
					}
					return r.tail === null ? (Js(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Cp(), e.sibling = null, n = py.current, n = i ? n & dy | fy : n & dy, w(py, n, t), G && Pr(t, r.treeForkCount), e);
				case 22:
				case 23: return ya(t), ma(t), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Js(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Js(t), n = t.updateQueue, n !== null && Ks(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ce(lv, t), null;
				case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ei(h_, t), Js(t), null;
				case 25: return null;
				case 30: return null;
			}
			throw Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
		}
		function Xs(e, t) {
			switch (Lr(t), t.tag) {
				case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & W) !== U && Ai(t), t) : null;
				case 3: return ei(h_, t), T(t), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
				case 26:
				case 27:
				case 5: return fe(t), null;
				case 31:
					if (t.memoizedState !== null) {
						if (ya(t), t.alternate === null) throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
						Jr();
					}
					return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & W) !== U && Ai(t), t) : null;
				case 13:
					if (ya(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
						if (t.alternate === null) throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
						Jr();
					}
					return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & W) !== U && Ai(t), t) : null;
				case 19: return ce(py, t), null;
				case 4: return T(t), null;
				case 10: return ei(t.type, t), null;
				case 22:
				case 23: return ya(t), ma(t), e !== null && ce(lv, t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & W) !== U && Ai(t), t) : null;
				case 24: return ei(h_, t), null;
				case 25: return null;
				default: return null;
			}
		}
		function Zs(e, t) {
			switch (Lr(t), t.tag) {
				case 3:
					ei(h_, t), T(t);
					break;
				case 26:
				case 27:
				case 5:
					fe(t);
					break;
				case 4:
					T(t);
					break;
				case 31:
					t.memoizedState !== null && ya(t);
					break;
				case 13:
					ya(t);
					break;
				case 19:
					ce(py, t);
					break;
				case 10:
					ei(t.type, t);
					break;
				case 22:
				case 23:
					ya(t), ma(t), e !== null && ce(lv, t);
					break;
				case 24: ei(h_, t);
			}
		}
		function Qs(e) {
			return (e.mode & W) !== U;
		}
		function $s(e, t) {
			Qs(e) ? (ki(), tc(t, e), Di()) : tc(t, e);
		}
		function ec(e, t, n) {
			Qs(e) ? (ki(), nc(n, e, t), Di()) : nc(n, e, t);
		}
		function tc(e, t) {
			try {
				var n = t.updateQueue, r = n === null ? null : n.lastEffect;
				if (r !== null) {
					var i = r.next;
					n = i;
					do {
						if ((n.tag & e) === e && (r = void 0, (e & gy) !== my && (eS = !0), r = D(t, Nv, n), (e & gy) !== my && (eS = !1), r !== void 0 && typeof r != "function")) {
							var a = void 0;
							a = (n.tag & _y) === 0 ? (n.tag & gy) === 0 ? "useEffect" : "useInsertionEffect" : "useLayoutEffect";
							var o = void 0;
							o = r === null ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof r.then == "function" ? "\n\nIt looks like you wrote " + a + "(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:\n\n" + a + "(() => {\n  async function fetchData() {\n    // You can await here\n    const response = await MyAPI.getData(someId);\n    // ...\n  }\n  fetchData();\n}, [someId]); // Or [] if effect doesn't need props or state\n\nLearn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching" : " You returned: " + r, D(t, function(e, t) {
								console.error("%s must not return anything besides a function, which is used for clean-up.%s", e, t);
							}, a, o);
						}
						n = n.next;
					} while (n !== i);
				}
			} catch (e) {
				N(t, t.return, e);
			}
		}
		function nc(e, t, n) {
			try {
				var r = t.updateQueue, i = r === null ? null : r.lastEffect;
				if (i !== null) {
					var a = i.next;
					r = a;
					do {
						if ((r.tag & e) === e) {
							var o = r.inst, s = o.destroy;
							s !== void 0 && (o.destroy = void 0, (e & gy) !== my && (eS = !0), i = t, D(i, Fv, i, n, s), (e & gy) !== my && (eS = !1));
						}
						r = r.next;
					} while (r !== a);
				}
			} catch (e) {
				N(t, t.return, e);
			}
		}
		function rc(e, t) {
			Qs(e) ? (ki(), tc(t, e), Di()) : tc(t, e);
		}
		function ic(e, t, n) {
			Qs(e) ? (ki(), nc(n, e, t), Di()) : nc(n, e, t);
		}
		function ac(e) {
			var t = e.updateQueue;
			if (t !== null) {
				var n = e.stateNode;
				e.type.defaultProps || "ref" in e.memoizedProps || fb || (n.props !== e.memoizedProps && console.error("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", C(e) || "instance"), n.state !== e.memoizedState && console.error("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", C(e) || "instance"));
				try {
					D(e, da, t, n);
				} catch (t) {
					N(e, e.return, t);
				}
			}
		}
		function oc(e, t, n) {
			return e.getSnapshotBeforeUpdate(t, n);
		}
		function sc(e, t) {
			var n = t.memoizedProps, r = t.memoizedState;
			t = e.stateNode, e.type.defaultProps || "ref" in e.memoizedProps || fb || (t.props !== e.memoizedProps && console.error("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", C(e) || "instance"), t.state !== e.memoizedState && console.error("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", C(e) || "instance"));
			try {
				var i = is(e.type, n), a = D(e, oc, t, i, r);
				n = _b, a !== void 0 || n.has(e.type) || (n.add(e.type), D(e, function() {
					console.error("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", C(e));
				})), t.__reactInternalSnapshotBeforeUpdate = a;
			} catch (t) {
				N(e, e.return, t);
			}
		}
		function cc(e, t, n) {
			n.props = is(e.type, e.memoizedProps), n.state = e.memoizedState, Qs(e) ? (ki(), D(e, jv, e, t, n), Di()) : D(e, jv, e, t, n);
		}
		function lc(e) {
			var t = e.ref;
			if (t !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var n = e.stateNode;
						break;
					case 30:
						n = e.stateNode;
						break;
					default: n = e.stateNode;
				}
				if (typeof t == "function") {
					if (Qs(e)) try {
						ki(), e.refCleanup = t(n);
					} finally {
						Di();
					}
					else e.refCleanup = t(n);
				} else typeof t == "string" ? console.error("String refs are no longer supported.") : t.hasOwnProperty("current") || console.error("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", C(e)), t.current = n;
			}
		}
		function uc(e, t) {
			try {
				D(e, lc, e);
			} catch (n) {
				N(e, t, n);
			}
		}
		function dc(e, t) {
			var n = e.ref, r = e.refCleanup;
			if (n !== null) {
				if (typeof r == "function") try {
					if (Qs(e)) try {
						ki(), D(e, r);
					} finally {
						Di(e);
					}
					else D(e, r);
				} catch (n) {
					N(e, t, n);
				} finally {
					e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
				}
				else if (typeof n == "function") try {
					if (Qs(e)) try {
						ki(), D(e, n, null);
					} finally {
						Di(e);
					}
					else D(e, n, null);
				} catch (n) {
					N(e, t, n);
				}
				else n.current = null;
			}
		}
		function fc(e, t, n, r) {
			var i = e.memoizedProps, a = i.id, o = i.onCommit;
			i = i.onRender, t = t === null ? "mount" : "update", nv && (t = "nested-update"), typeof i == "function" && i(a, t, e.actualDuration, e.treeBaseDuration, e.actualStartTime, n), typeof o == "function" && o(a, t, r, n);
		}
		function pc(e, t, n, r) {
			var i = e.memoizedProps;
			e = i.id, i = i.onPostCommit, t = t === null ? "mount" : "update", nv && (t = "nested-update"), typeof i == "function" && i(e, t, r, n);
		}
		function mc(e) {
			var t = e.type, n = e.memoizedProps, r = e.stateNode;
			try {
				D(e, Yu, r, t, n, e);
			} catch (t) {
				N(e, e.return, t);
			}
		}
		function hc(e, t, n) {
			try {
				D(e, Zu, e.stateNode, e.type, n, t, e);
			} catch (t) {
				N(e, e.return, t);
			}
		}
		function gc(e) {
			return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && td(e.type) || e.tag === 4;
		}
		function _c(e) {
			a: for (;;) {
				for (; e.sibling === null;) {
					if (e.return === null || gc(e.return)) return null;
					e = e.return;
				}
				for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
					if (e.tag === 27 && td(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
					e.child.return = e, e = e.child;
				}
				if (!(e.flags & 2)) return e.stateNode;
			}
		}
		function vc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6) e = e.stateNode, t ? (ed(n), (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t)) : (ed(n), t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ln));
			else if (r !== 4 && (r === 27 && td(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (vc(e, t, n), e = e.sibling; e !== null;) vc(e, t, n), e = e.sibling;
		}
		function yc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
			else if (r !== 4 && (r === 27 && td(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (yc(e, t, n), e = e.sibling; e !== null;) yc(e, t, n), e = e.sibling;
		}
		function bc(e) {
			for (var t, n = e.return; n !== null;) {
				if (gc(n)) {
					t = n;
					break;
				}
				n = n.return;
			}
			if (t == null) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
			switch (t.tag) {
				case 27:
					t = t.stateNode, n = _c(e), yc(e, n, t);
					break;
				case 5:
					n = t.stateNode, t.flags & 32 && (Qu(n), t.flags &= -33), t = _c(e), yc(e, t, n);
					break;
				case 3:
				case 4:
					t = t.stateNode.containerInfo, n = _c(e), vc(e, n, t);
					break;
				default: throw Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
			}
		}
		function xc(e) {
			var t = e.stateNode, n = e.memoizedProps;
			try {
				D(e, Od, e.type, n, t, e);
			} catch (t) {
				N(e, e.return, t);
			}
		}
		function Sc(e, t) {
			return t.tag === 31 ? (t = t.memoizedState, e.memoizedState !== null && t === null) : t.tag === 13 ? (e = e.memoizedState, t = t.memoizedState, e !== null && e.dehydrated !== null && (t === null || t.dehydrated === null)) : t.tag === 3 && e.memoizedState.isDehydrated && !(t.flags & 256);
		}
		function Cc(e, t) {
			if (e = e.containerInfo, qS = RC, e = Hn(e), Un(e)) {
				if ("selectionStart" in e) var n = {
					start: e.selectionStart,
					end: e.selectionEnd
				};
				else a: {
					n = (n = e.ownerDocument) && n.defaultView || window;
					var r = n.getSelection && n.getSelection();
					if (r && r.rangeCount !== 0) {
						n = r.anchorNode;
						var i = r.anchorOffset, a = r.focusNode;
						r = r.focusOffset;
						try {
							n.nodeType, a.nodeType;
						} catch {
							n = null;
							break a;
						}
						var o = 0, s = -1, c = -1, l = 0, u = 0, d = e, f = null;
						b: for (;;) {
							for (var p; d !== n || i !== 0 && d.nodeType !== 3 || (s = o + i), d !== a || r !== 0 && d.nodeType !== 3 || (c = o + r), d.nodeType === 3 && (o += d.nodeValue.length), (p = d.firstChild) !== null;) f = d, d = p;
							for (;;) {
								if (d === e) break b;
								if (f === n && ++l === i && (s = o), f === a && ++u === r && (c = o), (p = d.nextSibling) !== null) break;
								d = f, f = d.parentNode;
							}
							d = p;
						}
						n = s === -1 || c === -1 ? null : {
							start: s,
							end: c
						};
					} else n = null;
				}
				n ||= {
					start: 0,
					end: 0
				};
			} else n = null;
			for (JS = {
				focusedElem: e,
				selectionRange: n
			}, RC = !1, Sb = t; Sb !== null;) if (t = Sb, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, Sb = e;
			else for (; Sb !== null;) {
				switch (e = t = Sb, n = e.alternate, i = e.flags, e.tag) {
					case 0:
						if (i & 4 && (e = e.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
						break;
					case 11:
					case 15: break;
					case 1:
						i & 1024 && n !== null && sc(e, n);
						break;
					case 3:
						if (i & 1024) {
							if (e = e.stateNode.containerInfo, n = e.nodeType, n === 9) fd(e);
							else if (n === 1) switch (e.nodeName) {
								case "HEAD":
								case "HTML":
								case "BODY":
									fd(e);
									break;
								default: e.textContent = "";
							}
						}
						break;
					case 5:
					case 26:
					case 27:
					case 6:
					case 4:
					case 17: break;
					default: if (i & 1024) throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
				}
				if (e = t.sibling, e !== null) {
					e.return = t.return, Sb = e;
					break;
				}
				Sb = t.return;
			}
		}
		function wc(e, t, n) {
			var r = vi(), i = bi(), a = Si(), o = Ci(), s = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Ic(e, n), s & 4 && $s(n, _y | hy);
					break;
				case 1:
					if (Ic(e, n), s & 4) {
						if (e = n.stateNode, t === null) n.type.defaultProps || "ref" in n.memoizedProps || fb || (e.props !== n.memoizedProps && console.error("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", C(n) || "instance"), e.state !== n.memoizedState && console.error("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", C(n) || "instance")), Qs(n) ? (ki(), D(n, Tv, n, e), Di()) : D(n, Tv, n, e);
						else {
							var c = is(n.type, t.memoizedProps);
							t = t.memoizedState, n.type.defaultProps || "ref" in n.memoizedProps || fb || (e.props !== n.memoizedProps && console.error("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", C(n) || "instance"), e.state !== n.memoizedState && console.error("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", C(n) || "instance")), Qs(n) ? (ki(), D(n, Dv, n, e, c, t, e.__reactInternalSnapshotBeforeUpdate), Di()) : D(n, Dv, n, e, c, t, e.__reactInternalSnapshotBeforeUpdate);
						}
					}
					s & 64 && ac(n), s & 512 && uc(n, n.return);
					break;
				case 3:
					if (t = mi(), Ic(e, n), s & 64 && (s = n.updateQueue, s !== null)) {
						if (c = null, n.child !== null) switch (n.child.tag) {
							case 27:
							case 5:
								c = n.child.stateNode;
								break;
							case 1: c = n.child.stateNode;
						}
						try {
							D(n, da, s, c);
						} catch (e) {
							N(n, n.return, e);
						}
					}
					e.effectDuration += hi(t);
					break;
				case 27: t === null && s & 4 && xc(n);
				case 26:
				case 5:
					if (Ic(e, n), t === null) {
						if (s & 4) mc(n);
						else if (s & 64) {
							e = n.type, t = n.memoizedProps, c = n.stateNode;
							try {
								D(n, Xu, c, e, t, n);
							} catch (e) {
								N(n, n.return, e);
							}
						}
					}
					s & 512 && uc(n, n.return);
					break;
				case 12:
					if (s & 4) {
						s = mi(), Ic(e, n), e = n.stateNode, e.effectDuration += gi(s);
						try {
							D(n, fc, n, t, x_, e.effectDuration);
						} catch (e) {
							N(n, n.return, e);
						}
					} else Ic(e, n);
					break;
				case 31:
					Ic(e, n), s & 4 && Oc(e, n);
					break;
				case 13:
					Ic(e, n), s & 4 && kc(e, n), s & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (s = Ul.bind(null, n), vd(e, s))));
					break;
				case 22:
					if (s = n.memoizedState !== null || vb, !s) {
						t = t !== null && t.memoizedState !== null || yb, c = vb;
						var l = yb;
						vb = s, (yb = t) && !l ? (Bc(e, n, !!(n.subtreeFlags & 8772)), (n.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && er(n, K, q)) : Ic(e, n), vb = c, yb = l;
					}
					break;
				case 30: break;
				default: Ic(e, n);
			}
			(n.mode & W) !== U && 0 <= K && 0 <= q && ((O_ || .05 < E_) && rr(n, K, q, E_, D_), n.alternate === null && n.return !== null && n.return.alternate !== null && .05 < q - K && (Sc(n.return.alternate, n.return) || $n(n, K, q, "Mount"))), yi(r), xi(i), D_ = a, O_ = o;
		}
		function Tc(e) {
			var t = e.alternate;
			t !== null && (e.alternate = null, Tc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Xe(t)), e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
		}
		function Ec(e, t, n) {
			for (n = n.child; n !== null;) Dc(e, t, n), n = n.sibling;
		}
		function Dc(e, t, n) {
			if (Np && typeof Np.onCommitFiberUnmount == "function") try {
				Np.onCommitFiberUnmount(Mp, n);
			} catch (e) {
				Pp || (Pp = !0, console.error("React instrumentation encountered an error: %o", e));
			}
			var r = vi(), i = bi(), a = Si(), o = Ci();
			switch (n.tag) {
				case 26:
					yb || dc(n, t), Ec(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (e = n.stateNode, e.parentNode.removeChild(e));
					break;
				case 27:
					yb || dc(n, t);
					var s = Tb, c = Eb;
					td(n.type) && (Tb = n.stateNode, Eb = !1), Ec(e, t, n), D(n, kd, n.stateNode), Tb = s, Eb = c;
					break;
				case 5: yb || dc(n, t);
				case 6:
					if (s = Tb, c = Eb, Tb = null, Ec(e, t, n), Tb = s, Eb = c, Tb !== null) {
						if (Eb) try {
							D(n, rd, Tb, n.stateNode);
						} catch (e) {
							N(n, t, e);
						}
						else try {
							D(n, nd, Tb, n.stateNode);
						} catch (e) {
							N(n, t, e);
						}
					}
					break;
				case 18:
					Tb !== null && (Eb ? (e = Tb, id(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Cf(e)) : id(Tb, n.stateNode));
					break;
				case 4:
					s = Tb, c = Eb, Tb = n.stateNode.containerInfo, Eb = !0, Ec(e, t, n), Tb = s, Eb = c;
					break;
				case 0:
				case 11:
				case 14:
				case 15:
					nc(gy, n, t), yb || ec(n, t, _y), Ec(e, t, n);
					break;
				case 1:
					yb || (dc(n, t), s = n.stateNode, typeof s.componentWillUnmount == "function" && cc(n, t, s)), Ec(e, t, n);
					break;
				case 21:
					Ec(e, t, n);
					break;
				case 22:
					yb = (s = yb) || n.memoizedState !== null, Ec(e, t, n), yb = s;
					break;
				default: Ec(e, t, n);
			}
			(n.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(n, K, q, E_, D_), yi(r), xi(i), D_ = a, O_ = o;
		}
		function Oc(e, t) {
			if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
				e = e.dehydrated;
				try {
					D(t, Td, e);
				} catch (e) {
					N(t, t.return, e);
				}
			}
		}
		function kc(e, t) {
			if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
				D(t, Ed, e);
			} catch (e) {
				N(t, t.return, e);
			}
		}
		function Ac(e) {
			switch (e.tag) {
				case 31:
				case 13:
				case 19:
					var t = e.stateNode;
					return t === null && (t = e.stateNode = new xb()), t;
				case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new xb()), t;
				default: throw Error("Unexpected Suspense handler tag (" + e.tag + "). This is a bug in React.");
			}
		}
		function jc(e, t) {
			var n = Ac(e);
			t.forEach(function(t) {
				if (!n.has(t)) {
					if (n.add(t), Fp) {
						if (Cb !== null && wb !== null) Yl(wb, Cb);
						else throw Error("Expected finished root and lanes to be set. This is a bug in React.");
					}
					var r = Wl.bind(null, e, t);
					t.then(r, r);
				}
			});
		}
		function Mc(e, t) {
			var n = t.deletions;
			if (n !== null) for (var r = 0; r < n.length; r++) {
				var i = e, a = t, o = n[r], s = vi(), c = a;
				a: for (; c !== null;) {
					switch (c.tag) {
						case 27:
							if (td(c.type)) {
								Tb = c.stateNode, Eb = !1;
								break a;
							}
							break;
						case 5:
							Tb = c.stateNode, Eb = !1;
							break a;
						case 3:
						case 4:
							Tb = c.stateNode.containerInfo, Eb = !0;
							break a;
					}
					c = c.return;
				}
				if (Tb === null) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
				Dc(i, a, o), Tb = null, Eb = !1, (o.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && $n(o, K, q, "Unmount"), yi(s), i = o, a = i.alternate, a !== null && (a.return = null), i.return = null;
			}
			if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Nc(t, e), t = t.sibling;
		}
		function Nc(e, t) {
			var n = vi(), r = bi(), i = Si(), a = Ci(), o = e.alternate, s = e.flags;
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Mc(t, e), Pc(e), s & 4 && (nc(gy | hy, e, e.return), tc(gy | hy, e), ec(e, e.return, _y | hy));
					break;
				case 1:
					if (Mc(t, e), Pc(e), s & 512 && (yb || o === null || dc(o, o.return)), s & 64 && vb && (s = e.updateQueue, s !== null && (o = s.callbacks, o !== null))) {
						var c = s.shared.hiddenCallbacks;
						s.shared.hiddenCallbacks = c === null ? o : c.concat(o);
					}
					break;
				case 26:
					if (c = Db, Mc(t, e), Pc(e), s & 512 && (yb || o === null || dc(o, o.return)), s & 4) {
						var l = o === null ? null : o.memoizedState;
						if (s = e.memoizedState, o === null) {
							if (s === null) {
								if (e.stateNode === null) {
									a: {
										s = e.type, o = e.memoizedProps, c = c.ownerDocument || c;
										b: switch (s) {
											case "title":
												l = c.getElementsByTagName("title")[0], (!l || l[em] || l[qp] || l.namespaceURI === Lm || l.hasAttribute("itemprop")) && (l = c.createElement(s), c.head.insertBefore(l, c.querySelector("head > title"))), Du(l, s, o), l[qp] = e, tt(l), s = l;
												break a;
											case "link":
												var u = Ud("link", "href", c).get(s + (o.href || ""));
												if (u) {
													for (var d = 0; d < u.length; d++) if (l = u[d], l.getAttribute("href") === (o.href == null || o.href === "" ? null : o.href) && l.getAttribute("rel") === (o.rel == null ? null : o.rel) && l.getAttribute("title") === (o.title == null ? null : o.title) && l.getAttribute("crossorigin") === (o.crossOrigin == null ? null : o.crossOrigin)) {
														u.splice(d, 1);
														break b;
													}
												}
												l = c.createElement(s), Du(l, s, o), c.head.appendChild(l);
												break;
											case "meta":
												if (u = Ud("meta", "content", c).get(s + (o.content || ""))) {
													for (d = 0; d < u.length; d++) if (l = u[d], O(o.content, "content"), l.getAttribute("content") === (o.content == null ? null : "" + o.content) && l.getAttribute("name") === (o.name == null ? null : o.name) && l.getAttribute("property") === (o.property == null ? null : o.property) && l.getAttribute("http-equiv") === (o.httpEquiv == null ? null : o.httpEquiv) && l.getAttribute("charset") === (o.charSet == null ? null : o.charSet)) {
														u.splice(d, 1);
														break b;
													}
												}
												l = c.createElement(s), Du(l, s, o), c.head.appendChild(l);
												break;
											default: throw Error("getNodesForType encountered a type it did not expect: \"" + s + "\". This is a bug in React.");
										}
										l[qp] = e, tt(l), s = l;
									}
									e.stateNode = s;
								} else Wd(c, e.type, e.stateNode);
							} else e.stateNode = zd(c, s, e.memoizedProps);
						} else l === s ? s === null && e.stateNode !== null && hc(e, e.memoizedProps, o.memoizedProps) : (l === null ? o.stateNode !== null && (o = o.stateNode, o.parentNode.removeChild(o)) : l.count--, s === null ? Wd(c, e.type, e.stateNode) : zd(c, s, e.memoizedProps));
					}
					break;
				case 27:
					Mc(t, e), Pc(e), s & 512 && (yb || o === null || dc(o, o.return)), o !== null && s & 4 && hc(e, e.memoizedProps, o.memoizedProps);
					break;
				case 5:
					if (Mc(t, e), Pc(e), s & 512 && (yb || o === null || dc(o, o.return)), e.flags & 32) {
						c = e.stateNode;
						try {
							D(e, Qu, c);
						} catch (t) {
							N(e, e.return, t);
						}
					}
					s & 4 && e.stateNode != null && (c = e.memoizedProps, hc(e, c, o === null ? c : o.memoizedProps)), s & 1024 && (bb = !0, e.type !== "form" && console.error("Unexpected host component type. Expected a form. This is a bug in React."));
					break;
				case 6:
					if (Mc(t, e), Pc(e), s & 4) {
						if (e.stateNode === null) throw Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
						s = e.memoizedProps, o = o === null ? s : o.memoizedProps, c = e.stateNode;
						try {
							D(e, $u, c, o, s);
						} catch (t) {
							N(e, e.return, t);
						}
					}
					break;
				case 3:
					if (c = mi(), pC = null, l = Db, Db = Ad(t.containerInfo), Mc(t, e), Db = l, Pc(e), s & 4 && o !== null && o.memoizedState.isDehydrated) try {
						D(e, wd, t.containerInfo);
					} catch (t) {
						N(e, e.return, t);
					}
					bb && (bb = !1, Fc(e)), t.effectDuration += hi(c);
					break;
				case 4:
					s = Db, Db = Ad(e.stateNode.containerInfo), Mc(t, e), Pc(e), Db = s;
					break;
				case 12:
					s = mi(), Mc(t, e), Pc(e), e.stateNode.effectDuration += gi(s);
					break;
				case 31:
					Mc(t, e), Pc(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, jc(e, s)));
					break;
				case 13:
					Mc(t, e), Pc(e), e.child.flags & 8192 && e.memoizedState !== null != (o !== null && o.memoizedState !== null) && (_x = Cp()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, jc(e, s)));
					break;
				case 22:
					c = e.memoizedState !== null;
					var f = o !== null && o.memoizedState !== null, p = vb, m = yb;
					if (vb = p || c, yb = m || f, Mc(t, e), yb = m, vb = p, f && !c && !p && !m && (e.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && er(e, K, q), Pc(e), s & 8192) a: for (t = e.stateNode, t._visibility = c ? t._visibility & ~Ag : t._visibility | Ag, !c || o === null || f || vb || yb || (Rc(e), (e.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && $n(e, K, q, "Disconnect")), o = null, t = e;;) {
						if (t.tag === 5 || t.tag === 26) {
							if (o === null) {
								f = o = t;
								try {
									l = f.stateNode, c ? D(f, sd, l) : D(f, ud, f.stateNode, f.memoizedProps);
								} catch (e) {
									N(f, f.return, e);
								}
							}
						} else if (t.tag === 6) {
							if (o === null) {
								f = t;
								try {
									u = f.stateNode, c ? D(f, cd, u) : D(f, dd, u, f.memoizedProps);
								} catch (e) {
									N(f, f.return, e);
								}
							}
						} else if (t.tag === 18) {
							if (o === null) {
								f = t;
								try {
									d = f.stateNode, c ? D(f, od, d) : D(f, ld, f.stateNode);
								} catch (e) {
									N(f, f.return, e);
								}
							}
						} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
							t.child.return = t, t = t.child;
							continue;
						}
						if (t === e) break a;
						for (; t.sibling === null;) {
							if (t.return === null || t.return === e) break a;
							o === t && (o = null), t = t.return;
						}
						o === t && (o = null), t.sibling.return = t.return, t = t.sibling;
					}
					s & 4 && (s = e.updateQueue, s !== null && (o = s.retryQueue, o !== null && (s.retryQueue = null, jc(e, o))));
					break;
				case 19:
					Mc(t, e), Pc(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, jc(e, s)));
					break;
				case 30: break;
				case 21: break;
				default: Mc(t, e), Pc(e);
			}
			(e.mode & W) !== U && 0 <= K && 0 <= q && ((O_ || .05 < E_) && rr(e, K, q, E_, D_), e.alternate === null && e.return !== null && e.return.alternate !== null && .05 < q - K && (Sc(e.return.alternate, e.return) || $n(e, K, q, "Mount"))), yi(n), xi(r), D_ = i, O_ = a;
		}
		function Pc(e) {
			var t = e.flags;
			if (t & 2) {
				try {
					D(e, bc, e);
				} catch (t) {
					N(e, e.return, t);
				}
				e.flags &= -3;
			}
			t & 4096 && (e.flags &= -4097);
		}
		function Fc(e) {
			if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
				var t = e;
				Fc(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
			}
		}
		function Ic(e, t) {
			if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) wc(e, t.alternate, t), t = t.sibling;
		}
		function Lc(e) {
			var t = vi(), n = bi(), r = Si(), i = Ci();
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					ec(e, e.return, _y), Rc(e);
					break;
				case 1:
					dc(e, e.return);
					var a = e.stateNode;
					typeof a.componentWillUnmount == "function" && cc(e, e.return, a), Rc(e);
					break;
				case 27: D(e, kd, e.stateNode);
				case 26:
				case 5:
					dc(e, e.return), Rc(e);
					break;
				case 22:
					e.memoizedState === null && Rc(e);
					break;
				case 30:
					Rc(e);
					break;
				default: Rc(e);
			}
			(e.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(e, K, q, E_, D_), yi(t), xi(n), D_ = r, O_ = i;
		}
		function Rc(e) {
			for (e = e.child; e !== null;) Lc(e), e = e.sibling;
		}
		function zc(e, t, n, r) {
			var i = vi(), a = bi(), o = Si(), s = Ci(), c = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Bc(e, n, r), $s(n, _y);
					break;
				case 1:
					if (Bc(e, n, r), t = n.stateNode, typeof t.componentDidMount == "function" && D(n, Tv, n, t), t = n.updateQueue, t !== null) {
						e = n.stateNode;
						try {
							D(n, ua, t, e);
						} catch (e) {
							N(n, n.return, e);
						}
					}
					r && c & 64 && ac(n), uc(n, n.return);
					break;
				case 27: xc(n);
				case 26:
				case 5:
					Bc(e, n, r), r && t === null && c & 4 && mc(n), uc(n, n.return);
					break;
				case 12:
					if (r && c & 4) {
						c = mi(), Bc(e, n, r), r = n.stateNode, r.effectDuration += gi(c);
						try {
							D(n, fc, n, t, x_, r.effectDuration);
						} catch (e) {
							N(n, n.return, e);
						}
					} else Bc(e, n, r);
					break;
				case 31:
					Bc(e, n, r), r && c & 4 && Oc(e, n);
					break;
				case 13:
					Bc(e, n, r), r && c & 4 && kc(e, n);
					break;
				case 22:
					n.memoizedState === null && Bc(e, n, r), uc(n, n.return);
					break;
				case 30: break;
				default: Bc(e, n, r);
			}
			(n.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(n, K, q, E_, D_), yi(i), xi(a), D_ = o, O_ = s;
		}
		function Bc(e, t, n) {
			for (n &&= !!(t.subtreeFlags & 8772), t = t.child; t !== null;) zc(e, t.alternate, t, n), t = t.sibling;
		}
		function Vc(e, t) {
			var n = null;
			e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && ui(e), n != null && di(n));
		}
		function Hc(e, t) {
			e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (ui(t), e != null && di(e));
		}
		function Uc(e, t, n, r, i) {
			if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)) for (t = t.child; t !== null;) {
				var a = t.sibling;
				Wc(e, t, n, r, a === null ? i : a.actualStartTime), t = a;
			}
		}
		function Wc(e, t, n, r, i) {
			var a = vi(), o = bi(), s = Si(), c = Ci(), l = wg, u = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					(t.mode & W) !== U && 0 < t.actualStartTime && t.flags & 1 && tr(t, t.actualStartTime, i, Ob, n), Uc(e, t, n, r, i), u & 2048 && rc(t, vy | hy);
					break;
				case 1:
					(t.mode & W) !== U && 0 < t.actualStartTime && (t.flags & 128 ? nr(t, t.actualStartTime, i, []) : t.flags & 1 && tr(t, t.actualStartTime, i, Ob, n)), Uc(e, t, n, r, i);
					break;
				case 3:
					var d = mi(), f = Ob;
					Ob = t.alternate !== null && t.alternate.memoizedState.isDehydrated && !(t.flags & 256), Uc(e, t, n, r, i), Ob = f, u & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), r = t.memoizedState.cache, r !== n && (ui(r), n != null && di(n))), e.passiveEffectDuration += hi(d);
					break;
				case 12:
					if (u & 2048) {
						u = mi(), Uc(e, t, n, r, i), e = t.stateNode, e.passiveEffectDuration += gi(u);
						try {
							D(t, pc, t, t.alternate, x_, e.passiveEffectDuration);
						} catch (e) {
							N(t, t.return, e);
						}
					} else Uc(e, t, n, r, i);
					break;
				case 31:
					u = Ob, d = t.alternate === null ? null : t.alternate.memoizedState, f = t.memoizedState, d !== null && f === null ? (f = t.deletions, f !== null && 0 < f.length && f[0].tag === 18 ? (Ob = !1, d = d.hydrationErrors, d !== null && nr(t, t.actualStartTime, i, d)) : Ob = !0) : Ob = !1, Uc(e, t, n, r, i), Ob = u;
					break;
				case 13:
					u = Ob, d = t.alternate === null ? null : t.alternate.memoizedState, f = t.memoizedState, d === null || d.dehydrated === null || f !== null && f.dehydrated !== null ? Ob = !1 : (f = t.deletions, f !== null && 0 < f.length && f[0].tag === 18 ? (Ob = !1, d = d.hydrationErrors, d !== null && nr(t, t.actualStartTime, i, d)) : Ob = !0), Uc(e, t, n, r, i), Ob = u;
					break;
				case 23: break;
				case 22:
					f = t.stateNode, d = t.alternate, t.memoizedState === null ? f._visibility & jg ? Uc(e, t, n, r, i) : (f._visibility |= jg, Gc(e, t, n, r, !!(t.subtreeFlags & 10256) || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child), i), (t.mode & W) === U || Ob || (e = t.actualStartTime, 0 <= e && .05 < i - e && er(t, e, i), 0 <= K && 0 <= q && .05 < q - K && er(t, K, q))) : f._visibility & jg ? Uc(e, t, n, r, i) : qc(e, t, n, r, i), u & 2048 && Vc(d, t);
					break;
				case 24:
					Uc(e, t, n, r, i), u & 2048 && Hc(t.alternate, t);
					break;
				default: Uc(e, t, n, r, i);
			}
			(t.mode & W) !== U && ((e = !Ob && t.alternate === null && t.return !== null && t.return.alternate !== null) && (n = t.actualStartTime, 0 <= n && .05 < i - n && $n(t, n, i, "Mount")), 0 <= K && 0 <= q && ((O_ || .05 < E_) && rr(t, K, q, E_, D_), e && .05 < q - K && $n(t, K, q, "Mount"))), yi(a), xi(o), D_ = s, O_ = c, wg = l;
		}
		function Gc(e, t, n, r, i, a) {
			for (i &&= !!(t.subtreeFlags & 10256) || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child), t = t.child; t !== null;) {
				var o = t.sibling;
				Kc(e, t, n, r, i, o === null ? a : o.actualStartTime), t = o;
			}
		}
		function Kc(e, t, n, r, i, a) {
			var o = vi(), s = bi(), c = Si(), l = Ci(), u = wg;
			i && (t.mode & W) !== U && 0 < t.actualStartTime && t.flags & 1 && tr(t, t.actualStartTime, a, Ob, n);
			var d = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					Gc(e, t, n, r, i, a), rc(t, vy);
					break;
				case 23: break;
				case 22:
					var f = t.stateNode;
					t.memoizedState === null ? (f._visibility |= jg, Gc(e, t, n, r, i, a)) : f._visibility & jg ? Gc(e, t, n, r, i, a) : qc(e, t, n, r, a), i && d & 2048 && Vc(t.alternate, t);
					break;
				case 24:
					Gc(e, t, n, r, i, a), i && d & 2048 && Hc(t.alternate, t);
					break;
				default: Gc(e, t, n, r, i, a);
			}
			(t.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(t, K, q, E_, D_), yi(o), xi(s), D_ = c, O_ = l, wg = u;
		}
		function qc(e, t, n, r, i) {
			if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)) for (var a = t.child; a !== null;) {
				t = a.sibling;
				var o = e, s = n, c = r, l = t === null ? i : t.actualStartTime, u = wg;
				(a.mode & W) !== U && 0 < a.actualStartTime && a.flags & 1 && tr(a, a.actualStartTime, l, Ob, s);
				var d = a.flags;
				switch (a.tag) {
					case 22:
						qc(o, a, s, c, l), d & 2048 && Vc(a.alternate, a);
						break;
					case 24:
						qc(o, a, s, c, l), d & 2048 && Hc(a.alternate, a);
						break;
					default: qc(o, a, s, c, l);
				}
				wg = u, a = t;
			}
		}
		function Jc(e, t, n) {
			if (e.subtreeFlags & kb) for (e = e.child; e !== null;) Yc(e, t, n), e = e.sibling;
		}
		function Yc(e, t, n) {
			switch (e.tag) {
				case 26:
					Jc(e, t, n), e.flags & kb && e.memoizedState !== null && qd(n, Db, e.memoizedState, e.memoizedProps);
					break;
				case 5:
					Jc(e, t, n);
					break;
				case 3:
				case 4:
					var r = Db;
					Db = Ad(e.stateNode.containerInfo), Jc(e, t, n), Db = r;
					break;
				case 22:
					e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = kb, kb = 16777216, Jc(e, t, n), kb = r) : Jc(e, t, n));
					break;
				default: Jc(e, t, n);
			}
		}
		function Xc(e) {
			var t = e.alternate;
			if (t !== null && (e = t.child, e !== null)) {
				t.child = null;
				do
					t = e.sibling, e.sibling = null, e = t;
				while (e !== null);
			}
		}
		function Zc(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null) for (var n = 0; n < t.length; n++) {
					var r = t[n], i = vi();
					Sb = r, tl(r, e), (r.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && $n(r, K, q, "Unmount"), yi(i);
				}
				Xc(e);
			}
			if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Qc(e), e = e.sibling;
		}
		function Qc(e) {
			var t = vi(), n = bi(), r = Si(), i = Ci();
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					Zc(e), e.flags & 2048 && ic(e, e.return, vy | hy);
					break;
				case 3:
					var a = mi();
					Zc(e), e.stateNode.passiveEffectDuration += hi(a);
					break;
				case 12:
					a = mi(), Zc(e), e.stateNode.passiveEffectDuration += gi(a);
					break;
				case 22:
					a = e.stateNode, e.memoizedState !== null && a._visibility & jg && (e.return === null || e.return.tag !== 13) ? (a._visibility &= ~jg, $c(e), (e.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && $n(e, K, q, "Disconnect")) : Zc(e);
					break;
				default: Zc(e);
			}
			(e.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(e, K, q, E_, D_), yi(t), xi(n), O_ = i, D_ = r;
		}
		function $c(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null) for (var n = 0; n < t.length; n++) {
					var r = t[n], i = vi();
					Sb = r, tl(r, e), (r.mode & W) !== U && 0 <= K && 0 <= q && .05 < q - K && $n(r, K, q, "Unmount"), yi(i);
				}
				Xc(e);
			}
			for (e = e.child; e !== null;) el(e), e = e.sibling;
		}
		function el(e) {
			var t = vi(), n = bi(), r = Si(), i = Ci();
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					ic(e, e.return, vy), $c(e);
					break;
				case 22:
					var a = e.stateNode;
					a._visibility & jg && (a._visibility &= ~jg, $c(e));
					break;
				default: $c(e);
			}
			(e.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(e, K, q, E_, D_), yi(t), xi(n), O_ = i, D_ = r;
		}
		function tl(e, t) {
			for (; Sb !== null;) {
				var n = Sb, r = n, i = t, a = vi(), o = bi(), s = Si(), c = Ci();
				switch (r.tag) {
					case 0:
					case 11:
					case 15:
						ic(r, i, vy);
						break;
					case 23:
					case 22:
						r.memoizedState !== null && r.memoizedState.cachePool !== null && (i = r.memoizedState.cachePool.pool, i != null && ui(i));
						break;
					case 24: di(r.memoizedState.cache);
				}
				if ((r.mode & W) !== U && 0 <= K && 0 <= q && (O_ || .05 < E_) && rr(r, K, q, E_, D_), yi(a), xi(o), O_ = c, D_ = s, r = n.child, r !== null) r.return = n, Sb = r;
				else a: for (n = e; Sb !== null;) {
					if (r = Sb, a = r.sibling, o = r.return, Tc(r), r === n) {
						Sb = null;
						break a;
					}
					if (a !== null) {
						a.return = o, Sb = a;
						break a;
					}
					Sb = o;
				}
			}
		}
		function nl() {
			Mb.forEach(function(e) {
				return e();
			});
		}
		function rl() {
			var e = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
			return e || B.actQueue === null || console.error("The current testing environment is not configured to support act(...)"), e;
		}
		function il(e) {
			if ((Wb & Fb) !== Pb && Q !== 0) return Q & -Q;
			var t = B.T;
			return t === null ? Je() : (t._updatedFibers ||= /* @__PURE__ */ new Set(), t._updatedFibers.add(e), iu());
		}
		function al() {
			if (fx === 0) {
				if (!(Q & 536870912) || G) {
					var e = Bp;
					Bp <<= 1, !(Bp & 3932160) && (Bp = 262144), fx = e;
				} else fx = 536870912;
			}
			return e = ly.current, e !== null && (e.flags |= 32), fx;
		}
		function ol(e, t, n) {
			if (eS && console.error("useInsertionEffect must not schedule updates."), Yx && (Xx = !0), (e === Gb && (nx === Jb || nx === tx) || e.cancelPendingCommit !== null) && (ml(e, 0), ul(e, Q, fx, !1)), ze(e, n), (Wb & Fb) !== Pb && e === Gb) {
				if (_p) switch (t.tag) {
					case 0:
					case 11:
					case 15:
						e = Z && C(Z) || "Unknown", rS.has(e) || (rS.add(e), t = C(t) || "Unknown", console.error("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://react.dev/link/setstate-in-render", t, e, e));
						break;
					case 1: nS ||= (console.error("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), !0);
				}
			} else Fp && Ge(e, t, n), Zl(t), e === Gb && ((Wb & Fb) === Pb && (ux |= n), cx === Vb && ul(e, Q, fx, !1)), P(e);
		}
		function sl(e, t, n) {
			if ((Wb & (Fb | Ib)) !== Pb) throw Error("Should not already be working.");
			if (Q !== 0 && Z !== null) {
				var r = Z, i = Cp();
				switch (ev) {
					case Yb:
					case Jb:
						var a = tv;
						Sg && ((r = r._debugTask) ? r.run(console.timeStamp.bind(console, "Suspended", a, i, Cg, void 0, "primary-light")) : console.timeStamp("Suspended", a, i, Cg, void 0, "primary-light"));
						break;
					case tx:
						a = tv, Sg && ((r = r._debugTask) ? r.run(console.timeStamp.bind(console, "Action", a, i, Cg, void 0, "primary-light")) : console.timeStamp("Action", a, i, Cg, void 0, "primary-light"));
						break;
					default: Sg && (r = i - tv, 3 > r || console.timeStamp("Blocked", tv, i, Cg, void 0, 5 > r ? "primary-light" : 10 > r ? "primary" : 100 > r ? "primary-dark" : "error"));
				}
			}
			a = (n = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Fe(e, t)) ? Cl(e, t) : xl(e, t, !0);
			var o = n;
			do {
				if (a === Lb) {
					ax && !n && ul(e, t, 0, !1), t = nx, tv = g_(), ev = t;
					break;
				}
				if (r = Cp(), i = e.current.alternate, o && !ll(i)) {
					Qn(t), i = b_, a = r, !Sg || a <= i || (Cx ? Cx.run(console.timeStamp.bind(console, "Teared Render", i, a, H, V, "error")) : console.timeStamp("Teared Render", i, a, H, V, "error")), pl(t, r), a = xl(e, t, !1), o = !1;
					continue;
				}
				if (a === zb) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						Qn(t), cr(b_, r, t, Cx), pl(t, r), t = s;
						a: {
							r = e, a = o, o = mx;
							var c = r.current.memoizedState.isDehydrated;
							if (c && (ml(r, s).flags |= 256), s = xl(r, s, !1), s !== zb) {
								if (ox && !c) {
									r.errorRecoveryDisabledLanes |= a, ux |= a, a = Vb;
									break a;
								}
								r = hx, hx = o, r !== null && (hx === null ? hx = r : hx.push.apply(hx, r));
							}
							a = s;
						}
						if (o = !1, a !== zb) continue;
						r = Cp();
					}
				}
				if (a === Rb) {
					Qn(t), cr(b_, r, t, Cx), pl(t, r), ml(e, 0), ul(e, t, 0, !0);
					break;
				}
				a: {
					switch (n = e, a) {
						case Lb:
						case Rb: throw Error("Root did not complete. This is a bug in React.");
						case Vb: if ((t & 4194048) !== t) break;
						case Hb:
							Qn(t), ar(b_, r, t, Cx), pl(t, r), i = t, i & 127 ? R_ = r : i & 4194048 && (Y_ = r), ul(n, t, fx, !ix);
							break a;
						case zb:
							hx = null;
							break;
						case Bb:
						case Ub: break;
						default: throw Error("Unknown root exit status.");
					}
					if (B.actQueue !== null) jl(n, i, t, hx, Sx, gx, fx, ux, px, a, null, null, b_, r);
					else {
						if ((t & 62914560) === t && (o = _x + yx - Cp(), 10 < o)) {
							if (ul(n, t, fx, !ix), Pe(n, 0, !0) !== 0) break a;
							Rx = t, n.timeoutHandle = QS(cl.bind(null, n, i, hx, Sx, gx, t, fx, ux, px, ix, a, "Throttled", b_, r), o);
							break a;
						}
						cl(n, i, hx, Sx, gx, t, fx, ux, px, ix, a, null, b_, r);
					}
				}
				break;
			} while (1);
			P(e);
		}
		function cl(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			e.timeoutHandle = eC;
			var m = t.subtreeFlags, h = null;
			if ((m & 8192 || (m & 16785408) == 16785408) && (h = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: ln
			}, Yc(t, a, h), m = (a & 62914560) === a ? _x - Cp() : (a & 4194048) === a ? vx - Cp() : 0, m = Jd(h, m), m !== null)) {
				Rx = a, e.cancelPendingCommit = m(jl.bind(null, e, t, a, n, r, i, o, s, c, u, h, h.waitingForViewTransition ? "Waiting for the previous Animation" : 0 < h.count ? 0 < h.imgCount ? "Suspended on CSS and Images" : "Suspended on CSS" : h.imgCount === 1 ? "Suspended on an Image" : 0 < h.imgCount ? "Suspended on Images" : null, f, p)), ul(e, a, o, !l);
				return;
			}
			jl(e, t, a, n, r, i, o, s, c, u, h, d, f, p);
		}
		function ll(e) {
			for (var t = e;;) {
				var n = t.tag;
				if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
					var i = n[r], a = i.getSnapshot;
					i = i.value;
					try {
						if (!Gh(a(), i)) return !1;
					} catch {
						return !1;
					}
				}
				if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
				else {
					if (t === e) break;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) return !0;
						t = t.return;
					}
					t.sibling.return = t.return, t = t.sibling;
				}
			}
			return !0;
		}
		function ul(e, t, n, r) {
			t &= ~dx, t &= ~ux, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
			for (var i = t; 0 < i;) {
				var a = 31 - Ip(i), o = 1 << a;
				r[a] = -1, i &= ~o;
			}
			n !== 0 && Ve(e, n, t);
		}
		function dl() {
			return (Wb & (Fb | Ib)) !== Pb || (F(0, !1), !1);
		}
		function fl() {
			if (Z !== null) {
				if (nx === Kb) var e = Z.return;
				else e = Z, Qr(), ja(e), Wv = null, Gv = 0, e = Z;
				for (; e !== null;) Zs(e.alternate, e), e = e.return;
				Z = null;
			}
		}
		function pl(e, t) {
			e & 127 && (k_ = t), e & 4194048 && (z_ = t), e & 62914560 && (X_ = t), e & 2080374784 && (Z_ = t);
		}
		function ml(e, t) {
			Sg && (console.timeStamp("Blocking Track", .003, .003, "Blocking", V, "primary-light"), console.timeStamp("Transition Track", .003, .003, "Transition", V, "primary-light"), console.timeStamp("Suspense Track", .003, .003, "Suspense", V, "primary-light"), console.timeStamp("Idle Track", .003, .003, "Idle", V, "primary-light"));
			var n = b_;
			if (b_ = g_(), Q !== 0 && 0 < n) {
				if (Qn(Q), cx === Bb || cx === Vb) ar(n, b_, t, Cx);
				else {
					var r = b_, i = Cx;
					if (Sg && !(r <= n)) {
						var a = (t & 738197653) === t ? "tertiary-dark" : "primary-dark", o = (t & 536870912) === t ? "Prewarm" : (t & 201326741) === t ? "Interrupted Hydration" : "Interrupted Render";
						i ? i.run(console.timeStamp.bind(console, o, n, r, H, V, a)) : console.timeStamp(o, n, r, H, V, a);
					}
				}
				pl(Q, b_);
			}
			if (n = Cx, Cx = null, t & 127) {
				Cx = j_, i = 0 <= A_ && A_ < k_ ? k_ : A_, r = 0 <= F_ && F_ < k_ ? k_ : F_, a = 0 <= r ? r : 0 <= i ? i : b_, 0 <= R_ ? (Qn(2), or(R_, a, t, n)) : Q_ & 127 && (Qn(2), dr(k_, a, $_)), n = i;
				var s = r, c = I_, l = 0 < L_, u = M_ === v_, d = M_ === y_;
				if (i = b_, r = j_, a = N_, o = P_, Sg) {
					if (H = "Blocking", 0 < n ? n > i && (n = i) : n = i, 0 < s ? s > n && (s = n) : s = n, c !== null && n > s) {
						var f = l ? "secondary-light" : "warning";
						r ? r.run(console.timeStamp.bind(console, l ? "Consecutive" : "Event: " + c, s, n, H, V, f)) : console.timeStamp(l ? "Consecutive" : "Event: " + c, s, n, H, V, f);
					}
					i > n && (s = u ? "error" : (t & 738197653) === t ? "tertiary-light" : "primary-light", u = d ? "Promise Resolved" : u ? "Cascading Update" : 5 < i - n ? "Update Blocked" : "Update", d = [], o != null && d.push(["Component name", o]), a != null && d.push(["Method name", a]), n = {
						start: n,
						end: i,
						detail: { devtools: {
							properties: d,
							track: H,
							trackGroup: V,
							color: s
						} }
					}, r ? r.run(performance.measure.bind(performance, u, n)) : performance.measure(u, n));
				}
				A_ = -1.1, M_ = 0, P_ = N_ = null, R_ = -1.1, L_ = F_, F_ = -1.1, k_ = g_();
			}
			if (t & 4194048 && (Cx = U_, i = 0 <= B_ && B_ < z_ ? z_ : B_, n = 0 <= V_ && V_ < z_ ? z_ : V_, r = 0 <= K_ && K_ < z_ ? z_ : K_, a = 0 <= r ? r : 0 <= n ? n : b_, 0 <= Y_ ? (Qn(256), or(Y_, a, t, Cx)) : Q_ & 4194048 && (Qn(256), dr(z_, a, $_)), d = r, s = q_, c = 0 < J_, l = H_ === y_, a = b_, r = U_, o = W_, u = G_, Sg && (H = "Transition", 0 < n ? n > a && (n = a) : n = a, 0 < i ? i > n && (i = n) : i = n, 0 < d ? d > i && (d = i) : d = i, i > d && s !== null && (f = c ? "secondary-light" : "warning", r ? r.run(console.timeStamp.bind(console, c ? "Consecutive" : "Event: " + s, d, i, H, V, f)) : console.timeStamp(c ? "Consecutive" : "Event: " + s, d, i, H, V, f)), n > i && (r ? r.run(console.timeStamp.bind(console, "Action", i, n, H, V, "primary-dark")) : console.timeStamp("Action", i, n, H, V, "primary-dark")), a > n && (i = l ? "Promise Resolved" : 5 < a - n ? "Update Blocked" : "Update", d = [], u != null && d.push(["Component name", u]), o != null && d.push(["Method name", o]), n = {
				start: n,
				end: a,
				detail: { devtools: {
					properties: d,
					track: H,
					trackGroup: V,
					color: "primary-light"
				} }
			}, r ? r.run(performance.measure.bind(performance, i, n)) : performance.measure(i, n))), V_ = B_ = -1.1, H_ = 0, Y_ = -1.1, J_ = K_, K_ = -1.1, z_ = g_()), t & 62914560 && Q_ & 62914560 && (Qn(4194304), dr(X_, b_, $_)), t & 2080374784 && Q_ & 2080374784 && (Qn(268435456), dr(Z_, b_, $_)), n = e.timeoutHandle, n !== eC && (e.timeoutHandle = eC, $S(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Rx = 0, fl(), Gb = e, Z = n = Tr(e.current, null), Q = t, nx = Kb, rx = null, ix = !1, ax = Fe(e, t), ox = !1, cx = Lb, px = fx = dx = ux = lx = 0, hx = mx = null, gx = !1, t & 8 && (t |= t & 32), r = e.entangledLanes, r !== 0) for (e = e.entanglements, r &= t; 0 < r;) i = 31 - Ip(r), a = 1 << i, t |= e[i], r &= ~a;
			return sx = t, fr(), e = dg(), 1e3 < e - lg && (B.recentlyCreatedOwnerStacks = 0, lg = e), uv.discardPendingWarnings(), n;
		}
		function hl(e, t) {
			Y = null, B.H = Ry, B.getCurrentStack = null, _p = !1, gp = null, t === Rv || t === Bv ? (t = Vi(), nx = Yb) : t === zv ? (t = Vi(), nx = Xb) : nx = t === ob ? ex : typeof t == "object" && t && typeof t.then == "function" ? Qb : qb, rx = t;
			var n = Z;
			n === null ? (cx = Rb, cs(e, Nr(t, e.current))) : n.mode & W && Ti(n);
		}
		function gl() {
			var e = ly.current;
			return e === null ? !0 : (Q & 4194048) === Q ? uy === null : (Q & 62914560) === Q || Q & 536870912 ? e === uy : !1;
		}
		function _l() {
			var e = B.H;
			return B.H = Ry, e === null ? Ry : e;
		}
		function vl() {
			var e = B.A;
			return B.A = Ab, e;
		}
		function yl(e) {
			Cx === null && (Cx = e._debugTask == null ? null : e._debugTask);
		}
		function bl() {
			cx = Vb, ix || (Q & 4194048) !== Q && ly.current !== null || (ax = !0), !(lx & 134217727) && !(ux & 134217727) || Gb === null || ul(Gb, Q, fx, !1);
		}
		function xl(e, t, n) {
			var r = Wb;
			Wb |= Fb;
			var i = _l(), a = vl();
			if (Gb !== e || Q !== t) {
				if (Fp) {
					var o = e.memoizedUpdaters;
					0 < o.size && (Yl(e, Q), o.clear()), Ke(e, t);
				}
				Sx = null, ml(e, t);
			}
			t = !1, o = cx;
			a: do
				try {
					if (nx !== Kb && Z !== null) {
						var s = Z, c = rx;
						switch (nx) {
							case ex:
								fl(), o = Hb;
								break a;
							case Yb:
							case Jb:
							case tx:
							case Qb:
								ly.current === null && (t = !0);
								var l = nx;
								if (nx = Kb, rx = null, Ol(e, s, c, l), n && ax) {
									o = Lb;
									break a;
								}
								break;
							default: l = nx, nx = Kb, rx = null, Ol(e, s, c, l);
						}
					}
					Sl(), o = cx;
					break;
				} catch (t) {
					hl(e, t);
				}
			while (1);
			return t && e.shellSuspendCounter++, Qr(), Wb = r, B.H = i, B.A = a, Z === null && (Gb = null, Q = 0, fr()), o;
		}
		function Sl() {
			for (; Z !== null;) Tl(Z);
		}
		function Cl(e, t) {
			var n = Wb;
			Wb |= Fb;
			var r = _l(), i = vl();
			if (Gb !== e || Q !== t) {
				if (Fp) {
					var a = e.memoizedUpdaters;
					0 < a.size && (Yl(e, Q), a.clear()), Ke(e, t);
				}
				Sx = null, bx = Cp() + xx, ml(e, t);
			} else ax = Fe(e, t);
			a: do
				try {
					if (nx !== Kb && Z !== null) b: switch (t = Z, a = rx, nx) {
						case qb:
							nx = Kb, rx = null, Ol(e, t, a, qb);
							break;
						case Jb:
						case tx:
							if (Ri(a)) {
								nx = Kb, rx = null, El(t);
								break;
							}
							t = function() {
								nx !== Jb && nx !== tx || Gb !== e || (nx = $b), P(e);
							}, a.then(t, t);
							break a;
						case Yb:
							nx = $b;
							break a;
						case Xb:
							nx = Zb;
							break a;
						case $b:
							Ri(a) ? (nx = Kb, rx = null, El(t)) : (nx = Kb, rx = null, Ol(e, t, a, $b));
							break;
						case Zb:
							var o = null;
							switch (Z.tag) {
								case 26: o = Z.memoizedState;
								case 5:
								case 27:
									var s = Z;
									if (o ? Kd(o) : s.stateNode.complete) {
										nx = Kb, rx = null;
										var c = s.sibling;
										if (c !== null) Z = c;
										else {
											var l = s.return;
											l === null ? Z = null : (Z = l, kl(l));
										}
										break b;
									}
									break;
								default: console.error("Unexpected type of fiber triggered a suspensey commit. This is a bug in React.");
							}
							nx = Kb, rx = null, Ol(e, t, a, Zb);
							break;
						case Qb:
							nx = Kb, rx = null, Ol(e, t, a, Qb);
							break;
						case ex:
							fl(), cx = Hb;
							break a;
						default: throw Error("Unexpected SuspendedReason. This is a bug in React.");
					}
					B.actQueue === null ? wl() : Sl();
					break;
				} catch (t) {
					hl(e, t);
				}
			while (1);
			return Qr(), B.H = r, B.A = i, Wb = n, Z === null ? (Gb = null, Q = 0, fr(), cx) : Lb;
		}
		function wl() {
			for (; Z !== null && !xp();) Tl(Z);
		}
		function Tl(e) {
			var t = e.alternate;
			(e.mode & W) === U ? t = D(e, Hs, t, e, sx) : (wi(e), t = D(e, Hs, t, e, sx), Ti(e)), e.memoizedProps = e.pendingProps, t === null ? kl(e) : Z = t;
		}
		function El(e) {
			var t = D(e, Dl, e);
			e.memoizedProps = e.pendingProps, t === null ? kl(e) : Z = t;
		}
		function Dl(e) {
			var t = e.alternate, n = (e.mode & W) !== U;
			switch (n && wi(e), e.tag) {
				case 15:
				case 0:
					t = Es(t, e, e.pendingProps, e.type, void 0, Q);
					break;
				case 11:
					t = Es(t, e, e.pendingProps, e.type.render, e.ref, Q);
					break;
				case 5: ja(e);
				default: Zs(t, e), e = Z = Er(e, sx), t = Hs(t, e, sx);
			}
			return n && Ti(e), t;
		}
		function Ol(e, t, n, r) {
			Qr(), ja(t), Wv = null, Gv = 0;
			var i = t.return;
			try {
				if (ps(e, i, t, n, Q)) {
					cx = Rb, cs(e, Nr(n, e.current)), Z = null;
					return;
				}
			} catch (t) {
				if (i !== null) throw Z = i, t;
				cx = Rb, cs(e, Nr(n, e.current)), Z = null;
				return;
			}
			t.flags & 32768 ? (G || r === qb ? e = !0 : ax || Q & 536870912 ? e = !1 : (ix = e = !0, (r === Jb || r === tx || r === Yb || r === Qb) && (r = ly.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Al(t, e)) : kl(t);
		}
		function kl(e) {
			var t = e;
			do {
				if (t.flags & 32768) {
					Al(t, ix);
					return;
				}
				var n = t.alternate;
				if (e = t.return, wi(t), n = D(t, Ys, n, t, sx), (t.mode & W) !== U && Ei(t), n !== null) {
					Z = n;
					return;
				}
				if (t = t.sibling, t !== null) {
					Z = t;
					return;
				}
				Z = t = e;
			} while (t !== null);
			cx === Lb && (cx = Ub);
		}
		function Al(e, t) {
			do {
				var n = Xs(e.alternate, e);
				if (n !== null) {
					n.flags &= 32767, Z = n;
					return;
				}
				if ((e.mode & W) !== U) {
					Ei(e), n = e.actualDuration;
					for (var r = e.child; r !== null;) n += r.actualDuration, r = r.sibling;
					e.actualDuration = n;
				}
				if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
					Z = e;
					return;
				}
				Z = e = n;
			} while (e !== null);
			cx = Hb, Z = null;
		}
		function jl(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			e.cancelPendingCommit = null;
			do
				Ll();
			while (Fx !== kx);
			if (uv.flushLegacyContextWarning(), uv.flushPendingUnsafeLifecycleWarnings(), (Wb & (Fb | Ib)) !== Pb) throw Error("Should not already be working.");
			if (Qn(n), l === zb ? cr(f, p, n, Cx) : r === null ? ir(f, p, n, Cx) : sr(f, p, n, r, t !== null && t.alternate !== null && t.alternate.memoizedState.isDehydrated && !!(t.flags & 256), Cx), t !== null) {
				if (n === 0 && console.error("finishedLanes should not be empty during a commit. This is a bug in React."), t === e.current) throw Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
				if (a = t.lanes | t.childLanes, a |= Pg, Be(e, n, a, o, s, c), e === Gb && (Z = Gb = null, Q = 0), Lx = t, Ix = e, Rx = n, zx = a, Vx = i, Hx = r, Bx = p, Ux = d, Wx = Tx, Gx = null, t.actualDuration !== 0 || t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xl(Dp, function() {
					return ZS = window.event, Wx === Tx && (Wx = Dx), Rl(), null;
				})) : (e.callbackNode = null, e.callbackPriority = 0), C_ = null, x_ = g_(), d !== null && lr(p, x_, d, Cx), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
					r = B.T, B.T = null, i = Yf.p, Yf.p = Hp, o = Wb, Wb |= Ib;
					try {
						Cc(e, t, n);
					} finally {
						Wb = o, Yf.p = i, B.T = r;
					}
				}
				Fx = Ax, Ml(), Nl(), Pl();
			}
		}
		function Ml() {
			if (Fx === Ax) {
				Fx = kx;
				var e = Ix, t = Lx, n = Rx, r = !!(t.flags & 13878);
				if (t.subtreeFlags & 13878 || r) {
					r = B.T, B.T = null;
					var i = Yf.p;
					Yf.p = Hp;
					var a = Wb;
					Wb |= Ib;
					try {
						Cb = n, wb = e, _i(), Nc(t, e), wb = Cb = null, n = JS;
						var o = Hn(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
						if (o !== s && s && s.ownerDocument && Vn(s.ownerDocument.documentElement, s)) {
							if (c !== null && Un(s)) {
								var l = c.start, u = c.end;
								if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
								else {
									var d = s.ownerDocument || document, f = d && d.defaultView || window;
									if (f.getSelection) {
										var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
										!p.extend && h > g && (o = g, g = h, h = o);
										var _ = Bn(s, h), v = Bn(s, g);
										if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
											var y = d.createRange();
											y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
										}
									}
								}
							}
							for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
								element: p,
								left: p.scrollLeft,
								top: p.scrollTop
							});
							for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
								var b = d[s];
								b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
							}
						}
						RC = !!qS, JS = qS = null;
					} finally {
						Wb = a, Yf.p = i, B.T = r;
					}
				}
				e.current = t, Fx = jx;
			}
		}
		function Nl() {
			if (Fx === jx) {
				Fx = kx;
				var e = Gx;
				if (e !== null) {
					x_ = g_();
					var t = S_, n = x_;
					!Sg || n <= t || ($_ ? $_.run(console.timeStamp.bind(console, e, t, n, H, V, "secondary-light")) : console.timeStamp(e, t, n, H, V, "secondary-light"));
				}
				e = Ix, t = Lx, n = Rx;
				var r = !!(t.flags & 8772);
				if (t.subtreeFlags & 8772 || r) {
					r = B.T, B.T = null;
					var i = Yf.p;
					Yf.p = Hp;
					var a = Wb;
					Wb |= Ib;
					try {
						Cb = n, wb = e, _i(), wc(e, t.alternate, t), wb = Cb = null;
					} finally {
						Wb = a, Yf.p = i, B.T = r;
					}
				}
				e = Bx, t = Ux, S_ = g_(), e = t === null ? e : x_, t = S_, n = Wx === Ex, r = Cx, C_ === null ? !Sg || t <= e || (r ? r.run(console.timeStamp.bind(console, n ? "Commit Interrupted View Transition" : "Commit", e, t, H, V, n ? "error" : "secondary-dark")) : console.timeStamp(n ? "Commit Interrupted View Transition" : "Commit", e, t, H, V, n ? "error" : "secondary-dark")) : ur(e, t, C_, !1, r), Fx = Mx;
			}
		}
		function Pl() {
			if (Fx === Nx || Fx === Mx) {
				if (Fx === Nx) {
					var e = S_;
					S_ = g_();
					var t = S_, n = Wx === Ex;
					!Sg || t <= e || ($_ ? $_.run(console.timeStamp.bind(console, n ? "Interrupted View Transition" : "Starting Animation", e, t, H, V, n ? "error" : "secondary-light")) : console.timeStamp(n ? "Interrupted View Transition" : "Starting Animation", e, t, H, V, n ? " error" : "secondary-light")), Wx !== Ex && (Wx = Ox);
				}
				Fx = kx, Sp(), e = Ix;
				var r = Lx;
				t = Rx, n = Hx;
				var i = r.actualDuration !== 0 || !!(r.subtreeFlags & 10256) || !!(r.flags & 10256);
				i ? Fx = Px : (Fx = kx, Lx = Ix = null, Il(e, e.pendingLanes), Qx = 0, $x = null);
				var a = e.pendingLanes;
				if (a === 0 && (wx = null), i || ql(e), a = qe(t), r = r.stateNode, Np && typeof Np.onCommitFiberRoot == "function") try {
					var o = (r.current.flags & 128) == 128;
					switch (a) {
						case Hp:
							var s = Tp;
							break;
						case Up:
							s = Ep;
							break;
						case Wp:
							s = Dp;
							break;
						case Gp:
							s = kp;
							break;
						default: s = Dp;
					}
					Np.onCommitFiberRoot(Mp, r, s, o);
				} catch (e) {
					Pp || (Pp = !0, console.error("React instrumentation encountered an error: %o", e));
				}
				if (Fp && e.memoizedUpdaters.clear(), nl(), n !== null) {
					o = B.T, s = Yf.p, Yf.p = Hp, B.T = null;
					try {
						var c = e.onRecoverableError;
						for (r = 0; r < n.length; r++) {
							var l = n[r], u = Fl(l.stack);
							D(l.source, c, l.value, u);
						}
					} finally {
						B.T = o, Yf.p = s;
					}
				}
				Rx & 3 && Ll(), P(e), a = e.pendingLanes, t & 261930 && a & 42 ? (rv = !0, e === Jx ? qx++ : (qx = 0, Jx = e)) : qx = 0, i || pl(t, S_), F(0, !1);
			}
		}
		function Fl(e) {
			return e = { componentStack: e }, Object.defineProperty(e, "digest", { get: function() {
				console.error("You are accessing \"digest\" from the errorInfo object passed to onRecoverableError. This property is no longer provided as part of errorInfo but can be accessed as a property of the Error instance itself.");
			} }), e;
		}
		function Il(e, t) {
			(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, di(t)));
		}
		function Ll() {
			return Ml(), Nl(), Pl(), Rl();
		}
		function Rl() {
			if (Fx !== Px) return !1;
			var e = Ix, t = zx;
			zx = 0;
			var n = qe(Rx), r = Wp === 0 || Wp > n ? Wp : n;
			n = B.T;
			var i = Yf.p;
			try {
				Yf.p = r, B.T = null;
				var a = Vx;
				Vx = null, r = Ix;
				var o = Rx;
				if (Fx = kx, Lx = Ix = null, Rx = 0, (Wb & (Fb | Ib)) !== Pb) throw Error("Cannot flush passive effects while already rendering.");
				Qn(o), Yx = !0, Xx = !1;
				var s = 0;
				if (C_ = null, s = Cp(), Wx === Ox) dr(S_, s, $_);
				else {
					var c = S_, l = s, u = Wx === Dx;
					!Sg || l <= c || (Cx ? Cx.run(console.timeStamp.bind(console, u ? "Waiting for Paint" : "Waiting", c, l, H, V, "secondary-light")) : console.timeStamp(u ? "Waiting for Paint" : "Waiting", c, l, H, V, "secondary-light"));
				}
				c = Wb, Wb |= Ib;
				var d = r.current;
				_i(), Qc(d);
				var f = r.current;
				d = Bx, _i(), Wc(r, f, o, a, d), ql(r), Wb = c;
				var p = Cp();
				if (f = s, d = Cx, C_ === null ? !Sg || p <= f || (d ? d.run(console.timeStamp.bind(console, "Remaining Effects", f, p, H, V, "secondary-dark")) : console.timeStamp("Remaining Effects", f, p, H, V, "secondary-dark")) : ur(f, p, C_, !0, d), pl(o, p), F(0, !1), Xx ? r === $x ? Qx++ : (Qx = 0, $x = r) : Qx = 0, Xx = Yx = !1, Np && typeof Np.onPostCommitFiberRoot == "function") try {
					Np.onPostCommitFiberRoot(Mp, r);
				} catch (e) {
					Pp || (Pp = !0, console.error("React instrumentation encountered an error: %o", e));
				}
				var m = r.current.stateNode;
				return m.effectDuration = 0, m.passiveEffectDuration = 0, !0;
			} finally {
				Yf.p = i, B.T = n, Il(e, t);
			}
		}
		function zl(e, t, n) {
			t = Nr(n, t), Oi(t), t = us(e.stateNode, t, 2), e = ia(e, t, 2), e !== null && (ze(e, 2), P(e));
		}
		function N(e, t, n) {
			if (eS = !1, e.tag === 3) zl(e, e, n);
			else {
				for (; t !== null;) {
					if (t.tag === 3) {
						zl(t, e, n);
						return;
					}
					if (t.tag === 1) {
						var r = t.stateNode;
						if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (wx === null || !wx.has(r))) {
							e = Nr(n, e), Oi(e), n = ds(2), r = ia(t, n, 2), r !== null && (fs(n, r, t, e), ze(r, 2), P(r));
							return;
						}
					}
					t = t.return;
				}
				console.error("Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Potential causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.\n\nError message:\n\n%s", n);
			}
		}
		function Bl(e, t, n) {
			var r = e.pingCache;
			if (r === null) {
				r = e.pingCache = new Nb();
				var i = /* @__PURE__ */ new Set();
				r.set(t, i);
			} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
			i.has(n) || (ox = !0, i.add(n), r = Vl.bind(null, e, t, n), Fp && Yl(e, n), t.then(r, r));
		}
		function Vl(e, t, n) {
			var r = e.pingCache;
			r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, n & 127 ? 0 > A_ && (k_ = A_ = g_(), j_ = __("Promise Resolved"), M_ = y_) : n & 4194048 && 0 > V_ && (z_ = V_ = g_(), U_ = __("Promise Resolved"), H_ = y_), rl() && B.actQueue === null && console.error("A suspended resource finished loading inside a test, but the event was not wrapped in act(...).\n\nWhen testing, code that resolves suspended data should be wrapped into act(...):\n\nact(() => {\n  /* finish loading suspended data */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act"), Gb === e && (Q & n) === n && (cx === Vb || cx === Bb && (Q & 62914560) === Q && Cp() - _x < yx ? (Wb & Fb) === Pb && ml(e, 0) : dx |= n, px === Q && (px = 0)), P(e);
		}
		function Hl(e, t) {
			t === 0 && (t = Le()), e = hr(e, t), e !== null && (ze(e, t), P(e));
		}
		function Ul(e) {
			var t = e.memoizedState, n = 0;
			t !== null && (n = t.retryLane), Hl(e, n);
		}
		function Wl(e, t) {
			var n = 0;
			switch (e.tag) {
				case 31:
				case 13:
					var r = e.stateNode, i = e.memoizedState;
					i !== null && (n = i.retryLane);
					break;
				case 19:
					r = e.stateNode;
					break;
				case 22:
					r = e.stateNode._retryCache;
					break;
				default: throw Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
			}
			r !== null && r.delete(t), Hl(e, n);
		}
		function Gl(e, t, n) {
			if (t.subtreeFlags & 67117056) for (t = t.child; t !== null;) {
				var r = e, i = t, a = i.type === Ff;
				a = n || a, i.tag === 22 ? i.memoizedState === null && (a && i.flags & 8192 ? D(i, Kl, r, i) : i.subtreeFlags & 67108864 && D(i, Gl, r, i, a)) : i.flags & 67108864 ? a && D(i, Kl, r, i) : Gl(r, i, a), t = t.sibling;
			}
		}
		function Kl(e, t) {
			je(!0);
			try {
				Lc(t), el(t), zc(e, t.alternate, t, !1), Kc(e, t, 0, null, !1, 0);
			} finally {
				je(!1);
			}
		}
		function ql(e) {
			var t = !0;
			e.current.mode & (zg | Bg) || (t = !1), Gl(e, e.current, t);
		}
		function Jl(e) {
			if ((Wb & Fb) === Pb) {
				var t = e.tag;
				if (t === 3 || t === 1 || t === 0 || t === 11 || t === 14 || t === 15) {
					if (t = C(e) || "ReactComponent", tS !== null) {
						if (tS.has(t)) return;
						tS.add(t);
					} else tS = /* @__PURE__ */ new Set([t]);
					D(e, function() {
						console.error("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead.");
					});
				}
			}
		}
		function Yl(e, t) {
			Fp && e.memoizedUpdaters.forEach(function(n) {
				Ge(e, n, t);
			});
		}
		function Xl(e, t) {
			var n = B.actQueue;
			return n === null ? yp(e, t) : (n.push(t), iS);
		}
		function Zl(e) {
			rl() && B.actQueue === null && D(e, function() {
				console.error("An update to %s inside a test was not wrapped in act(...).\n\nWhen testing, code that causes React state updates should be wrapped into act(...):\n\nact(() => {\n  /* fire events that update state */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act", C(e));
			});
		}
		function P(e) {
			e !== oS && e.next === null && (oS === null ? aS = oS = e : oS = oS.next = e), lS = !0, B.actQueue === null ? sS || (sS = !0, ru()) : cS || (cS = !0, ru());
		}
		function F(e, t) {
			if (!uS && lS) {
				uS = !0;
				do
					for (var n = !1, r = aS; r !== null;) {
						if (!t) {
							if (e !== 0) {
								var i = r.pendingLanes;
								if (i === 0) var a = 0;
								else {
									var o = r.suspendedLanes, s = r.pingedLanes;
									a = (1 << 31 - Ip(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
								}
								a !== 0 && (n = !0, tu(r, a));
							} else a = Q, a = Pe(r, r === Gb ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== eC), !(a & 3) || Fe(r, a) || (n = !0, tu(r, a));
						}
						r = r.next;
					}
				while (n);
				uS = !1;
			}
		}
		function I() {
			ZS = window.event, Ql();
		}
		function Ql() {
			lS = cS = sS = !1;
			var e = 0;
			dS !== 0 && Gu() && (e = dS);
			for (var t = Cp(), n = null, r = aS; r !== null;) {
				var i = r.next, a = $l(r, t);
				a === 0 ? (r.next = null, n === null ? aS = i : n.next = i, i === null && (oS = n)) : (n = r, (e !== 0 || a & 3) && (lS = !0)), r = i;
			}
			Fx !== kx && Fx !== Px || F(e, !1), dS !== 0 && (dS = 0);
		}
		function $l(e, t) {
			for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
				var o = 31 - Ip(a), s = 1 << o, c = i[o];
				c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ie(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
			}
			if (t = Gb, n = Q, n = Pe(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== eC), r = e.callbackNode, n === 0 || e === t && (nx === Jb || nx === tx) || e.cancelPendingCommit !== null) return r !== null && nu(r), e.callbackNode = null, e.callbackPriority = 0;
			if (!(n & 3) || Fe(e, n)) {
				if (t = n & -n, t !== e.callbackPriority || B.actQueue !== null && r !== fS) nu(r);
				else return t;
				switch (qe(n)) {
					case Hp:
					case Up:
						n = Ep;
						break;
					case Wp:
						n = Dp;
						break;
					case Gp:
						n = kp;
						break;
					default: n = Dp;
				}
				return r = eu.bind(null, e), B.actQueue === null ? n = yp(n, r) : (B.actQueue.push(r), n = fS), e.callbackPriority = t, e.callbackNode = n, t;
			}
			return r !== null && nu(r), e.callbackPriority = 2, e.callbackNode = null, 2;
		}
		function eu(e, t) {
			if (rv = nv = !1, ZS = window.event, Fx !== kx && Fx !== Px) return e.callbackNode = null, e.callbackPriority = 0, null;
			var n = e.callbackNode;
			if (Wx === Tx && (Wx = Dx), Ll() && e.callbackNode !== n) return null;
			var r = Q;
			return r = Pe(e, e === Gb ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== eC), r === 0 ? null : (sl(e, r, t), $l(e, Cp()), e.callbackNode != null && e.callbackNode === n ? eu.bind(null, e) : null);
		}
		function tu(e, t) {
			if (Ll()) return null;
			nv = rv, rv = !1, sl(e, t, !0);
		}
		function nu(e) {
			e !== fS && e !== null && bp(e);
		}
		function ru() {
			B.actQueue !== null && B.actQueue.push(function() {
				return Ql(), null;
			}), nC(function() {
				(Wb & (Fb | Ib)) === Pb ? Ql() : yp(Tp, I);
			});
		}
		function iu() {
			if (dS === 0) {
				var e = ov;
				e === 0 && (e = zp, zp <<= 1, !(zp & 261888) && (zp = 256)), dS = e;
			}
			return dS;
		}
		function au(e) {
			return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : (O(e, "action"), cn("" + e));
		}
		function ou(e, t) {
			var n = t.ownerDocument.createElement("input");
			return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
		}
		function su(e, t, n, r, i) {
			if (t === "submit" && n && n.stateNode === i) {
				var a = au((i[Jp] || null).action), o = r.submitter;
				o && (t = (t = o[Jp] || null) ? au(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
				var s = new ch("action", "action", null, r, i);
				e.push({
					event: s,
					listeners: [{
						instance: null,
						listener: function() {
							if (r.defaultPrevented) {
								if (dS !== 0) {
									var e = o ? ou(i, o) : new FormData(i), t = {
										pending: !0,
										data: e,
										method: i.method,
										action: a
									};
									Object.freeze(t), Lo(n, t, null, e);
								}
							} else typeof a == "function" && (s.preventDefault(), e = o ? ou(i, o) : new FormData(i), t = {
								pending: !0,
								data: e,
								method: i.method,
								action: a
							}, Object.freeze(t), Lo(n, t, a, e));
						},
						currentTarget: i
					}]
				});
			}
		}
		function cu(e, t, n) {
			e.currentTarget = n;
			try {
				t(e);
			} catch (e) {
				pg(e);
			}
			e.currentTarget = null;
		}
		function lu(e, t) {
			t = !!(t & 4);
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				a: {
					var i = void 0, a = r.event;
					if (r = r.listeners, t) for (var o = r.length - 1; 0 <= o; o--) {
						var s = r[o], c = s.instance, l = s.currentTarget;
						if (s = s.listener, c !== i && a.isPropagationStopped()) break a;
						c === null ? cu(a, s, l) : D(c, cu, a, s, l), i = c;
					}
					else for (o = 0; o < r.length; o++) {
						if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== i && a.isPropagationStopped()) break a;
						c === null ? cu(a, s, l) : D(c, cu, a, s, l), i = c;
					}
				}
			}
		}
		function L(e, t) {
			mS.has(e) || console.error("Did not expect a listenToNonDelegatedEvent() call for \"%s\". This is a bug in React. Please file an issue.", e);
			var n = t[Xp];
			n === void 0 && (n = t[Xp] = /* @__PURE__ */ new Set());
			var r = e + "__bubble";
			n.has(r) || (fu(t, e, 2, !1), n.add(r));
		}
		function uu(e, t, n) {
			mS.has(e) && !t && console.error("Did not expect a listenToNativeEvent() call for \"%s\" in the bubble phase. This is a bug in React. Please file an issue.", e);
			var r = 0;
			t && (r |= 4), fu(n, e, r, t);
		}
		function du(e) {
			if (!e[hS]) {
				e[hS] = !0, tm.forEach(function(t) {
					t !== "selectionchange" && (mS.has(t) || uu(t, !1, e), uu(t, !0, e));
				});
				var t = e.nodeType === 9 ? e : e.ownerDocument;
				t === null || t[hS] || (t[hS] = !0, uu("selectionchange", !1, t));
			}
		}
		function fu(e, t, n, r) {
			switch (pf(t)) {
				case Hp:
					var i = cf;
					break;
				case Up:
					i = lf;
					break;
				default: i = uf;
			}
			n = i.bind(null, t, n, e), i = void 0, !nh || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
				capture: !0,
				passive: i
			}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
		}
		function pu(e, t, n, r, i) {
			var a = r;
			if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
				if (r === null) return;
				var o = r.tag;
				if (o === 3 || o === 4) {
					var s = r.stateNode.containerInfo;
					if (s === i) break;
					if (o === 4) for (o = r.return; o !== null;) {
						var c = o.tag;
						if ((c === 3 || c === 4) && o.stateNode.containerInfo === i) return;
						o = o.return;
					}
					for (; s !== null;) {
						if (o = Ze(s), o === null) return;
						if (c = o.tag, c === 5 || c === 6 || c === 26 || c === 27) {
							r = a = o;
							continue a;
						}
						s = s.parentNode;
					}
				}
				r = r.return;
			}
			fn(function() {
				var r = a, i = un(n), o = [];
				a: {
					var s = sg.get(e);
					if (s !== void 0) {
						var c = ch, l = e;
						switch (e) {
							case "keypress": if (hn(n) === 0) break a;
							case "keydown":
							case "keyup":
								c = Th;
								break;
							case "focusin":
								l = "focus", c = _h;
								break;
							case "focusout":
								l = "blur", c = _h;
								break;
							case "beforeblur":
							case "afterblur":
								c = _h;
								break;
							case "click": if (n.button === 2) break a;
							case "auxclick":
							case "dblclick":
							case "mousedown":
							case "mousemove":
							case "mouseup":
							case "mouseout":
							case "mouseover":
							case "contextmenu":
								c = hh;
								break;
							case "drag":
							case "dragend":
							case "dragenter":
							case "dragexit":
							case "dragleave":
							case "dragover":
							case "dragstart":
							case "drop":
								c = gh;
								break;
							case "touchcancel":
							case "touchend":
							case "touchmove":
							case "touchstart":
								c = Dh;
								break;
							case eg:
							case tg:
							case ng:
								c = vh;
								break;
							case og:
								c = Oh;
								break;
							case "scroll":
							case "scrollend":
								c = uh;
								break;
							case "wheel":
								c = kh;
								break;
							case "copy":
							case "cut":
							case "paste":
								c = yh;
								break;
							case "gotpointercapture":
							case "lostpointercapture":
							case "pointercancel":
							case "pointerdown":
							case "pointermove":
							case "pointerout":
							case "pointerover":
							case "pointerup":
								c = Eh;
								break;
							case "toggle":
							case "beforetoggle": c = Ah;
						}
						var u = !!(t & 4), d = !u && (e === "scroll" || e === "scrollend"), f = u ? s === null ? null : s + "Capture" : s;
						u = [];
						for (var p = r, m; p !== null;) {
							var h = p;
							if (m = h.stateNode, h = h.tag, h !== 5 && h !== 26 && h !== 27 || m === null || f === null || (h = pn(p, f), h != null && u.push(mu(p, h, m))), d) break;
							p = p.return;
						}
						0 < u.length && (s = new c(s, l, null, n, i), o.push({
							event: s,
							listeners: u
						}));
					}
				}
				if (!(t & 7)) {
					a: {
						if (s = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", s && n !== Zm && (l = n.relatedTarget || n.fromElement) && (Ze(l) || l[Yp])) break a;
						if ((c || s) && (s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ze(l) : null, l !== null && (d = x(l), u = l.tag, l !== d || u !== 5 && u !== 27 && u !== 6) && (l = null)) : (c = null, l = r), c !== l)) {
							if (u = hh, h = "onMouseLeave", f = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (u = Eh, h = "onPointerLeave", f = "onPointerEnter", p = "pointer"), d = c == null ? s : $e(c), m = l == null ? s : $e(l), s = new u(h, p + "leave", c, n, i), s.target = d, s.relatedTarget = m, h = null, Ze(i) === r && (u = new u(f, p + "enter", l, n, i), u.target = m, u.relatedTarget = d, h = u), d = h, c && l) b: {
								for (u = gu, f = c, p = l, m = 0, h = f; h; h = u(h)) m++;
								h = 0;
								for (var g = p; g; g = u(g)) h++;
								for (; 0 < m - h;) f = u(f), m--;
								for (; 0 < h - m;) p = u(p), h--;
								for (; m--;) {
									if (f === p || p !== null && f === p.alternate) {
										u = f;
										break b;
									}
									f = u(f), p = u(p);
								}
								u = null;
							}
							else u = null;
							c !== null && _u(o, s, c, u, !1), l !== null && d !== null && _u(o, d, l, u, !0);
						}
					}
					a: {
						if (s = r ? $e(r) : window, c = s.nodeName && s.nodeName.toLowerCase(), c === "select" || c === "input" && s.type === "file") var _ = An;
						else if (Tn(s)) {
							if (Wh) _ = In;
							else {
								_ = Pn;
								var v = Nn;
							}
						} else c = s.nodeName, !c || c.toLowerCase() !== "input" || s.type !== "checkbox" && s.type !== "radio" ? r && tn(r.elementType) && (_ = An) : _ = Fn;
						if (_ &&= _(e, r)) {
							Dn(o, _, n, i);
							break a;
						}
						v && v(e, s, r), e === "focusout" && r && s.type === "number" && r.memoizedProps.value != null && bt(s, "number", s.value);
					}
					switch (v = r ? $e(r) : window, e) {
						case "focusin":
							(Tn(v) || v.contentEditable === "true") && (qh = v, Jh = r, Yh = null);
							break;
						case "focusout":
							Yh = Jh = qh = null;
							break;
						case "mousedown":
							Xh = !0;
							break;
						case "contextmenu":
						case "mouseup":
						case "dragend":
							Xh = !1, Wn(o, n, i);
							break;
						case "selectionchange": if (Kh) break;
						case "keydown":
						case "keyup": Wn(o, n, i);
					}
					var y;
					if (Nh) b: {
						switch (e) {
							case "compositionstart":
								var b = "onCompositionStart";
								break b;
							case "compositionend":
								b = "onCompositionEnd";
								break b;
							case "compositionupdate":
								b = "onCompositionUpdate";
								break b;
						}
						b = void 0;
					}
					else Bh ? xn(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === Mh && (b = "onCompositionStart");
					b && (Ih && n.locale !== "ko" && (Bh || b !== "onCompositionStart" ? b === "onCompositionEnd" && Bh && (y = mn()) : (ih = i, ah = "value" in ih ? ih.value : ih.textContent, Bh = !0)), v = hu(r, b), 0 < v.length && (b = new bh(b, e, null, n, i), o.push({
						event: b,
						listeners: v
					}), y ? b.data = y : (y = Sn(n), y !== null && (b.data = y)))), (y = Fh ? Cn(e, n) : wn(e, n)) && (b = hu(r, "onBeforeInput"), 0 < b.length && (v = new xh("onBeforeInput", "beforeinput", null, n, i), o.push({
						event: v,
						listeners: b
					}), v.data = y)), su(o, e, r, n, i);
				}
				lu(o, t);
			});
		}
		function mu(e, t, n) {
			return {
				instance: e,
				listener: t,
				currentTarget: n
			};
		}
		function hu(e, t) {
			for (var n = t + "Capture", r = []; e !== null;) {
				var i = e, a = i.stateNode;
				if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = pn(e, n), i != null && r.unshift(mu(e, i, a)), i = pn(e, t), i != null && r.push(mu(e, i, a))), e.tag === 3) return r;
				e = e.return;
			}
			return [];
		}
		function gu(e) {
			if (e === null) return null;
			do
				e = e.return;
			while (e && e.tag !== 5 && e.tag !== 27);
			return e || null;
		}
		function _u(e, t, n, r, i) {
			for (var a = t._reactName, o = []; n !== null && n !== r;) {
				var s = n, c = s.alternate, l = s.stateNode;
				if (s = s.tag, c !== null && c === r) break;
				s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = pn(n, a), l != null && o.unshift(mu(n, l, c))) : i || (l = pn(n, a), l != null && o.push(mu(n, l, c)))), n = n.return;
			}
			o.length !== 0 && e.push({
				event: t,
				listeners: o
			});
		}
		function vu(e, t) {
			an(e, t), e !== "input" && e !== "textarea" && e !== "select" || t == null || t.value !== null || Wm || (Wm = !0, e === "select" && t.multiple ? console.error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : console.error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
			var n = {
				registrationNameDependencies: nm,
				possibleRegistrationNames: rm
			};
			tn(e) || typeof t.is == "string" || sn(e, t, n), t.contentEditable && !t.suppressContentEditableWarning && t.children != null && console.error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
		}
		function yu(e, t, n, r) {
			t !== n && (n = Cu(n), Cu(t) !== n && (r[e] = t));
		}
		function bu(e, t, n) {
			t.forEach(function(t) {
				n[ku(t)] = t === "style" ? Au(e) : e.getAttribute(t);
			});
		}
		function xu(e, t) {
			!1 === t ? console.error("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : console.error("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
		}
		function Su(e, t) {
			return e = e.namespaceURI === Im || e.namespaceURI === Lm ? e.ownerDocument.createElementNS(e.namespaceURI, e.tagName) : e.ownerDocument.createElement(e.tagName), e.innerHTML = t, e.innerHTML;
		}
		function Cu(e) {
			return Ee(e) && (console.error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before using it here.", Te(e)), De(e)), (typeof e == "string" ? e : "" + e).replace(wS, "\n").replace(TS, "");
		}
		function wu(e, t) {
			return t = Cu(t), Cu(e) === t;
		}
		function Tu(e, t, n, r, i, a) {
			switch (n) {
				case "children":
					typeof r == "string" ? (Xt(r, t, !1), t === "body" || t === "textarea" && r === "" || Zt(e, r)) : (typeof r == "number" || typeof r == "bigint") && (Xt("" + r, t, !1), t !== "body" && Zt(e, "" + r));
					break;
				case "className":
					ct(e, "class", r);
					break;
				case "tabIndex":
					ct(e, "tabindex", r);
					break;
				case "dir":
				case "role":
				case "viewBox":
				case "width":
				case "height":
					ct(e, n, r);
					break;
				case "style":
					en(e, r, a);
					break;
				case "data": if (t !== "object") {
					ct(e, "data", r);
					break;
				}
				case "src":
				case "href":
					if (r === "" && (t !== "a" || n !== "href")) {
						console.error(n === "src" ? "An empty string (\"\") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string." : "An empty string (\"\") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.", n, n), e.removeAttribute(n);
						break;
					}
					if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
						e.removeAttribute(n);
						break;
					}
					O(r, n), r = cn("" + r), e.setAttribute(n, r);
					break;
				case "action":
				case "formAction":
					if (r != null && (t === "form" ? n === "formAction" ? console.error("You can only pass the formAction prop to <input> or <button>. Use the action prop on <form>.") : typeof r == "function" && (i.encType == null && i.method == null || xS || (xS = !0, console.error("Cannot specify a encType or method for a form that specifies a function as the action. React provides those automatically. They will get overridden.")), i.target == null || bS || (bS = !0, console.error("Cannot specify a target for a form that specifies a function as the action. The function will always be executed in the same window."))) : t === "input" || t === "button" ? n === "action" ? console.error("You can only pass the action prop to <form>. Use the formAction prop on <input> or <button>.") : t !== "input" || i.type === "submit" || i.type === "image" || vS ? t !== "button" || i.type == null || i.type === "submit" || vS ? typeof r == "function" && (i.name == null || yS || (yS = !0, console.error("Cannot specify a \"name\" prop for a button that specifies a function as a formAction. React needs it to encode which action should be invoked. It will get overridden.")), i.formEncType == null && i.formMethod == null || xS || (xS = !0, console.error("Cannot specify a formEncType or formMethod for a button that specifies a function as a formAction. React provides those automatically. They will get overridden.")), i.formTarget == null || bS || (bS = !0, console.error("Cannot specify a formTarget for a button that specifies a function as a formAction. The function will always be executed in the same window."))) : (vS = !0, console.error("A button can only specify a formAction along with type=\"submit\" or no type.")) : (vS = !0, console.error("An input can only specify a formAction along with type=\"submit\" or type=\"image\".")) : console.error(n === "action" ? "You can only pass the action prop to <form>." : "You can only pass the formAction prop to <input> or <button>.")), typeof r == "function") {
						e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
						break;
					}
					if (typeof a == "function" && (n === "formAction" ? (t !== "input" && Tu(e, t, "name", i.name, i, null), Tu(e, t, "formEncType", i.formEncType, i, null), Tu(e, t, "formMethod", i.formMethod, i, null), Tu(e, t, "formTarget", i.formTarget, i, null)) : (Tu(e, t, "encType", i.encType, i, null), Tu(e, t, "method", i.method, i, null), Tu(e, t, "target", i.target, i, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
						e.removeAttribute(n);
						break;
					}
					O(r, n), r = cn("" + r), e.setAttribute(n, r);
					break;
				case "onClick":
					r != null && (typeof r != "function" && xu(n, r), e.onclick = ln);
					break;
				case "onScroll":
					r != null && (typeof r != "function" && xu(n, r), L("scroll", e));
					break;
				case "onScrollEnd":
					r != null && (typeof r != "function" && xu(n, r), L("scrollend", e));
					break;
				case "dangerouslySetInnerHTML":
					if (r != null) {
						if (typeof r != "object" || !("__html" in r)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
						if (n = r.__html, n != null) {
							if (i.children != null) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
							e.innerHTML = n;
						}
					}
					break;
				case "multiple":
					e.multiple = r && typeof r != "function" && typeof r != "symbol";
					break;
				case "muted":
					e.muted = r && typeof r != "function" && typeof r != "symbol";
					break;
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "defaultValue":
				case "defaultChecked":
				case "innerHTML":
				case "ref": break;
				case "autoFocus": break;
				case "xlinkHref":
					if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
						e.removeAttribute("xlink:href");
						break;
					}
					O(r, n), n = cn("" + r), e.setAttributeNS(ES, "xlink:href", n);
					break;
				case "contentEditable":
				case "spellCheck":
				case "draggable":
				case "value":
				case "autoReverse":
				case "externalResourcesRequired":
				case "focusable":
				case "preserveAlpha":
					r != null && typeof r != "function" && typeof r != "symbol" ? (O(r, n), e.setAttribute(n, "" + r)) : e.removeAttribute(n);
					break;
				case "inert": r !== "" || CS[n] || (CS[n] = !0, console.error("Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.", n));
				case "allowFullScreen":
				case "async":
				case "autoPlay":
				case "controls":
				case "default":
				case "defer":
				case "disabled":
				case "disablePictureInPicture":
				case "disableRemotePlayback":
				case "formNoValidate":
				case "hidden":
				case "loop":
				case "noModule":
				case "noValidate":
				case "open":
				case "playsInline":
				case "readOnly":
				case "required":
				case "reversed":
				case "scoped":
				case "seamless":
				case "itemScope":
					r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
					break;
				case "capture":
				case "download":
					!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? (O(r, n), e.setAttribute(n, r)) : e.removeAttribute(n);
					break;
				case "cols":
				case "rows":
				case "size":
				case "span":
					r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? (O(r, n), e.setAttribute(n, r)) : e.removeAttribute(n);
					break;
				case "rowSpan":
				case "start":
					r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : (O(r, n), e.setAttribute(n, r));
					break;
				case "popover":
					L("beforetoggle", e), L("toggle", e), st(e, "popover", r);
					break;
				case "xlinkActuate":
					lt(e, ES, "xlink:actuate", r);
					break;
				case "xlinkArcrole":
					lt(e, ES, "xlink:arcrole", r);
					break;
				case "xlinkRole":
					lt(e, ES, "xlink:role", r);
					break;
				case "xlinkShow":
					lt(e, ES, "xlink:show", r);
					break;
				case "xlinkTitle":
					lt(e, ES, "xlink:title", r);
					break;
				case "xlinkType":
					lt(e, ES, "xlink:type", r);
					break;
				case "xmlBase":
					lt(e, DS, "xml:base", r);
					break;
				case "xmlLang":
					lt(e, DS, "xml:lang", r);
					break;
				case "xmlSpace":
					lt(e, DS, "xml:space", r);
					break;
				case "is":
					a != null && console.error("Cannot update the \"is\" prop after it has been initialized."), st(e, "is", r);
					break;
				case "innerText":
				case "textContent": break;
				case "popoverTarget": SS || typeof r != "object" || !r || (SS = !0, console.error("The `popoverTarget` prop expects the ID of an Element as a string. Received %s instead.", r));
				default: !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N" ? (n = nn(n), st(e, n, r)) : nm.hasOwnProperty(n) && r != null && typeof r != "function" && xu(n, r);
			}
		}
		function Eu(e, t, n, r, i, a) {
			switch (n) {
				case "style":
					en(e, r, a);
					break;
				case "dangerouslySetInnerHTML":
					if (r != null) {
						if (typeof r != "object" || !("__html" in r)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
						if (n = r.__html, n != null) {
							if (i.children != null) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
							e.innerHTML = n;
						}
					}
					break;
				case "children":
					typeof r == "string" ? Zt(e, r) : (typeof r == "number" || typeof r == "bigint") && Zt(e, "" + r);
					break;
				case "onScroll":
					r != null && (typeof r != "function" && xu(n, r), L("scroll", e));
					break;
				case "onScrollEnd":
					r != null && (typeof r != "function" && xu(n, r), L("scrollend", e));
					break;
				case "onClick":
					r != null && (typeof r != "function" && xu(n, r), e.onclick = ln);
					break;
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "innerHTML":
				case "ref": break;
				case "innerText":
				case "textContent": break;
				default: if (nm.hasOwnProperty(n)) r != null && typeof r != "function" && xu(n, r);
				else a: {
					if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), a = e[Jp] || null, a = a == null ? null : a[n], typeof a == "function" && e.removeEventListener(t, a, i), typeof r == "function")) {
						typeof a != "function" && a !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
						break a;
					}
					n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : st(e, n, r);
				}
			}
		}
		function Du(e, t, n) {
			switch (vu(t, n), t) {
				case "div":
				case "span":
				case "svg":
				case "path":
				case "a":
				case "g":
				case "p":
				case "li": break;
				case "img":
					L("error", e), L("load", e);
					var r = !1, i = !1, a;
					for (a in n) if (n.hasOwnProperty(a)) {
						var o = n[a];
						if (o != null) switch (a) {
							case "src":
								r = !0;
								break;
							case "srcSet":
								i = !0;
								break;
							case "children":
							case "dangerouslySetInnerHTML": throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
							default: Tu(e, t, a, o, n, null);
						}
					}
					i && Tu(e, t, "srcSet", n.srcSet, n, null), r && Tu(e, t, "src", n.src, n, null);
					return;
				case "input":
					it("input", n), L("invalid", e);
					var s = a = o = i = null, c = null, l = null;
					for (r in n) if (n.hasOwnProperty(r)) {
						var u = n[r];
						if (u != null) switch (r) {
							case "name":
								i = u;
								break;
							case "type":
								o = u;
								break;
							case "checked":
								c = u;
								break;
							case "defaultChecked":
								l = u;
								break;
							case "value":
								a = u;
								break;
							case "defaultValue":
								s = u;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (u != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
								break;
							default: Tu(e, t, r, u, n, null);
						}
					}
					_t(e, n), yt(e, a, s, c, l, o, i, !1);
					return;
				case "select":
					for (i in it("select", n), L("invalid", e), r = o = a = null, n) if (n.hasOwnProperty(i) && (s = n[i], s != null)) switch (i) {
						case "value":
							a = s;
							break;
						case "defaultValue":
							o = s;
							break;
						case "multiple": r = s;
						default: Tu(e, t, i, s, n, null);
					}
					wt(e, n), t = a, n = o, e.multiple = !!r, t == null ? n != null && Ct(e, !!r, n, !0) : Ct(e, !!r, t, !1);
					return;
				case "textarea":
					for (o in it("textarea", n), L("invalid", e), a = i = r = null, n) if (n.hasOwnProperty(o) && (s = n[o], s != null)) switch (o) {
						case "value":
							r = s;
							break;
						case "defaultValue":
							i = s;
							break;
						case "children":
							a = s;
							break;
						case "dangerouslySetInnerHTML":
							if (s != null) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
							break;
						default: Tu(e, t, o, s, n, null);
					}
					Tt(e, n), Dt(e, r, i, a);
					return;
				case "option":
					for (c in xt(e, n), n) if (n.hasOwnProperty(c) && (r = n[c], r != null)) switch (c) {
						case "selected":
							e.selected = r && typeof r != "function" && typeof r != "symbol";
							break;
						default: Tu(e, t, c, r, n, null);
					}
					return;
				case "dialog":
					L("beforetoggle", e), L("toggle", e), L("cancel", e), L("close", e);
					break;
				case "iframe":
				case "object":
					L("load", e);
					break;
				case "video":
				case "audio":
					for (r = 0; r < pS.length; r++) L(pS[r], e);
					break;
				case "image":
					L("error", e), L("load", e);
					break;
				case "details":
					L("toggle", e);
					break;
				case "embed":
				case "source":
				case "link": L("error", e), L("load", e);
				case "area":
				case "base":
				case "br":
				case "col":
				case "hr":
				case "keygen":
				case "meta":
				case "param":
				case "track":
				case "wbr":
				case "menuitem":
					for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
						default: Tu(e, t, l, r, n, null);
					}
					return;
				default: if (tn(t)) {
					for (u in n) n.hasOwnProperty(u) && (r = n[u], r !== void 0 && Eu(e, t, u, r, n, void 0));
					return;
				}
			}
			for (s in n) n.hasOwnProperty(s) && (r = n[s], r != null && Tu(e, t, s, r, n, null));
		}
		function Ou(e, t, n, r) {
			switch (vu(t, r), t) {
				case "div":
				case "span":
				case "svg":
				case "path":
				case "a":
				case "g":
				case "p":
				case "li": break;
				case "input":
					var i = null, a = null, o = null, s = null, c = null, l = null, u = null;
					for (p in n) {
						var d = n[p];
						if (n.hasOwnProperty(p) && d != null) switch (p) {
							case "checked": break;
							case "value": break;
							case "defaultValue": c = d;
							default: r.hasOwnProperty(p) || Tu(e, t, p, null, r, d);
						}
					}
					for (var f in r) {
						var p = r[f];
						if (d = n[f], r.hasOwnProperty(f) && (p != null || d != null)) switch (f) {
							case "type":
								a = p;
								break;
							case "name":
								i = p;
								break;
							case "checked":
								l = p;
								break;
							case "defaultChecked":
								u = p;
								break;
							case "value":
								o = p;
								break;
							case "defaultValue":
								s = p;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (p != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
								break;
							default: p !== d && Tu(e, t, f, p, r, d);
						}
					}
					t = n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null, r = r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null, t || !r || _S || (console.error("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"), _S = !0), !t || r || gS || (console.error("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"), gS = !0), vt(e, o, s, c, l, u, a, i);
					return;
				case "select":
					for (a in p = o = s = f = null, n) if (c = n[a], n.hasOwnProperty(a) && c != null) switch (a) {
						case "value": break;
						case "multiple": p = c;
						default: r.hasOwnProperty(a) || Tu(e, t, a, null, r, c);
					}
					for (i in r) if (a = r[i], c = n[i], r.hasOwnProperty(i) && (a != null || c != null)) switch (i) {
						case "value":
							f = a;
							break;
						case "defaultValue":
							s = a;
							break;
						case "multiple": o = a;
						default: a !== c && Tu(e, t, i, a, r, c);
					}
					r = s, t = o, n = p, f == null ? !!n != !!t && (r == null ? Ct(e, !!t, t ? [] : "", !1) : Ct(e, !!t, r, !0)) : Ct(e, !!t, f, !1);
					return;
				case "textarea":
					for (s in p = f = null, n) if (i = n[s], n.hasOwnProperty(s) && i != null && !r.hasOwnProperty(s)) switch (s) {
						case "value": break;
						case "children": break;
						default: Tu(e, t, s, null, r, i);
					}
					for (o in r) if (i = r[o], a = n[o], r.hasOwnProperty(o) && (i != null || a != null)) switch (o) {
						case "value":
							f = i;
							break;
						case "defaultValue":
							p = i;
							break;
						case "children": break;
						case "dangerouslySetInnerHTML":
							if (i != null) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
							break;
						default: i !== a && Tu(e, t, o, i, r, a);
					}
					Et(e, f, p);
					return;
				case "option":
					for (var m in n) if (f = n[m], n.hasOwnProperty(m) && f != null && !r.hasOwnProperty(m)) switch (m) {
						case "selected":
							e.selected = !1;
							break;
						default: Tu(e, t, m, null, r, f);
					}
					for (c in r) if (f = r[c], p = n[c], r.hasOwnProperty(c) && f !== p && (f != null || p != null)) switch (c) {
						case "selected":
							e.selected = f && typeof f != "function" && typeof f != "symbol";
							break;
						default: Tu(e, t, c, f, r, p);
					}
					return;
				case "img":
				case "link":
				case "area":
				case "base":
				case "br":
				case "col":
				case "embed":
				case "hr":
				case "keygen":
				case "meta":
				case "param":
				case "source":
				case "track":
				case "wbr":
				case "menuitem":
					for (var h in n) f = n[h], n.hasOwnProperty(h) && f != null && !r.hasOwnProperty(h) && Tu(e, t, h, null, r, f);
					for (l in r) if (f = r[l], p = n[l], r.hasOwnProperty(l) && f !== p && (f != null || p != null)) switch (l) {
						case "children":
						case "dangerouslySetInnerHTML":
							if (f != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
							break;
						default: Tu(e, t, l, f, r, p);
					}
					return;
				default: if (tn(t)) {
					for (var g in n) f = n[g], n.hasOwnProperty(g) && f !== void 0 && !r.hasOwnProperty(g) && Eu(e, t, g, void 0, r, f);
					for (u in r) f = r[u], p = n[u], !r.hasOwnProperty(u) || f === p || f === void 0 && p === void 0 || Eu(e, t, u, f, r, p);
					return;
				}
			}
			for (var _ in n) f = n[_], n.hasOwnProperty(_) && f != null && !r.hasOwnProperty(_) && Tu(e, t, _, null, r, f);
			for (d in r) f = r[d], p = n[d], !r.hasOwnProperty(d) || f === p || f == null && p == null || Tu(e, t, d, f, r, p);
		}
		function ku(e) {
			switch (e) {
				case "class": return "className";
				case "for": return "htmlFor";
				default: return e;
			}
		}
		function Au(e) {
			var t = {};
			e = e.style;
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				t[r] = e.getPropertyValue(r);
			}
			return t;
		}
		function ju(e, t, n) {
			if (t != null && typeof t != "object") console.error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
			else {
				var r, i = r = "", a;
				for (a in t) if (t.hasOwnProperty(a)) {
					var o = t[a];
					o != null && typeof o != "boolean" && o !== "" && (a.indexOf("--") === 0 ? (Oe(o, a), r += i + a + ":" + ("" + o).trim()) : typeof o != "number" || o === 0 || Fm.has(a) ? (Oe(o, a), r += i + a.replace(Tm, "-$1").toLowerCase().replace(Em, "-ms-") + ":" + ("" + o).trim()) : r += i + a.replace(Tm, "-$1").toLowerCase().replace(Em, "-ms-") + ":" + o + "px", i = ";");
				}
				r ||= null, t = e.getAttribute("style"), t !== r && (r = Cu(r), Cu(t) !== r && (n.style = Au(e)));
			}
		}
		function Mu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (O(r, t), e === "" + r) return;
			}
			yu(t, e, r, a);
		}
		function Nu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) {
				switch (typeof r) {
					case "function":
					case "symbol": return;
				}
				if (!r) return;
			} else switch (typeof r) {
				case "function":
				case "symbol": break;
				default: if (r) return;
			}
			yu(t, e, r, a);
		}
		function Pu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol": break;
				default: if (O(r, n), e === "" + r) return;
			}
			yu(t, e, r, a);
		}
		function Fu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
				default: if (isNaN(r)) return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (!isNaN(r) && (O(r, t), e === "" + r)) return;
			}
			yu(t, e, r, a);
		}
		function Iu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (O(r, t), n = cn("" + r), e === n) return;
			}
			yu(t, e, r, a);
		}
		function Lu(e, t, n, r) {
			for (var i = {}, a = /* @__PURE__ */ new Set(), o = e.attributes, s = 0; s < o.length; s++) switch (o[s].name.toLowerCase()) {
				case "value": break;
				case "checked": break;
				case "selected": break;
				default: a.add(o[s].name);
			}
			if (tn(t)) {
				for (var c in n) if (n.hasOwnProperty(c)) {
					var l = n[c];
					if (l != null) {
						if (nm.hasOwnProperty(c)) typeof l != "function" && xu(c, l);
						else if (!0 !== n.suppressHydrationWarning) switch (c) {
							case "children":
								typeof l != "string" && typeof l != "number" || yu("children", e.textContent, l, i);
								continue;
							case "suppressContentEditableWarning":
							case "suppressHydrationWarning":
							case "defaultValue":
							case "defaultChecked":
							case "innerHTML":
							case "ref": continue;
							case "dangerouslySetInnerHTML":
								o = e.innerHTML, l = l ? l.__html : void 0, l != null && (l = Su(e, l), yu(c, o, l, i));
								continue;
							case "style":
								a.delete(c), ju(e, l, i);
								continue;
							case "offsetParent":
							case "offsetTop":
							case "offsetLeft":
							case "offsetWidth":
							case "offsetHeight":
							case "isContentEditable":
							case "outerText":
							case "outerHTML":
								a.delete(c.toLowerCase()), console.error("Assignment to read-only property will result in a no-op: `%s`", c);
								continue;
							case "className":
								a.delete("class"), o = ot(e, "class", l), yu("className", o, l, i);
								continue;
							default: r.context === WS && t !== "svg" && t !== "math" ? a.delete(c.toLowerCase()) : a.delete(c), o = ot(e, c, l), yu(c, o, l, i);
						}
					}
				}
			} else for (l in n) if (n.hasOwnProperty(l) && (c = n[l], c != null)) {
				if (nm.hasOwnProperty(l)) typeof c != "function" && xu(l, c);
				else if (!0 !== n.suppressHydrationWarning) switch (l) {
					case "children":
						typeof c != "string" && typeof c != "number" || yu("children", e.textContent, c, i);
						continue;
					case "suppressContentEditableWarning":
					case "suppressHydrationWarning":
					case "value":
					case "checked":
					case "selected":
					case "defaultValue":
					case "defaultChecked":
					case "innerHTML":
					case "ref": continue;
					case "dangerouslySetInnerHTML":
						o = e.innerHTML, c = c ? c.__html : void 0, c != null && (c = Su(e, c), o !== c && (i[l] = { __html: o }));
						continue;
					case "className":
						Mu(e, l, "class", c, a, i);
						continue;
					case "tabIndex":
						Mu(e, l, "tabindex", c, a, i);
						continue;
					case "style":
						a.delete(l), ju(e, c, i);
						continue;
					case "multiple":
						a.delete(l), yu(l, e.multiple, c, i);
						continue;
					case "muted":
						a.delete(l), yu(l, e.muted, c, i);
						continue;
					case "autoFocus":
						a.delete("autofocus"), yu(l, e.autofocus, c, i);
						continue;
					case "data": if (t !== "object") {
						a.delete(l), o = e.getAttribute("data"), yu(l, o, c, i);
						continue;
					}
					case "src":
					case "href":
						if (!(c !== "" || t === "a" && l === "href" || t === "object" && l === "data")) {
							console.error(l === "src" ? "An empty string (\"\") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string." : "An empty string (\"\") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.", l, l);
							continue;
						}
						Iu(e, l, l, c, a, i);
						continue;
					case "action":
					case "formAction":
						if (o = e.getAttribute(l), typeof c == "function") {
							a.delete(l.toLowerCase()), l === "formAction" ? (a.delete("name"), a.delete("formenctype"), a.delete("formmethod"), a.delete("formtarget")) : (a.delete("enctype"), a.delete("method"), a.delete("target"));
							continue;
						}
						if (o === OS) {
							a.delete(l.toLowerCase()), yu(l, "function", c, i);
							continue;
						}
						Iu(e, l, l.toLowerCase(), c, a, i);
						continue;
					case "xlinkHref":
						Iu(e, l, "xlink:href", c, a, i);
						continue;
					case "contentEditable":
						Pu(e, l, "contenteditable", c, a, i);
						continue;
					case "spellCheck":
						Pu(e, l, "spellcheck", c, a, i);
						continue;
					case "draggable":
					case "autoReverse":
					case "externalResourcesRequired":
					case "focusable":
					case "preserveAlpha":
						Pu(e, l, l, c, a, i);
						continue;
					case "allowFullScreen":
					case "async":
					case "autoPlay":
					case "controls":
					case "default":
					case "defer":
					case "disabled":
					case "disablePictureInPicture":
					case "disableRemotePlayback":
					case "formNoValidate":
					case "hidden":
					case "loop":
					case "noModule":
					case "noValidate":
					case "open":
					case "playsInline":
					case "readOnly":
					case "required":
					case "reversed":
					case "scoped":
					case "seamless":
					case "itemScope":
						Nu(e, l, l.toLowerCase(), c, a, i);
						continue;
					case "capture":
					case "download":
						a: {
							s = e;
							var u = o = l, d = i;
							if (a.delete(u), s = s.getAttribute(u), s === null) switch (typeof c) {
								case "undefined":
								case "function":
								case "symbol": break a;
								default: if (!1 === c) break a;
							}
							else if (c != null) switch (typeof c) {
								case "function":
								case "symbol": break;
								case "boolean":
									if (!0 === c && s === "") break a;
									break;
								default: if (O(c, o), s === "" + c) break a;
							}
							yu(o, s, c, d);
						}
						continue;
					case "cols":
					case "rows":
					case "size":
					case "span":
						a: {
							if (s = e, u = o = l, d = i, a.delete(u), s = s.getAttribute(u), s === null) switch (typeof c) {
								case "undefined":
								case "function":
								case "symbol":
								case "boolean": break a;
								default: if (isNaN(c) || 1 > c) break a;
							}
							else if (c != null) switch (typeof c) {
								case "function":
								case "symbol":
								case "boolean": break;
								default: if (!(isNaN(c) || 1 > c) && (O(c, o), s === "" + c)) break a;
							}
							yu(o, s, c, d);
						}
						continue;
					case "rowSpan":
						Fu(e, l, "rowspan", c, a, i);
						continue;
					case "start":
						Fu(e, l, l, c, a, i);
						continue;
					case "xHeight":
						Mu(e, l, "x-height", c, a, i);
						continue;
					case "xlinkActuate":
						Mu(e, l, "xlink:actuate", c, a, i);
						continue;
					case "xlinkArcrole":
						Mu(e, l, "xlink:arcrole", c, a, i);
						continue;
					case "xlinkRole":
						Mu(e, l, "xlink:role", c, a, i);
						continue;
					case "xlinkShow":
						Mu(e, l, "xlink:show", c, a, i);
						continue;
					case "xlinkTitle":
						Mu(e, l, "xlink:title", c, a, i);
						continue;
					case "xlinkType":
						Mu(e, l, "xlink:type", c, a, i);
						continue;
					case "xmlBase":
						Mu(e, l, "xml:base", c, a, i);
						continue;
					case "xmlLang":
						Mu(e, l, "xml:lang", c, a, i);
						continue;
					case "xmlSpace":
						Mu(e, l, "xml:space", c, a, i);
						continue;
					case "inert":
						c !== "" || CS[l] || (CS[l] = !0, console.error("Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.", l)), Nu(e, l, l, c, a, i);
						continue;
					default: if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") {
						s = nn(l), o = !1, r.context === WS && t !== "svg" && t !== "math" ? a.delete(s.toLowerCase()) : (u = l.toLowerCase(), u = zm.hasOwnProperty(u) && zm[u] || null, u !== null && u !== l && (o = !0, a.delete(u)), a.delete(s));
						a: if (u = e, d = s, s = c, at(d)) {
							if (u.hasAttribute(d)) u = u.getAttribute(d), O(s, d), s = u === "" + s ? s : u;
							else {
								switch (typeof s) {
									case "function":
									case "symbol": break a;
									case "boolean": if (u = d.toLowerCase().slice(0, 5), u !== "data-" && u !== "aria-") break a;
								}
								s = s === void 0 ? void 0 : null;
							}
						} else s = void 0;
						o || yu(l, s, c, i);
					}
				}
			}
			return 0 < a.size && !0 !== n.suppressHydrationWarning && bu(e, a, i), Object.keys(i).length === 0 ? null : i;
		}
		function Ru(e, t) {
			switch (e.length) {
				case 0: return "";
				case 1: return e[0];
				case 2: return e[0] + " " + t + " " + e[1];
				default: return e.slice(0, -1).join(", ") + ", " + t + " " + e[e.length - 1];
			}
		}
		function zu(e) {
			switch (e) {
				case "css":
				case "script":
				case "font":
				case "img":
				case "image":
				case "input":
				case "link": return !0;
				default: return !1;
			}
		}
		function Bu() {
			if (typeof performance.getEntriesByType == "function") {
				for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
					var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
					if (a && s && zu(o)) {
						for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
							var c = n[r], l = c.startTime;
							if (l > s) break;
							var u = c.transferSize, d = c.initiatorType;
							u && zu(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
						}
						if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
					}
				}
				if (0 < e) return t / e / 1e6;
			}
			return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
		}
		function Vu(e) {
			return e.nodeType === 9 ? e : e.ownerDocument;
		}
		function Hu(e) {
			switch (e) {
				case Lm: return GS;
				case Im: return KS;
				default: return WS;
			}
		}
		function Uu(e, t) {
			if (e === WS) switch (t) {
				case "svg": return GS;
				case "math": return KS;
				default: return WS;
			}
			return e === GS && t === "foreignObject" ? WS : e;
		}
		function Wu(e, t) {
			return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
		}
		function Gu() {
			var e = window.event;
			return e && e.type === "popstate" ? e !== XS && (XS = e, !0) : (XS = null, !1);
		}
		function Ku() {
			var e = window.event;
			return e && e !== ZS ? e.type : null;
		}
		function qu() {
			var e = window.event;
			return e && e !== ZS ? e.timeStamp : -1.1;
		}
		function Ju(e) {
			setTimeout(function() {
				throw e;
			});
		}
		function Yu(e, t, n) {
			switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && e.focus();
					break;
				case "img": n.src ? e.src = n.src : n.srcSet && (e.srcset = n.srcSet);
			}
		}
		function Xu() {}
		function Zu(e, t, n, r) {
			Ou(e, t, n, r), e[Jp] = r;
		}
		function Qu(e) {
			Zt(e, "");
		}
		function $u(e, t, n) {
			e.nodeValue = n;
		}
		function ed(e) {
			if (!e.__reactWarnedAboutChildrenConflict) {
				var t = e[Jp] || null;
				if (t !== null) {
					var n = Qe(e);
					n !== null && (typeof t.children == "string" || typeof t.children == "number" ? (e.__reactWarnedAboutChildrenConflict = !0, D(n, function() {
						console.error("Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets \"children\" text content using React. It should be a leaf with no children. Otherwise it's ambiguous which children should be used.");
					})) : t.dangerouslySetInnerHTML != null && (e.__reactWarnedAboutChildrenConflict = !0, D(n, function() {
						console.error("Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets \"dangerouslySetInnerHTML\" using React. It should be a leaf with no children. Otherwise it's ambiguous which children should be used.");
					})));
				}
			}
		}
		function td(e) {
			return e === "head";
		}
		function nd(e, t) {
			e.removeChild(t);
		}
		function rd(e, t) {
			(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).removeChild(t);
		}
		function id(e, t) {
			var n = t, r = 0;
			do {
				var i = n.nextSibling;
				if (e.removeChild(n), i && i.nodeType === 8) {
					if (n = i.data, n === NS || n === jS) {
						if (r === 0) {
							e.removeChild(i), Cf(t);
							return;
						}
						r--;
					} else if (n === MS || n === PS || n === FS || n === IS || n === AS) r++;
					else if (n === LS) kd(e.ownerDocument.documentElement);
					else if (n === zS) {
						n = e.ownerDocument.head, kd(n);
						for (var a = n.firstChild; a;) {
							var o = a.nextSibling, s = a.nodeName;
							a[em] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
						}
					} else n === RS && kd(e.ownerDocument.body);
				}
				n = i;
			} while (n);
			Cf(t);
		}
		function ad(e, t) {
			var n = e;
			e = 0;
			do {
				var r = n.nextSibling;
				if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
					if (n = r.data, n === NS) {
						if (e === 0) break;
						e--;
					} else n !== MS && n !== PS && n !== FS && n !== IS || e++;
				}
				n = r;
			} while (n);
		}
		function od(e) {
			ad(e, !0);
		}
		function sd(e) {
			e = e.style, typeof e.setProperty == "function" ? e.setProperty("display", "none", "important") : e.display = "none";
		}
		function cd(e) {
			e.nodeValue = "";
		}
		function ld(e) {
			ad(e, !1);
		}
		function ud(e, t) {
			t = t[US], t = t != null && t.hasOwnProperty("display") ? t.display : null, e.style.display = t == null || typeof t == "boolean" ? "" : ("" + t).trim();
		}
		function dd(e, t) {
			e.nodeValue = t;
		}
		function fd(e) {
			var t = e.firstChild;
			for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
				var n = t;
				switch (t = t.nextSibling, n.nodeName) {
					case "HTML":
					case "HEAD":
					case "BODY":
						fd(n), Xe(n);
						continue;
					case "SCRIPT":
					case "STYLE": continue;
					case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
				}
				e.removeChild(n);
			}
		}
		function pd(e, t, n, r) {
			for (; e.nodeType === 1;) {
				var i = n;
				if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
					if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
				} else if (!r) {
					if (t === "input" && e.type === "hidden") {
						O(i.name, "name");
						var a = i.name == null ? null : "" + i.name;
						if (i.type === "hidden" && e.getAttribute("name") === a) return e;
					} else return e;
				} else if (!e[em]) switch (t) {
					case "meta":
						if (!e.hasAttribute("itemprop")) break;
						return e;
					case "link":
						if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
						return e;
					case "style":
						if (e.hasAttribute("data-precedence")) break;
						return e;
					case "script":
						if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
						return e;
					default: return e;
				}
				if (e = yd(e.nextSibling), e === null) break;
			}
			return null;
		}
		function md(e, t, n) {
			if (t === "") return null;
			for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = yd(e.nextSibling), e === null)) return null;
			return e;
		}
		function hd(e, t) {
			for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = yd(e.nextSibling), e === null)) return null;
			return e;
		}
		function gd(e) {
			return e.data === PS || e.data === FS;
		}
		function _d(e) {
			return e.data === IS || e.data === PS && e.ownerDocument.readyState !== HS;
		}
		function vd(e, t) {
			var n = e.ownerDocument;
			if (e.data === FS) e._reactRetry = t;
			else if (e.data !== PS || n.readyState !== HS) t();
			else {
				var r = function() {
					t(), n.removeEventListener("DOMContentLoaded", r);
				};
				n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
			}
		}
		function yd(e) {
			for (; e != null; e = e.nextSibling) {
				var t = e.nodeType;
				if (t === 1 || t === 3) break;
				if (t === 8) {
					if (t = e.data, t === MS || t === IS || t === PS || t === FS || t === AS || t === BS || t === VS) break;
					if (t === NS || t === jS) return null;
				}
			}
			return e;
		}
		function bd(e) {
			if (e.nodeType === 1) {
				for (var t = e.nodeName.toLowerCase(), n = {}, r = e.attributes, i = 0; i < r.length; i++) {
					var a = r[i];
					n[ku(a.name)] = a.name.toLowerCase() === "style" ? Au(e) : a.value;
				}
				return {
					type: t,
					props: n
				};
			}
			return e.nodeType === 8 ? e.data === AS ? {
				type: "Activity",
				props: {}
			} : {
				type: "Suspense",
				props: {}
			} : e.nodeValue;
		}
		function xd(e, t, n) {
			return n === null || !0 !== n[kS] ? (e.nodeValue === t ? e = null : (t = Cu(t), e = Cu(e.nodeValue) === t ? null : e.nodeValue), e) : null;
		}
		function Sd(e) {
			e = e.nextSibling;
			for (var t = 0; e;) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === NS || n === jS) {
						if (t === 0) return yd(e.nextSibling);
						t--;
					} else n !== MS && n !== IS && n !== PS && n !== FS && n !== AS || t++;
				}
				e = e.nextSibling;
			}
			return null;
		}
		function Cd(e) {
			e = e.previousSibling;
			for (var t = 0; e;) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === MS || n === IS || n === PS || n === FS || n === AS) {
						if (t === 0) return e;
						t--;
					} else n !== NS && n !== jS || t++;
				}
				e = e.previousSibling;
			}
			return null;
		}
		function wd(e) {
			Cf(e);
		}
		function Td(e) {
			Cf(e);
		}
		function Ed(e) {
			Cf(e);
		}
		function Dd(e, t, n, r, i) {
			switch (i && Yt(e, r.ancestorInfo), t = Vu(n), e) {
				case "html":
					if (e = t.documentElement, !e) throw Error("React expected an <html> element (document.documentElement) to exist in the Document but one was not found. React never removes the documentElement for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				case "head":
					if (e = t.head, !e) throw Error("React expected a <head> element (document.head) to exist in the Document but one was not found. React never removes the head for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				case "body":
					if (e = t.body, !e) throw Error("React expected a <body> element (document.body) to exist in the Document but one was not found. React never removes the body for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				default: throw Error("resolveSingletonInstance was called with an element type that is not supported. This is a bug in React.");
			}
		}
		function Od(e, t, n, r) {
			if (!n[Yp] && Qe(n)) {
				var i = n.tagName.toLowerCase();
				console.error("You are mounting a new %s component when a previous one has not first unmounted. It is an error to render more than one %s component at a time and attributes and children of these components will likely fail in unpredictable ways. Please only render a single instance of <%s> and if you need to mount a new one, ensure any previous ones have unmounted first.", i, i, i);
			}
			switch (e) {
				case "html":
				case "head":
				case "body": break;
				default: console.error("acquireSingletonInstance was called with an element type that is not supported. This is a bug in React.");
			}
			for (i = n.attributes; i.length;) n.removeAttributeNode(i[0]);
			Du(n, e, t), n[qp] = r, n[Jp] = t;
		}
		function kd(e) {
			for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
			Xe(e);
		}
		function Ad(e) {
			return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
		}
		function jd(e, t, n) {
			var r = fC;
			if (r && typeof t == "string" && t) {
				var i = gt(t);
				i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), uC.has(i) || (uC.add(i), e = {
					rel: e,
					crossOrigin: n,
					href: t
				}, r.querySelector(i) === null && (t = r.createElement("link"), Du(t, "link", e), tt(t), r.head.appendChild(t)));
			}
		}
		function Md(e, t, n, r) {
			var i = (i = np.current) ? Ad(i) : null;
			if (!i) throw Error("\"resourceRoot\" was expected to exist. This is a bug in React.");
			switch (e) {
				case "meta":
				case "title": return null;
				case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = R(n.href), t = et(i).hoistableStyles, r = t.get(n), r || (r = {
					type: "style",
					instance: null,
					count: 0,
					state: null
				}, t.set(n, r)), r) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
				case "link":
					if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
						e = R(n.href);
						var a = et(i).hoistableStyles, o = a.get(e);
						if (!o && (i = i.ownerDocument || i, o = {
							type: "stylesheet",
							instance: null,
							count: 0,
							state: {
								loading: iC,
								preload: null
							}
						}, a.set(e, o), (a = i.querySelector(Pd(e))) && !a._p && (o.instance = a, o.state.loading = aC | cC), !lC.has(e))) {
							var s = {
								rel: "preload",
								as: "style",
								href: n.href,
								crossOrigin: n.crossOrigin,
								integrity: n.integrity,
								media: n.media,
								hrefLang: n.hrefLang,
								referrerPolicy: n.referrerPolicy
							};
							lC.set(e, s), a || Id(i, e, s, o.state);
						}
						if (t && r === null) throw n = "\n\n  - " + Nd(t) + "\n  + " + Nd(n), Error("Expected <link> not to update to be updated to a stylesheet with precedence. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + n);
						return o;
					}
					if (t && r !== null) throw n = "\n\n  - " + Nd(t) + "\n  + " + Nd(n), Error("Expected stylesheet with precedence to not be updated to a different kind of <link>. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + n);
					return null;
				case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Ld(n), t = et(i).hoistableScripts, r = t.get(n), r || (r = {
					type: "script",
					instance: null,
					count: 0,
					state: null
				}, t.set(n, r)), r) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
				default: throw Error("getResource encountered a type it did not expect: \"" + e + "\". this is a bug in React.");
			}
		}
		function Nd(e) {
			var t = 0, n = "<link";
			return typeof e.rel == "string" ? (t++, n += " rel=\"" + e.rel + "\"") : vp.call(e, "rel") && (t++, n += " rel=\"" + (e.rel === null ? "null" : "invalid type " + typeof e.rel) + "\""), typeof e.href == "string" ? (t++, n += " href=\"" + e.href + "\"") : vp.call(e, "href") && (t++, n += " href=\"" + (e.href === null ? "null" : "invalid type " + typeof e.href) + "\""), typeof e.precedence == "string" ? (t++, n += " precedence=\"" + e.precedence + "\"") : vp.call(e, "precedence") && (t++, n += " precedence={" + (e.precedence === null ? "null" : "invalid type " + typeof e.precedence) + "}"), Object.getOwnPropertyNames(e).length > t && (n += " ..."), n + " />";
		}
		function R(e) {
			return "href=\"" + gt(e) + "\"";
		}
		function Pd(e) {
			return "link[rel=\"stylesheet\"][" + e + "]";
		}
		function Fd(e) {
			return z({}, e, {
				"data-precedence": e.precedence,
				precedence: null
			});
		}
		function Id(e, t, n, r) {
			e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = aC : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
				return r.loading |= aC;
			}), t.addEventListener("error", function() {
				return r.loading |= oC;
			}), Du(t, "link", n), tt(t), e.head.appendChild(t));
		}
		function Ld(e) {
			return "[src=\"" + gt(e) + "\"]";
		}
		function Rd(e) {
			return "script[async]" + e;
		}
		function zd(e, t, n) {
			if (t.count++, t.instance === null) switch (t.type) {
				case "style":
					var r = e.querySelector("style[data-href~=\"" + gt(n.href) + "\"]");
					if (r) return t.instance = r, tt(r), r;
					var i = z({}, n, {
						"data-href": n.href,
						"data-precedence": n.precedence,
						href: null,
						precedence: null
					});
					return r = (e.ownerDocument || e).createElement("style"), tt(r), Du(r, "style", i), Bd(r, n.precedence, e), t.instance = r;
				case "stylesheet":
					i = R(n.href);
					var a = e.querySelector(Pd(i));
					if (a) return t.state.loading |= cC, t.instance = a, tt(a), a;
					r = Fd(n), (i = lC.get(i)) && Vd(r, i), a = (e.ownerDocument || e).createElement("link"), tt(a);
					var o = a;
					return o._p = new Promise(function(e, t) {
						o.onload = e, o.onerror = t;
					}), Du(a, "link", r), t.state.loading |= cC, Bd(a, n.precedence, e), t.instance = a;
				case "script": return a = Ld(n.src), (i = e.querySelector(Rd(a))) ? (t.instance = i, tt(i), i) : (r = n, (i = lC.get(a)) && (r = z({}, n), Hd(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), tt(i), Du(i, "link", r), e.head.appendChild(i), t.instance = i);
				case "void": return null;
				default: throw Error("acquireResource encountered a resource type it did not expect: \"" + t.type + "\". this is a bug in React.");
			}
			else t.type === "stylesheet" && (t.state.loading & cC) === iC && (r = t.instance, t.state.loading |= cC, Bd(r, n.precedence, e));
			return t.instance;
		}
		function Bd(e, t, n) {
			for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
				var s = r[o];
				if (s.dataset.precedence === t) a = s;
				else if (a !== i) break;
			}
			a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
		}
		function Vd(e, t) {
			e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
		}
		function Hd(e, t) {
			e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
		}
		function Ud(e, t, n) {
			if (pC === null) {
				var r = /* @__PURE__ */ new Map(), i = pC = /* @__PURE__ */ new Map();
				i.set(n, r);
			} else i = pC, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
			if (r.has(e)) return r;
			for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
				var a = n[i];
				if (!(a[em] || a[qp] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== Lm) {
					var o = a.getAttribute(t) || "";
					o = e + o;
					var s = r.get(o);
					s ? s.push(a) : r.set(o, [a]);
				}
			}
			return r;
		}
		function Wd(e, t, n) {
			e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
		}
		function Gd(e, t, n) {
			var r = !n.ancestorInfo.containerTagInScope;
			if (n.context === GS || t.itemProp != null) return !r || t.itemProp == null || e !== "meta" && e !== "title" && e !== "style" && e !== "link" && e !== "script" || console.error("Cannot render a <%s> outside the main document if it has an `itemProp` prop. `itemProp` suggests the tag belongs to an `itemScope` which can appear anywhere in the DOM. If you were intending for React to hoist this <%s> remove the `itemProp` prop. Otherwise, try moving this tag into the <head> or <body> of the Document.", e, e), !1;
			switch (e) {
				case "meta":
				case "title": return !0;
				case "style":
					if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") {
						r && console.error("Cannot render a <style> outside the main document without knowing its precedence and a unique href key. React can hoist and deduplicate <style> tags if you provide a `precedence` prop along with an `href` prop that does not conflict with the `href` values used in any other hoisted <style> or <link rel=\"stylesheet\" ...> tags.  Note that hoisting <style> tags is considered an advanced feature that most will not use directly. Consider moving the <style> tag to the <head> or consider adding a `precedence=\"default\"` and `href=\"some unique resource identifier\"`.");
						break;
					}
					return !0;
				case "link":
					if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) {
						if (t.rel === "stylesheet" && typeof t.precedence == "string") {
							e = t.href;
							var i = t.onError, a = t.disabled;
							n = [], t.onLoad && n.push("`onLoad`"), i && n.push("`onError`"), a != null && n.push("`disabled`"), i = Ru(n, "and"), i += n.length === 1 ? " prop" : " props", a = n.length === 1 ? "an " + i : "the " + i, n.length && console.error("React encountered a <link rel=\"stylesheet\" href=\"%s\" ... /> with a `precedence` prop that also included %s. The presence of loading and error handlers indicates an intent to manage the stylesheet loading state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.", e, a, i);
						}
						r && (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" ? console.error("Cannot render a <link> outside the main document without a `rel` and `href` prop. Try adding a `rel` and/or `href` prop to this <link> or moving the link into the <head> tag") : (t.onError || t.onLoad) && console.error("Cannot render a <link> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."));
						break;
					}
					switch (t.rel) {
						case "stylesheet": return e = t.precedence, t = t.disabled, typeof e != "string" && r && console.error("Cannot render a <link rel=\"stylesheet\" /> outside the main document without knowing its precedence. Consider adding precedence=\"default\" or moving it into the root <head> tag."), typeof e == "string" && t == null;
						default: return !0;
					}
				case "script":
					if (e = t.async && typeof t.async != "function" && typeof t.async != "symbol", !e || t.onLoad || t.onError || !t.src || typeof t.src != "string") {
						r && (e ? t.onLoad || t.onError ? console.error("Cannot render a <script> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>.") : console.error("Cannot render a <script> outside the main document without `async={true}` and a non-empty `src` prop. Ensure there is a valid `src` and either make the script async or move it into the root <head> tag or somewhere in the <body>.") : console.error("Cannot render a sync or defer <script> outside the main document without knowing its order. Try adding async=\"\" or moving it into the root <head> tag."));
						break;
					}
					return !0;
				case "noscript":
				case "template": r && console.error("Cannot render <%s> outside the main document. Try moving it into the root <head> tag.", e);
			}
			return !1;
		}
		function Kd(e) {
			return e.type !== "stylesheet" || (e.state.loading & sC) !== iC;
		}
		function qd(e, t, n, r) {
			if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && (n.state.loading & cC) === iC) {
				if (n.instance === null) {
					var i = R(r.href), a = t.querySelector(Pd(i));
					if (a) {
						t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Yd.bind(e), t.then(e, e)), n.state.loading |= cC, n.instance = a, tt(a);
						return;
					}
					a = t.ownerDocument || t, r = Fd(r), (i = lC.get(i)) && Vd(r, i), a = a.createElement("link"), tt(a);
					var o = a;
					o._p = new Promise(function(e, t) {
						o.onload = e, o.onerror = t;
					}), Du(a, "link", r), n.instance = a;
				}
				e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & sC) === iC && (e.count++, n = Yd.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
			}
		}
		function Jd(e, t) {
			return e.stylesheets && e.count === 0 && Xd(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
				var r = setTimeout(function() {
					if (e.stylesheets && Xd(e, e.stylesheets), e.unsuspend) {
						var t = e.unsuspend;
						e.unsuspend = null, t();
					}
				}, mC + t);
				0 < e.imgBytes && _C === 0 && (_C = 125 * Bu() * gC);
				var i = setTimeout(function() {
					if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xd(e, e.stylesheets), e.unsuspend)) {
						var t = e.unsuspend;
						e.unsuspend = null, t();
					}
				}, (e.imgBytes > _C ? 50 : hC) + t);
				return e.unsuspend = n, function() {
					e.unsuspend = null, clearTimeout(r), clearTimeout(i);
				};
			} : null;
		}
		function Yd() {
			if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
				if (this.stylesheets) Xd(this, this.stylesheets);
				else if (this.unsuspend) {
					var e = this.unsuspend;
					this.unsuspend = null, e();
				}
			}
		}
		function Xd(e, t) {
			e.stylesheets = null, e.unsuspend !== null && (e.count++, yC = /* @__PURE__ */ new Map(), t.forEach(Zd, e), yC = null, Yd.call(e));
		}
		function Zd(e, t) {
			if (!(t.state.loading & cC)) {
				var n = yC.get(e);
				if (n) var r = n.get(vC);
				else {
					n = /* @__PURE__ */ new Map(), yC.set(e, n);
					for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
						var o = i[a];
						(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
					}
					r && n.set(vC, r);
				}
				i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(vC, i), n.set(o, i), this.count++, r = Yd.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= cC;
			}
		}
		function Qd(e, t, n, r, i, a, o, s, c) {
			for (this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = eC, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Re(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Re(0), this.hiddenUpdates = Re(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map(), this.passiveEffectDuration = this.effectDuration = -0, this.memoizedUpdaters = /* @__PURE__ */ new Set(), e = this.pendingUpdatersLaneMap = [], t = 0; 31 > t; t++) e.push(/* @__PURE__ */ new Set());
			this._debugRootType = n ? "hydrateRoot()" : "createRoot()";
		}
		function $d(e, t, n, r, i, a, o, s, c, l, u, d) {
			return e = new Qd(e, t, n, o, c, l, u, d, s), t = Rg, !0 === a && (t |= zg | Bg), t |= W, a = g(3, null, null, t), e.current = a, a.stateNode = e, t = li(), ui(t), e.pooledCache = t, ui(t), a.memoizedState = {
				element: r,
				isDehydrated: n,
				cache: t
			}, ta(a), e;
		}
		function ef(e) {
			return e ? (e = Fg, e) : Fg;
		}
		function tf(e, t, n, r, i, a) {
			if (Np && typeof Np.onScheduleFiberRoot == "function") try {
				Np.onScheduleFiberRoot(Mp, r, n);
			} catch (e) {
				Pp || (Pp = !0, console.error("React instrumentation encountered an error: %o", e));
			}
			i = ef(i), r.context === null ? r.context = i : r.pendingContext = i, _p && gp !== null && !DC && (DC = !0, console.error("Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.\n\nCheck the render method of %s.", C(gp) || "Unknown")), r = ra(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (typeof a != "function" && console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", a), r.callback = a), n = ia(e, r, t), n !== null && (fi(t, "root.render()", null), ol(n, e, t), aa(n, e, t));
		}
		function nf(e, t) {
			if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
				var n = e.retryLane;
				e.retryLane = n !== 0 && n < t ? n : t;
			}
		}
		function rf(e, t) {
			nf(e, t), (e = e.alternate) && nf(e, t);
		}
		function af(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = hr(e, 67108864);
				t !== null && ol(t, e, 67108864), rf(e, 67108864);
			}
		}
		function of(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = il(e);
				t = We(t);
				var n = hr(e, t);
				n !== null && ol(n, e, t), rf(e, t);
			}
		}
		function sf() {
			return gp;
		}
		function cf(e, t, n, r) {
			var i = B.T;
			B.T = null;
			var a = Yf.p;
			try {
				Yf.p = Hp, uf(e, t, n, r);
			} finally {
				Yf.p = a, B.T = i;
			}
		}
		function lf(e, t, n, r) {
			var i = B.T;
			B.T = null;
			var a = Yf.p;
			try {
				Yf.p = Up, uf(e, t, n, r);
			} finally {
				Yf.p = a, B.T = i;
			}
		}
		function uf(e, t, n, r) {
			if (RC) {
				var i = df(r);
				if (i === null) pu(e, t, r, zC, n), mf(e, r);
				else if (gf(i, e, t, n, r)) r.stopPropagation();
				else if (mf(e, r), t & 4 && -1 < qC.indexOf(e)) {
					for (; i !== null;) {
						var a = Qe(i);
						if (a !== null) switch (a.tag) {
							case 3:
								if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
									var o = Ne(a.pendingLanes);
									if (o !== 0) {
										var s = a;
										for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
											var c = 1 << 31 - Ip(o);
											s.entanglements[1] |= c, o &= ~c;
										}
										P(a), (Wb & (Fb | Ib)) === Pb && (bx = Cp() + xx, F(0, !1));
									}
								}
								break;
							case 31:
							case 13: s = hr(a, 2), s !== null && ol(s, a, 2), dl(), rf(a, 2);
						}
						if (a = df(r), a === null && pu(e, t, r, zC, n), a === i) break;
						i = a;
					}
					i !== null && r.stopPropagation();
				} else pu(e, t, r, null, n);
			}
		}
		function df(e) {
			return e = un(e), ff(e);
		}
		function ff(e) {
			if (zC = null, e = Ze(e), e !== null) {
				var t = x(e);
				if (t === null) e = null;
				else {
					var n = t.tag;
					if (n === 13) {
						if (e = ee(t), e !== null) return e;
						e = null;
					} else if (n === 31) {
						if (e = te(t), e !== null) return e;
						e = null;
					} else if (n === 3) {
						if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
						e = null;
					} else t !== e && (e = null);
				}
			}
			return zC = e, null;
		}
		function pf(e) {
			switch (e) {
				case "beforetoggle":
				case "cancel":
				case "click":
				case "close":
				case "contextmenu":
				case "copy":
				case "cut":
				case "auxclick":
				case "dblclick":
				case "dragend":
				case "dragstart":
				case "drop":
				case "focusin":
				case "focusout":
				case "input":
				case "invalid":
				case "keydown":
				case "keypress":
				case "keyup":
				case "mousedown":
				case "mouseup":
				case "paste":
				case "pause":
				case "play":
				case "pointercancel":
				case "pointerdown":
				case "pointerup":
				case "ratechange":
				case "reset":
				case "resize":
				case "seeked":
				case "submit":
				case "toggle":
				case "touchcancel":
				case "touchend":
				case "touchstart":
				case "volumechange":
				case "change":
				case "selectionchange":
				case "textInput":
				case "compositionstart":
				case "compositionend":
				case "compositionupdate":
				case "beforeblur":
				case "afterblur":
				case "beforeinput":
				case "blur":
				case "fullscreenchange":
				case "focus":
				case "hashchange":
				case "popstate":
				case "select":
				case "selectstart": return Hp;
				case "drag":
				case "dragenter":
				case "dragexit":
				case "dragleave":
				case "dragover":
				case "mousemove":
				case "mouseout":
				case "mouseover":
				case "pointermove":
				case "pointerout":
				case "pointerover":
				case "scroll":
				case "touchmove":
				case "wheel":
				case "mouseenter":
				case "mouseleave":
				case "pointerenter":
				case "pointerleave": return Up;
				case "message": switch (wp()) {
					case Tp: return Hp;
					case Ep: return Up;
					case Dp:
					case Op: return Wp;
					case kp: return Gp;
					default: return Wp;
				}
				default: return Wp;
			}
		}
		function mf(e, t) {
			switch (e) {
				case "focusin":
				case "focusout":
					VC = null;
					break;
				case "dragenter":
				case "dragleave":
					HC = null;
					break;
				case "mouseover":
				case "mouseout":
					UC = null;
					break;
				case "pointerover":
				case "pointerout":
					WC.delete(t.pointerId);
					break;
				case "gotpointercapture":
				case "lostpointercapture": GC.delete(t.pointerId);
			}
		}
		function hf(e, t, n, r, i, a) {
			return e === null || e.nativeEvent !== a ? (e = {
				blockedOn: t,
				domEventName: n,
				eventSystemFlags: r,
				nativeEvent: a,
				targetContainers: [i]
			}, t !== null && (t = Qe(t), t !== null && af(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
		}
		function gf(e, t, n, r, i) {
			switch (t) {
				case "focusin": return VC = hf(VC, e, t, n, r, i), !0;
				case "dragenter": return HC = hf(HC, e, t, n, r, i), !0;
				case "mouseover": return UC = hf(UC, e, t, n, r, i), !0;
				case "pointerover":
					var a = i.pointerId;
					return WC.set(a, hf(WC.get(a) || null, e, t, n, r, i)), !0;
				case "gotpointercapture": return a = i.pointerId, GC.set(a, hf(GC.get(a) || null, e, t, n, r, i)), !0;
			}
			return !1;
		}
		function _f(e) {
			var t = Ze(e.target);
			if (t !== null) {
				var n = x(t);
				if (n !== null) {
					if (t = n.tag, t === 13) {
						if (t = ee(n), t !== null) {
							e.blockedOn = t, Ye(e.priority, function() {
								of(n);
							});
							return;
						}
					} else if (t === 31) {
						if (t = te(n), t !== null) {
							e.blockedOn = t, Ye(e.priority, function() {
								of(n);
							});
							return;
						}
					} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
						e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
						return;
					}
				}
			}
			e.blockedOn = null;
		}
		function vf(e) {
			if (e.blockedOn !== null) return !1;
			for (var t = e.targetContainers; 0 < t.length;) {
				var n = df(e.nativeEvent);
				if (n === null) {
					n = e.nativeEvent;
					var r = new n.constructor(n.type, n), i = r;
					Zm !== null && console.error("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Zm = i, n.target.dispatchEvent(r), Zm === null && console.error("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Zm = null;
				} else return t = Qe(n), t !== null && af(t), e.blockedOn = n, !1;
				t.shift();
			}
			return !0;
		}
		function yf(e, t, n) {
			vf(e) && n.delete(t);
		}
		function bf() {
			BC = !1, VC !== null && vf(VC) && (VC = null), HC !== null && vf(HC) && (HC = null), UC !== null && vf(UC) && (UC = null), WC.forEach(yf), GC.forEach(yf);
		}
		function xf(e, t) {
			e.blockedOn === t && (e.blockedOn = null, BC || (BC = !0, Of.unstable_scheduleCallback(Of.unstable_NormalPriority, bf)));
		}
		function Sf(e) {
			JC !== e && (JC = e, Of.unstable_scheduleCallback(Of.unstable_NormalPriority, function() {
				JC === e && (JC = null);
				for (var t = 0; t < e.length; t += 3) {
					var n = e[t], r = e[t + 1], i = e[t + 2];
					if (typeof r != "function") {
						if (ff(r || n) === null) continue;
						break;
					}
					var a = Qe(n);
					a !== null && (e.splice(t, 3), t -= 3, n = {
						pending: !0,
						data: i,
						method: n.method,
						action: r
					}, Object.freeze(n), Lo(a, n, r, i));
				}
			}));
		}
		function Cf(e) {
			function t(t) {
				return xf(t, e);
			}
			VC !== null && xf(VC, e), HC !== null && xf(HC, e), UC !== null && xf(UC, e), WC.forEach(t), GC.forEach(t);
			for (var n = 0; n < KC.length; n++) {
				var r = KC[n];
				r.blockedOn === e && (r.blockedOn = null);
			}
			for (; 0 < KC.length && (n = KC[0], n.blockedOn === null);) _f(n), n.blockedOn === null && KC.shift();
			if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
				var i = n[r], a = n[r + 1], o = i[Jp] || null;
				if (typeof a == "function") o || Sf(n);
				else if (o) {
					var s = null;
					if (a && a.hasAttribute("formAction")) {
						if (i = a, o = a[Jp] || null) s = o.formAction;
						else if (ff(i) !== null) continue;
					} else s = o.action;
					typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Sf(n);
				}
			}
		}
		function wf() {
			function e(e) {
				e.canIntercept && e.info === "react-transition" && e.intercept({
					handler: function() {
						return new Promise(function(e) {
							return i = e;
						});
					},
					focusReset: "manual",
					scroll: "manual"
				});
			}
			function t() {
				i !== null && (i(), i = null), r || setTimeout(n, 20);
			}
			function n() {
				if (!r && !navigation.transition) {
					var e = navigation.currentEntry;
					e && e.url != null && navigation.navigate(e.url, {
						state: e.getState(),
						info: "react-transition",
						history: "replace"
					});
				}
			}
			if (typeof navigation == "object") {
				var r = !1, i = null;
				return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
					r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
				};
			}
		}
		function Tf(e) {
			this._internalRoot = e;
		}
		function Ef(e) {
			this._internalRoot = e;
		}
		function Df(e) {
			e[Yp] && (e._reactRootContainer ? console.error("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : console.error("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var Of = r(), kf = o(), Af = l(), z = Object.assign, jf = Symbol.for("react.element"), Mf = Symbol.for("react.transitional.element"), Nf = Symbol.for("react.portal"), Pf = Symbol.for("react.fragment"), Ff = Symbol.for("react.strict_mode"), If = Symbol.for("react.profiler"), Lf = Symbol.for("react.consumer"), Rf = Symbol.for("react.context"), zf = Symbol.for("react.forward_ref"), Bf = Symbol.for("react.suspense"), Vf = Symbol.for("react.suspense_list"), Hf = Symbol.for("react.memo"), Uf = Symbol.for("react.lazy"), Wf = Symbol.for("react.activity"), Gf = Symbol.for("react.memo_cache_sentinel"), Kf = Symbol.iterator, qf = Symbol.for("react.client.reference"), Jf = Array.isArray, B = kf.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Yf = Af.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Xf = Object.freeze({
			pending: !1,
			data: null,
			method: null,
			action: null
		}), Zf = [], Qf = [], $f = -1, ep = se(null), tp = se(null), np = se(null), rp = se(null), ip = 0, ap, op, sp, cp, lp, up, dp;
		pe.__reactDisabledLog = !0;
		var fp, pp, mp = !1, hp = new (typeof WeakMap == "function" ? WeakMap : Map)(), gp = null, _p = !1, vp = Object.prototype.hasOwnProperty, yp = Of.unstable_scheduleCallback, bp = Of.unstable_cancelCallback, xp = Of.unstable_shouldYield, Sp = Of.unstable_requestPaint, Cp = Of.unstable_now, wp = Of.unstable_getCurrentPriorityLevel, Tp = Of.unstable_ImmediatePriority, Ep = Of.unstable_UserBlockingPriority, Dp = Of.unstable_NormalPriority, Op = Of.unstable_LowPriority, kp = Of.unstable_IdlePriority, Ap = Of.log, jp = Of.unstable_setDisableYieldValue, Mp = null, Np = null, Pp = !1, Fp = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u", Ip = Math.clz32 ? Math.clz32 : Me, Lp = Math.log, Rp = Math.LN2, zp = 256, Bp = 262144, Vp = 4194304, Hp = 2, Up = 8, Wp = 32, Gp = 268435456, Kp = Math.random().toString(36).slice(2), qp = "__reactFiber$" + Kp, Jp = "__reactProps$" + Kp, Yp = "__reactContainer$" + Kp, Xp = "__reactEvents$" + Kp, Zp = "__reactListeners$" + Kp, Qp = "__reactHandles$" + Kp, $p = "__reactResources$" + Kp, em = "__reactMarker$" + Kp, tm = /* @__PURE__ */ new Set(), nm = {}, rm = {}, im = {
			button: !0,
			checkbox: !0,
			image: !0,
			hidden: !0,
			radio: !0,
			reset: !0,
			submit: !0
		}, am = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), om = {}, sm = {}, cm = /[\n"\\]/g, lm = !1, um = !1, dm = !1, fm = !1, pm = !1, mm = !1, hm = ["value", "defaultValue"], gm = !1, _m = /["'&<>\n\t]|^\s|\s$/, vm = "address applet area article aside base basefont bgsound blockquote body br button caption center col colgroup dd details dir div dl dt embed fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html iframe img input isindex li link listing main marquee menu menuitem meta nav noembed noframes noscript object ol p param plaintext pre script section select source style summary table tbody td template textarea tfoot th thead title tr track ul wbr xmp".split(" "), ym = "applet caption html table td th marquee object template foreignObject desc title".split(" "), bm = ym.concat(["button"]), xm = "dd dt li option optgroup p rp rt".split(" "), Sm = {
			current: null,
			formTag: null,
			aTagInScope: null,
			buttonTagInScope: null,
			nobrTagInScope: null,
			pTagInButtonScope: null,
			listItemTagAutoclosing: null,
			dlItemTagAutoclosing: null,
			containerTagInScope: null,
			implicitRootScope: !1
		}, Cm = {}, wm = {
			animation: "animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction".split(" "),
			background: "backgroundAttachment backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPositionX backgroundPositionY backgroundRepeat backgroundSize".split(" "),
			backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
			border: "borderBottomColor borderBottomStyle borderBottomWidth borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderTopColor borderTopStyle borderTopWidth".split(" "),
			borderBlockEnd: [
				"borderBlockEndColor",
				"borderBlockEndStyle",
				"borderBlockEndWidth"
			],
			borderBlockStart: [
				"borderBlockStartColor",
				"borderBlockStartStyle",
				"borderBlockStartWidth"
			],
			borderBottom: [
				"borderBottomColor",
				"borderBottomStyle",
				"borderBottomWidth"
			],
			borderColor: [
				"borderBottomColor",
				"borderLeftColor",
				"borderRightColor",
				"borderTopColor"
			],
			borderImage: [
				"borderImageOutset",
				"borderImageRepeat",
				"borderImageSlice",
				"borderImageSource",
				"borderImageWidth"
			],
			borderInlineEnd: [
				"borderInlineEndColor",
				"borderInlineEndStyle",
				"borderInlineEndWidth"
			],
			borderInlineStart: [
				"borderInlineStartColor",
				"borderInlineStartStyle",
				"borderInlineStartWidth"
			],
			borderLeft: [
				"borderLeftColor",
				"borderLeftStyle",
				"borderLeftWidth"
			],
			borderRadius: [
				"borderBottomLeftRadius",
				"borderBottomRightRadius",
				"borderTopLeftRadius",
				"borderTopRightRadius"
			],
			borderRight: [
				"borderRightColor",
				"borderRightStyle",
				"borderRightWidth"
			],
			borderStyle: [
				"borderBottomStyle",
				"borderLeftStyle",
				"borderRightStyle",
				"borderTopStyle"
			],
			borderTop: [
				"borderTopColor",
				"borderTopStyle",
				"borderTopWidth"
			],
			borderWidth: [
				"borderBottomWidth",
				"borderLeftWidth",
				"borderRightWidth",
				"borderTopWidth"
			],
			columnRule: [
				"columnRuleColor",
				"columnRuleStyle",
				"columnRuleWidth"
			],
			columns: ["columnCount", "columnWidth"],
			flex: [
				"flexBasis",
				"flexGrow",
				"flexShrink"
			],
			flexFlow: ["flexDirection", "flexWrap"],
			font: "fontFamily fontFeatureSettings fontKerning fontLanguageOverride fontSize fontSizeAdjust fontStretch fontStyle fontVariant fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition fontWeight lineHeight".split(" "),
			fontVariant: "fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition".split(" "),
			gap: ["columnGap", "rowGap"],
			grid: "gridAutoColumns gridAutoFlow gridAutoRows gridTemplateAreas gridTemplateColumns gridTemplateRows".split(" "),
			gridArea: [
				"gridColumnEnd",
				"gridColumnStart",
				"gridRowEnd",
				"gridRowStart"
			],
			gridColumn: ["gridColumnEnd", "gridColumnStart"],
			gridColumnGap: ["columnGap"],
			gridGap: ["columnGap", "rowGap"],
			gridRow: ["gridRowEnd", "gridRowStart"],
			gridRowGap: ["rowGap"],
			gridTemplate: [
				"gridTemplateAreas",
				"gridTemplateColumns",
				"gridTemplateRows"
			],
			listStyle: [
				"listStyleImage",
				"listStylePosition",
				"listStyleType"
			],
			margin: [
				"marginBottom",
				"marginLeft",
				"marginRight",
				"marginTop"
			],
			marker: [
				"markerEnd",
				"markerMid",
				"markerStart"
			],
			mask: "maskClip maskComposite maskImage maskMode maskOrigin maskPositionX maskPositionY maskRepeat maskSize".split(" "),
			maskPosition: ["maskPositionX", "maskPositionY"],
			outline: [
				"outlineColor",
				"outlineStyle",
				"outlineWidth"
			],
			overflow: ["overflowX", "overflowY"],
			padding: [
				"paddingBottom",
				"paddingLeft",
				"paddingRight",
				"paddingTop"
			],
			placeContent: ["alignContent", "justifyContent"],
			placeItems: ["alignItems", "justifyItems"],
			placeSelf: ["alignSelf", "justifySelf"],
			textDecoration: [
				"textDecorationColor",
				"textDecorationLine",
				"textDecorationStyle"
			],
			textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
			transition: [
				"transitionDelay",
				"transitionDuration",
				"transitionProperty",
				"transitionTimingFunction"
			],
			wordWrap: ["overflowWrap"]
		}, Tm = /([A-Z])/g, Em = /^ms-/, Dm = /^(?:webkit|moz|o)[A-Z]/, Om = /^-ms-/, km = /-(.)/g, Am = /;\s*$/, jm = {}, Mm = {}, Nm = !1, Pm = !1, Fm = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" ")), Im = "http://www.w3.org/1998/Math/MathML", Lm = "http://www.w3.org/2000/svg", Rm = /* @__PURE__ */ new Map([
			["acceptCharset", "accept-charset"],
			["htmlFor", "for"],
			["httpEquiv", "http-equiv"],
			["crossOrigin", "crossorigin"],
			["accentHeight", "accent-height"],
			["alignmentBaseline", "alignment-baseline"],
			["arabicForm", "arabic-form"],
			["baselineShift", "baseline-shift"],
			["capHeight", "cap-height"],
			["clipPath", "clip-path"],
			["clipRule", "clip-rule"],
			["colorInterpolation", "color-interpolation"],
			["colorInterpolationFilters", "color-interpolation-filters"],
			["colorProfile", "color-profile"],
			["colorRendering", "color-rendering"],
			["dominantBaseline", "dominant-baseline"],
			["enableBackground", "enable-background"],
			["fillOpacity", "fill-opacity"],
			["fillRule", "fill-rule"],
			["floodColor", "flood-color"],
			["floodOpacity", "flood-opacity"],
			["fontFamily", "font-family"],
			["fontSize", "font-size"],
			["fontSizeAdjust", "font-size-adjust"],
			["fontStretch", "font-stretch"],
			["fontStyle", "font-style"],
			["fontVariant", "font-variant"],
			["fontWeight", "font-weight"],
			["glyphName", "glyph-name"],
			["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
			["glyphOrientationVertical", "glyph-orientation-vertical"],
			["horizAdvX", "horiz-adv-x"],
			["horizOriginX", "horiz-origin-x"],
			["imageRendering", "image-rendering"],
			["letterSpacing", "letter-spacing"],
			["lightingColor", "lighting-color"],
			["markerEnd", "marker-end"],
			["markerMid", "marker-mid"],
			["markerStart", "marker-start"],
			["overlinePosition", "overline-position"],
			["overlineThickness", "overline-thickness"],
			["paintOrder", "paint-order"],
			["panose-1", "panose-1"],
			["pointerEvents", "pointer-events"],
			["renderingIntent", "rendering-intent"],
			["shapeRendering", "shape-rendering"],
			["stopColor", "stop-color"],
			["stopOpacity", "stop-opacity"],
			["strikethroughPosition", "strikethrough-position"],
			["strikethroughThickness", "strikethrough-thickness"],
			["strokeDasharray", "stroke-dasharray"],
			["strokeDashoffset", "stroke-dashoffset"],
			["strokeLinecap", "stroke-linecap"],
			["strokeLinejoin", "stroke-linejoin"],
			["strokeMiterlimit", "stroke-miterlimit"],
			["strokeOpacity", "stroke-opacity"],
			["strokeWidth", "stroke-width"],
			["textAnchor", "text-anchor"],
			["textDecoration", "text-decoration"],
			["textRendering", "text-rendering"],
			["transformOrigin", "transform-origin"],
			["underlinePosition", "underline-position"],
			["underlineThickness", "underline-thickness"],
			["unicodeBidi", "unicode-bidi"],
			["unicodeRange", "unicode-range"],
			["unitsPerEm", "units-per-em"],
			["vAlphabetic", "v-alphabetic"],
			["vHanging", "v-hanging"],
			["vIdeographic", "v-ideographic"],
			["vMathematical", "v-mathematical"],
			["vectorEffect", "vector-effect"],
			["vertAdvY", "vert-adv-y"],
			["vertOriginX", "vert-origin-x"],
			["vertOriginY", "vert-origin-y"],
			["wordSpacing", "word-spacing"],
			["writingMode", "writing-mode"],
			["xmlnsXlink", "xmlns:xlink"],
			["xHeight", "x-height"]
		]), zm = {
			accept: "accept",
			acceptcharset: "acceptCharset",
			"accept-charset": "acceptCharset",
			accesskey: "accessKey",
			action: "action",
			allowfullscreen: "allowFullScreen",
			alt: "alt",
			as: "as",
			async: "async",
			autocapitalize: "autoCapitalize",
			autocomplete: "autoComplete",
			autocorrect: "autoCorrect",
			autofocus: "autoFocus",
			autoplay: "autoPlay",
			autosave: "autoSave",
			capture: "capture",
			cellpadding: "cellPadding",
			cellspacing: "cellSpacing",
			challenge: "challenge",
			charset: "charSet",
			checked: "checked",
			children: "children",
			cite: "cite",
			class: "className",
			classid: "classID",
			classname: "className",
			cols: "cols",
			colspan: "colSpan",
			content: "content",
			contenteditable: "contentEditable",
			contextmenu: "contextMenu",
			controls: "controls",
			controlslist: "controlsList",
			coords: "coords",
			crossorigin: "crossOrigin",
			dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
			data: "data",
			datetime: "dateTime",
			default: "default",
			defaultchecked: "defaultChecked",
			defaultvalue: "defaultValue",
			defer: "defer",
			dir: "dir",
			disabled: "disabled",
			disablepictureinpicture: "disablePictureInPicture",
			disableremoteplayback: "disableRemotePlayback",
			download: "download",
			draggable: "draggable",
			enctype: "encType",
			enterkeyhint: "enterKeyHint",
			fetchpriority: "fetchPriority",
			for: "htmlFor",
			form: "form",
			formmethod: "formMethod",
			formaction: "formAction",
			formenctype: "formEncType",
			formnovalidate: "formNoValidate",
			formtarget: "formTarget",
			frameborder: "frameBorder",
			headers: "headers",
			height: "height",
			hidden: "hidden",
			high: "high",
			href: "href",
			hreflang: "hrefLang",
			htmlfor: "htmlFor",
			httpequiv: "httpEquiv",
			"http-equiv": "httpEquiv",
			icon: "icon",
			id: "id",
			imagesizes: "imageSizes",
			imagesrcset: "imageSrcSet",
			inert: "inert",
			innerhtml: "innerHTML",
			inputmode: "inputMode",
			integrity: "integrity",
			is: "is",
			itemid: "itemID",
			itemprop: "itemProp",
			itemref: "itemRef",
			itemscope: "itemScope",
			itemtype: "itemType",
			keyparams: "keyParams",
			keytype: "keyType",
			kind: "kind",
			label: "label",
			lang: "lang",
			list: "list",
			loop: "loop",
			low: "low",
			manifest: "manifest",
			marginwidth: "marginWidth",
			marginheight: "marginHeight",
			max: "max",
			maxlength: "maxLength",
			media: "media",
			mediagroup: "mediaGroup",
			method: "method",
			min: "min",
			minlength: "minLength",
			multiple: "multiple",
			muted: "muted",
			name: "name",
			nomodule: "noModule",
			nonce: "nonce",
			novalidate: "noValidate",
			open: "open",
			optimum: "optimum",
			pattern: "pattern",
			placeholder: "placeholder",
			playsinline: "playsInline",
			poster: "poster",
			preload: "preload",
			profile: "profile",
			radiogroup: "radioGroup",
			readonly: "readOnly",
			referrerpolicy: "referrerPolicy",
			rel: "rel",
			required: "required",
			reversed: "reversed",
			role: "role",
			rows: "rows",
			rowspan: "rowSpan",
			sandbox: "sandbox",
			scope: "scope",
			scoped: "scoped",
			scrolling: "scrolling",
			seamless: "seamless",
			selected: "selected",
			shape: "shape",
			size: "size",
			sizes: "sizes",
			span: "span",
			spellcheck: "spellCheck",
			src: "src",
			srcdoc: "srcDoc",
			srclang: "srcLang",
			srcset: "srcSet",
			start: "start",
			step: "step",
			style: "style",
			summary: "summary",
			tabindex: "tabIndex",
			target: "target",
			title: "title",
			type: "type",
			usemap: "useMap",
			value: "value",
			width: "width",
			wmode: "wmode",
			wrap: "wrap",
			about: "about",
			accentheight: "accentHeight",
			"accent-height": "accentHeight",
			accumulate: "accumulate",
			additive: "additive",
			alignmentbaseline: "alignmentBaseline",
			"alignment-baseline": "alignmentBaseline",
			allowreorder: "allowReorder",
			alphabetic: "alphabetic",
			amplitude: "amplitude",
			arabicform: "arabicForm",
			"arabic-form": "arabicForm",
			ascent: "ascent",
			attributename: "attributeName",
			attributetype: "attributeType",
			autoreverse: "autoReverse",
			azimuth: "azimuth",
			basefrequency: "baseFrequency",
			baselineshift: "baselineShift",
			"baseline-shift": "baselineShift",
			baseprofile: "baseProfile",
			bbox: "bbox",
			begin: "begin",
			bias: "bias",
			by: "by",
			calcmode: "calcMode",
			capheight: "capHeight",
			"cap-height": "capHeight",
			clip: "clip",
			clippath: "clipPath",
			"clip-path": "clipPath",
			clippathunits: "clipPathUnits",
			cliprule: "clipRule",
			"clip-rule": "clipRule",
			color: "color",
			colorinterpolation: "colorInterpolation",
			"color-interpolation": "colorInterpolation",
			colorinterpolationfilters: "colorInterpolationFilters",
			"color-interpolation-filters": "colorInterpolationFilters",
			colorprofile: "colorProfile",
			"color-profile": "colorProfile",
			colorrendering: "colorRendering",
			"color-rendering": "colorRendering",
			contentscripttype: "contentScriptType",
			contentstyletype: "contentStyleType",
			cursor: "cursor",
			cx: "cx",
			cy: "cy",
			d: "d",
			datatype: "datatype",
			decelerate: "decelerate",
			descent: "descent",
			diffuseconstant: "diffuseConstant",
			direction: "direction",
			display: "display",
			divisor: "divisor",
			dominantbaseline: "dominantBaseline",
			"dominant-baseline": "dominantBaseline",
			dur: "dur",
			dx: "dx",
			dy: "dy",
			edgemode: "edgeMode",
			elevation: "elevation",
			enablebackground: "enableBackground",
			"enable-background": "enableBackground",
			end: "end",
			exponent: "exponent",
			externalresourcesrequired: "externalResourcesRequired",
			fill: "fill",
			fillopacity: "fillOpacity",
			"fill-opacity": "fillOpacity",
			fillrule: "fillRule",
			"fill-rule": "fillRule",
			filter: "filter",
			filterres: "filterRes",
			filterunits: "filterUnits",
			floodopacity: "floodOpacity",
			"flood-opacity": "floodOpacity",
			floodcolor: "floodColor",
			"flood-color": "floodColor",
			focusable: "focusable",
			fontfamily: "fontFamily",
			"font-family": "fontFamily",
			fontsize: "fontSize",
			"font-size": "fontSize",
			fontsizeadjust: "fontSizeAdjust",
			"font-size-adjust": "fontSizeAdjust",
			fontstretch: "fontStretch",
			"font-stretch": "fontStretch",
			fontstyle: "fontStyle",
			"font-style": "fontStyle",
			fontvariant: "fontVariant",
			"font-variant": "fontVariant",
			fontweight: "fontWeight",
			"font-weight": "fontWeight",
			format: "format",
			from: "from",
			fx: "fx",
			fy: "fy",
			g1: "g1",
			g2: "g2",
			glyphname: "glyphName",
			"glyph-name": "glyphName",
			glyphorientationhorizontal: "glyphOrientationHorizontal",
			"glyph-orientation-horizontal": "glyphOrientationHorizontal",
			glyphorientationvertical: "glyphOrientationVertical",
			"glyph-orientation-vertical": "glyphOrientationVertical",
			glyphref: "glyphRef",
			gradienttransform: "gradientTransform",
			gradientunits: "gradientUnits",
			hanging: "hanging",
			horizadvx: "horizAdvX",
			"horiz-adv-x": "horizAdvX",
			horizoriginx: "horizOriginX",
			"horiz-origin-x": "horizOriginX",
			ideographic: "ideographic",
			imagerendering: "imageRendering",
			"image-rendering": "imageRendering",
			in2: "in2",
			in: "in",
			inlist: "inlist",
			intercept: "intercept",
			k1: "k1",
			k2: "k2",
			k3: "k3",
			k4: "k4",
			k: "k",
			kernelmatrix: "kernelMatrix",
			kernelunitlength: "kernelUnitLength",
			kerning: "kerning",
			keypoints: "keyPoints",
			keysplines: "keySplines",
			keytimes: "keyTimes",
			lengthadjust: "lengthAdjust",
			letterspacing: "letterSpacing",
			"letter-spacing": "letterSpacing",
			lightingcolor: "lightingColor",
			"lighting-color": "lightingColor",
			limitingconeangle: "limitingConeAngle",
			local: "local",
			markerend: "markerEnd",
			"marker-end": "markerEnd",
			markerheight: "markerHeight",
			markermid: "markerMid",
			"marker-mid": "markerMid",
			markerstart: "markerStart",
			"marker-start": "markerStart",
			markerunits: "markerUnits",
			markerwidth: "markerWidth",
			mask: "mask",
			maskcontentunits: "maskContentUnits",
			maskunits: "maskUnits",
			mathematical: "mathematical",
			mode: "mode",
			numoctaves: "numOctaves",
			offset: "offset",
			opacity: "opacity",
			operator: "operator",
			order: "order",
			orient: "orient",
			orientation: "orientation",
			origin: "origin",
			overflow: "overflow",
			overlineposition: "overlinePosition",
			"overline-position": "overlinePosition",
			overlinethickness: "overlineThickness",
			"overline-thickness": "overlineThickness",
			paintorder: "paintOrder",
			"paint-order": "paintOrder",
			panose1: "panose1",
			"panose-1": "panose1",
			pathlength: "pathLength",
			patterncontentunits: "patternContentUnits",
			patterntransform: "patternTransform",
			patternunits: "patternUnits",
			pointerevents: "pointerEvents",
			"pointer-events": "pointerEvents",
			points: "points",
			pointsatx: "pointsAtX",
			pointsaty: "pointsAtY",
			pointsatz: "pointsAtZ",
			popover: "popover",
			popovertarget: "popoverTarget",
			popovertargetaction: "popoverTargetAction",
			prefix: "prefix",
			preservealpha: "preserveAlpha",
			preserveaspectratio: "preserveAspectRatio",
			primitiveunits: "primitiveUnits",
			property: "property",
			r: "r",
			radius: "radius",
			refx: "refX",
			refy: "refY",
			renderingintent: "renderingIntent",
			"rendering-intent": "renderingIntent",
			repeatcount: "repeatCount",
			repeatdur: "repeatDur",
			requiredextensions: "requiredExtensions",
			requiredfeatures: "requiredFeatures",
			resource: "resource",
			restart: "restart",
			result: "result",
			results: "results",
			rotate: "rotate",
			rx: "rx",
			ry: "ry",
			scale: "scale",
			security: "security",
			seed: "seed",
			shaperendering: "shapeRendering",
			"shape-rendering": "shapeRendering",
			slope: "slope",
			spacing: "spacing",
			specularconstant: "specularConstant",
			specularexponent: "specularExponent",
			speed: "speed",
			spreadmethod: "spreadMethod",
			startoffset: "startOffset",
			stddeviation: "stdDeviation",
			stemh: "stemh",
			stemv: "stemv",
			stitchtiles: "stitchTiles",
			stopcolor: "stopColor",
			"stop-color": "stopColor",
			stopopacity: "stopOpacity",
			"stop-opacity": "stopOpacity",
			strikethroughposition: "strikethroughPosition",
			"strikethrough-position": "strikethroughPosition",
			strikethroughthickness: "strikethroughThickness",
			"strikethrough-thickness": "strikethroughThickness",
			string: "string",
			stroke: "stroke",
			strokedasharray: "strokeDasharray",
			"stroke-dasharray": "strokeDasharray",
			strokedashoffset: "strokeDashoffset",
			"stroke-dashoffset": "strokeDashoffset",
			strokelinecap: "strokeLinecap",
			"stroke-linecap": "strokeLinecap",
			strokelinejoin: "strokeLinejoin",
			"stroke-linejoin": "strokeLinejoin",
			strokemiterlimit: "strokeMiterlimit",
			"stroke-miterlimit": "strokeMiterlimit",
			strokewidth: "strokeWidth",
			"stroke-width": "strokeWidth",
			strokeopacity: "strokeOpacity",
			"stroke-opacity": "strokeOpacity",
			suppresscontenteditablewarning: "suppressContentEditableWarning",
			suppresshydrationwarning: "suppressHydrationWarning",
			surfacescale: "surfaceScale",
			systemlanguage: "systemLanguage",
			tablevalues: "tableValues",
			targetx: "targetX",
			targety: "targetY",
			textanchor: "textAnchor",
			"text-anchor": "textAnchor",
			textdecoration: "textDecoration",
			"text-decoration": "textDecoration",
			textlength: "textLength",
			textrendering: "textRendering",
			"text-rendering": "textRendering",
			to: "to",
			transform: "transform",
			transformorigin: "transformOrigin",
			"transform-origin": "transformOrigin",
			typeof: "typeof",
			u1: "u1",
			u2: "u2",
			underlineposition: "underlinePosition",
			"underline-position": "underlinePosition",
			underlinethickness: "underlineThickness",
			"underline-thickness": "underlineThickness",
			unicode: "unicode",
			unicodebidi: "unicodeBidi",
			"unicode-bidi": "unicodeBidi",
			unicoderange: "unicodeRange",
			"unicode-range": "unicodeRange",
			unitsperem: "unitsPerEm",
			"units-per-em": "unitsPerEm",
			unselectable: "unselectable",
			valphabetic: "vAlphabetic",
			"v-alphabetic": "vAlphabetic",
			values: "values",
			vectoreffect: "vectorEffect",
			"vector-effect": "vectorEffect",
			version: "version",
			vertadvy: "vertAdvY",
			"vert-adv-y": "vertAdvY",
			vertoriginx: "vertOriginX",
			"vert-origin-x": "vertOriginX",
			vertoriginy: "vertOriginY",
			"vert-origin-y": "vertOriginY",
			vhanging: "vHanging",
			"v-hanging": "vHanging",
			videographic: "vIdeographic",
			"v-ideographic": "vIdeographic",
			viewbox: "viewBox",
			viewtarget: "viewTarget",
			visibility: "visibility",
			vmathematical: "vMathematical",
			"v-mathematical": "vMathematical",
			vocab: "vocab",
			widths: "widths",
			wordspacing: "wordSpacing",
			"word-spacing": "wordSpacing",
			writingmode: "writingMode",
			"writing-mode": "writingMode",
			x1: "x1",
			x2: "x2",
			x: "x",
			xchannelselector: "xChannelSelector",
			xheight: "xHeight",
			"x-height": "xHeight",
			xlinkactuate: "xlinkActuate",
			"xlink:actuate": "xlinkActuate",
			xlinkarcrole: "xlinkArcrole",
			"xlink:arcrole": "xlinkArcrole",
			xlinkhref: "xlinkHref",
			"xlink:href": "xlinkHref",
			xlinkrole: "xlinkRole",
			"xlink:role": "xlinkRole",
			xlinkshow: "xlinkShow",
			"xlink:show": "xlinkShow",
			xlinktitle: "xlinkTitle",
			"xlink:title": "xlinkTitle",
			xlinktype: "xlinkType",
			"xlink:type": "xlinkType",
			xmlbase: "xmlBase",
			"xml:base": "xmlBase",
			xmllang: "xmlLang",
			"xml:lang": "xmlLang",
			xmlns: "xmlns",
			"xml:space": "xmlSpace",
			xmlnsxlink: "xmlnsXlink",
			"xmlns:xlink": "xmlnsXlink",
			xmlspace: "xmlSpace",
			y1: "y1",
			y2: "y2",
			y: "y",
			ychannelselector: "yChannelSelector",
			z: "z",
			zoomandpan: "zoomAndPan"
		}, Bm = {
			"aria-current": 0,
			"aria-description": 0,
			"aria-details": 0,
			"aria-disabled": 0,
			"aria-hidden": 0,
			"aria-invalid": 0,
			"aria-keyshortcuts": 0,
			"aria-label": 0,
			"aria-roledescription": 0,
			"aria-autocomplete": 0,
			"aria-checked": 0,
			"aria-expanded": 0,
			"aria-haspopup": 0,
			"aria-level": 0,
			"aria-modal": 0,
			"aria-multiline": 0,
			"aria-multiselectable": 0,
			"aria-orientation": 0,
			"aria-placeholder": 0,
			"aria-pressed": 0,
			"aria-readonly": 0,
			"aria-required": 0,
			"aria-selected": 0,
			"aria-sort": 0,
			"aria-valuemax": 0,
			"aria-valuemin": 0,
			"aria-valuenow": 0,
			"aria-valuetext": 0,
			"aria-atomic": 0,
			"aria-busy": 0,
			"aria-live": 0,
			"aria-relevant": 0,
			"aria-dropeffect": 0,
			"aria-grabbed": 0,
			"aria-activedescendant": 0,
			"aria-colcount": 0,
			"aria-colindex": 0,
			"aria-colspan": 0,
			"aria-controls": 0,
			"aria-describedby": 0,
			"aria-errormessage": 0,
			"aria-flowto": 0,
			"aria-labelledby": 0,
			"aria-owns": 0,
			"aria-posinset": 0,
			"aria-rowcount": 0,
			"aria-rowindex": 0,
			"aria-rowspan": 0,
			"aria-setsize": 0,
			"aria-braillelabel": 0,
			"aria-brailleroledescription": 0,
			"aria-colindextext": 0,
			"aria-rowindextext": 0
		}, Vm = {}, Hm = RegExp("^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Um = RegExp("^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Wm = !1, Gm = {}, Km = /^on./, qm = /^on[^A-Z]/, Jm = RegExp("^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ym = RegExp("^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Xm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i, Zm = null, Qm = null, $m = null, eh = !1, th = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), nh = !1;
		if (th) try {
			var rh = {};
			Object.defineProperty(rh, "passive", { get: function() {
				nh = !0;
			} }), window.addEventListener("test", rh, rh), window.removeEventListener("test", rh, rh);
		} catch {
			nh = !1;
		}
		var ih = null, ah = null, oh = null, sh = {
			eventPhase: 0,
			bubbles: 0,
			cancelable: 0,
			timeStamp: function(e) {
				return e.timeStamp || Date.now();
			},
			defaultPrevented: 0,
			isTrusted: 0
		}, ch = vn(sh), lh = z({}, sh, {
			view: 0,
			detail: 0
		}), uh = vn(lh), dh, fh, ph, mh = z({}, lh, {
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			pageX: 0,
			pageY: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			getModifierState: bn,
			button: 0,
			buttons: 0,
			relatedTarget: function(e) {
				return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
			},
			movementX: function(e) {
				return "movementX" in e ? e.movementX : (e !== ph && (ph && e.type === "mousemove" ? (dh = e.screenX - ph.screenX, fh = e.screenY - ph.screenY) : fh = dh = 0, ph = e), dh);
			},
			movementY: function(e) {
				return "movementY" in e ? e.movementY : fh;
			}
		}), hh = vn(mh), gh = vn(z({}, mh, { dataTransfer: 0 })), _h = vn(z({}, lh, { relatedTarget: 0 })), vh = vn(z({}, sh, {
			animationName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		})), yh = vn(z({}, sh, { clipboardData: function(e) {
			return "clipboardData" in e ? e.clipboardData : window.clipboardData;
		} })), bh = vn(z({}, sh, { data: 0 })), xh = bh, Sh = {
			Esc: "Escape",
			Spacebar: " ",
			Left: "ArrowLeft",
			Up: "ArrowUp",
			Right: "ArrowRight",
			Down: "ArrowDown",
			Del: "Delete",
			Win: "OS",
			Menu: "ContextMenu",
			Apps: "ContextMenu",
			Scroll: "ScrollLock",
			MozPrintableKey: "Unidentified"
		}, Ch = {
			8: "Backspace",
			9: "Tab",
			12: "Clear",
			13: "Enter",
			16: "Shift",
			17: "Control",
			18: "Alt",
			19: "Pause",
			20: "CapsLock",
			27: "Escape",
			32: " ",
			33: "PageUp",
			34: "PageDown",
			35: "End",
			36: "Home",
			37: "ArrowLeft",
			38: "ArrowUp",
			39: "ArrowRight",
			40: "ArrowDown",
			45: "Insert",
			46: "Delete",
			112: "F1",
			113: "F2",
			114: "F3",
			115: "F4",
			116: "F5",
			117: "F6",
			118: "F7",
			119: "F8",
			120: "F9",
			121: "F10",
			122: "F11",
			123: "F12",
			144: "NumLock",
			145: "ScrollLock",
			224: "Meta"
		}, wh = {
			Alt: "altKey",
			Control: "ctrlKey",
			Meta: "metaKey",
			Shift: "shiftKey"
		}, Th = vn(z({}, lh, {
			key: function(e) {
				if (e.key) {
					var t = Sh[e.key] || e.key;
					if (t !== "Unidentified") return t;
				}
				return e.type === "keypress" ? (e = hn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Ch[e.keyCode] || "Unidentified" : "";
			},
			code: 0,
			location: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			repeat: 0,
			locale: 0,
			getModifierState: bn,
			charCode: function(e) {
				return e.type === "keypress" ? hn(e) : 0;
			},
			keyCode: function(e) {
				return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			},
			which: function(e) {
				return e.type === "keypress" ? hn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			}
		})), Eh = vn(z({}, mh, {
			pointerId: 0,
			width: 0,
			height: 0,
			pressure: 0,
			tangentialPressure: 0,
			tiltX: 0,
			tiltY: 0,
			twist: 0,
			pointerType: 0,
			isPrimary: 0
		})), Dh = vn(z({}, lh, {
			touches: 0,
			targetTouches: 0,
			changedTouches: 0,
			altKey: 0,
			metaKey: 0,
			ctrlKey: 0,
			shiftKey: 0,
			getModifierState: bn
		})), Oh = vn(z({}, sh, {
			propertyName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		})), kh = vn(z({}, mh, {
			deltaX: function(e) {
				return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
			},
			deltaY: function(e) {
				return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
			},
			deltaZ: 0,
			deltaMode: 0
		})), Ah = vn(z({}, sh, {
			newState: 0,
			oldState: 0
		})), jh = [
			9,
			13,
			27,
			32
		], Mh = 229, Nh = th && "CompositionEvent" in window, Ph = null;
		th && "documentMode" in document && (Ph = document.documentMode);
		var Fh = th && "TextEvent" in window && !Ph, Ih = th && (!Nh || Ph && 8 < Ph && 11 >= Ph), Lh = 32, Rh = String.fromCharCode(Lh), zh = !1, Bh = !1, Vh = {
			color: !0,
			date: !0,
			datetime: !0,
			"datetime-local": !0,
			email: !0,
			month: !0,
			number: !0,
			password: !0,
			range: !0,
			search: !0,
			tel: !0,
			text: !0,
			time: !0,
			url: !0,
			week: !0
		}, Hh = null, Uh = null, Wh = !1;
		th && (Wh = En("input") && (!document.documentMode || 9 < document.documentMode));
		var Gh = typeof Object.is == "function" ? Object.is : Ln, Kh = th && "documentMode" in document && 11 >= document.documentMode, qh = null, Jh = null, Yh = null, Xh = !1, Zh = {
			animationend: Gn("Animation", "AnimationEnd"),
			animationiteration: Gn("Animation", "AnimationIteration"),
			animationstart: Gn("Animation", "AnimationStart"),
			transitionrun: Gn("Transition", "TransitionRun"),
			transitionstart: Gn("Transition", "TransitionStart"),
			transitioncancel: Gn("Transition", "TransitionCancel"),
			transitionend: Gn("Transition", "TransitionEnd")
		}, Qh = {}, $h = {};
		th && ($h = document.createElement("div").style, "AnimationEvent" in window || (delete Zh.animationend.animation, delete Zh.animationiteration.animation, delete Zh.animationstart.animation), "TransitionEvent" in window || delete Zh.transitionend.transition);
		var eg = Kn("animationend"), tg = Kn("animationiteration"), ng = Kn("animationstart"), rg = Kn("transitionrun"), ig = Kn("transitionstart"), ag = Kn("transitioncancel"), og = Kn("transitionend"), sg = /* @__PURE__ */ new Map(), cg = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
		cg.push("scrollEnd");
		var lg = 0;
		if (typeof performance == "object" && typeof performance.now == "function") var ug = performance, dg = function() {
			return ug.now();
		};
		else {
			var fg = Date;
			dg = function() {
				return fg.now();
			};
		}
		var pg = typeof reportError == "function" ? reportError : function(e) {
			if (typeof window == "object" && typeof window.ErrorEvent == "function") {
				var t = new window.ErrorEvent("error", {
					bubbles: !0,
					cancelable: !0,
					message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
					error: e
				});
				if (!window.dispatchEvent(t)) return;
			} else if (typeof process == "object" && typeof process.emit == "function") {
				process.emit("uncaughtException", e);
				return;
			}
			console.error(e);
		}, mg = "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.", hg = 0, gg = 1, _g = 2, vg = 3, yg = "–\xA0", bg = "+\xA0", xg = " \xA0", Sg = typeof console < "u" && typeof console.timeStamp == "function" && typeof performance < "u" && typeof performance.measure == "function", Cg = "Components ⚛", V = "Scheduler ⚛", H = "Blocking", wg = !1, Tg = {
			color: "primary",
			properties: null,
			tooltipText: "",
			track: Cg
		}, Eg = {
			start: -0,
			end: -0,
			detail: { devtools: Tg }
		}, Dg = ["Changed Props", ""], Og = "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner.", kg = ["Changed Props", Og], Ag = 1, jg = 2, Mg = [], Ng = 0, Pg = 0, Fg = {};
		Object.freeze(Fg);
		var Ig = null, Lg = null, U = 0, Rg = 1, W = 2, zg = 8, Bg = 16, Vg = 32, Hg = !1;
		try {
			Object.preventExtensions({});
		} catch {
			Hg = !0;
		}
		var Ug = /* @__PURE__ */ new WeakMap(), Wg = [], Gg = 0, Kg = null, qg = 0, Jg = [], Yg = 0, Xg = null, Zg = 1, Qg = "", $g = null, e_ = null, G = !1, t_ = !1, n_ = null, r_ = null, i_ = !1, a_ = Error("Hydration Mismatch Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), o_ = se(null), s_ = se(null), c_ = {}, l_ = null, u_ = null, d_ = !1, f_ = typeof AbortController < "u" ? AbortController : function() {
			var e = [], t = this.signal = {
				aborted: !1,
				addEventListener: function(t, n) {
					e.push(n);
				}
			};
			this.abort = function() {
				t.aborted = !0, e.forEach(function(e) {
					return e();
				});
			};
		}, p_ = Of.unstable_scheduleCallback, m_ = Of.unstable_NormalPriority, h_ = {
			$$typeof: Rf,
			Consumer: null,
			Provider: null,
			_currentValue: null,
			_currentValue2: null,
			_threadCount: 0,
			_currentRenderer: null,
			_currentRenderer2: null
		}, g_ = Of.unstable_now, __ = console.createTask ? console.createTask : function() {
			return null;
		}, v_ = 1, y_ = 2, b_ = -0, x_ = -0, S_ = -0, C_ = null, w_ = -1.1, T_ = -0, E_ = -0, K = -1.1, q = -1.1, D_ = null, O_ = !1, k_ = -0, A_ = -1.1, j_ = null, M_ = 0, N_ = null, P_ = null, F_ = -1.1, I_ = null, L_ = -1.1, R_ = -1.1, z_ = -0, B_ = -1.1, V_ = -1.1, H_ = 0, U_ = null, W_ = null, G_ = null, K_ = -1.1, q_ = null, J_ = -1.1, Y_ = -1.1, X_ = -0, Z_ = -0, Q_ = 0, $_ = null, ev = 0, tv = -1.1, nv = !1, rv = !1, iv = null, av = 0, ov = 0, sv = null, cv = B.S;
		B.S = function(e, t) {
			if (vx = Cp(), typeof t == "object" && t && typeof t.then == "function") {
				if (0 > B_ && 0 > V_) {
					B_ = g_();
					var n = qu(), r = Ku();
					(n !== J_ || r !== q_) && (J_ = -1.1), K_ = n, q_ = r;
				}
				ji(e, t);
			}
			cv !== null && cv(e, t);
		};
		var lv = se(null), uv = {
			recordUnsafeLifecycleWarnings: function() {},
			flushPendingUnsafeLifecycleWarnings: function() {},
			recordLegacyContextWarning: function() {},
			flushLegacyContextWarning: function() {},
			discardPendingWarnings: function() {}
		}, dv = [], fv = [], pv = [], mv = [], hv = [], gv = [], _v = /* @__PURE__ */ new Set();
		uv.recordUnsafeLifecycleWarnings = function(e, t) {
			_v.has(e.type) || (typeof t.componentWillMount == "function" && !0 !== t.componentWillMount.__suppressDeprecationWarning && dv.push(e), e.mode & zg && typeof t.UNSAFE_componentWillMount == "function" && fv.push(e), typeof t.componentWillReceiveProps == "function" && !0 !== t.componentWillReceiveProps.__suppressDeprecationWarning && pv.push(e), e.mode & zg && typeof t.UNSAFE_componentWillReceiveProps == "function" && mv.push(e), typeof t.componentWillUpdate == "function" && !0 !== t.componentWillUpdate.__suppressDeprecationWarning && hv.push(e), e.mode & zg && typeof t.UNSAFE_componentWillUpdate == "function" && gv.push(e));
		}, uv.flushPendingUnsafeLifecycleWarnings = function() {
			var e = /* @__PURE__ */ new Set();
			0 < dv.length && (dv.forEach(function(t) {
				e.add(C(t) || "Component"), _v.add(t.type);
			}), dv = []);
			var t = /* @__PURE__ */ new Set();
			0 < fv.length && (fv.forEach(function(e) {
				t.add(C(e) || "Component"), _v.add(e.type);
			}), fv = []);
			var n = /* @__PURE__ */ new Set();
			0 < pv.length && (pv.forEach(function(e) {
				n.add(C(e) || "Component"), _v.add(e.type);
			}), pv = []);
			var r = /* @__PURE__ */ new Set();
			0 < mv.length && (mv.forEach(function(e) {
				r.add(C(e) || "Component"), _v.add(e.type);
			}), mv = []);
			var i = /* @__PURE__ */ new Set();
			0 < hv.length && (hv.forEach(function(e) {
				i.add(C(e) || "Component"), _v.add(e.type);
			}), hv = []);
			var a = /* @__PURE__ */ new Set();
			if (0 < gv.length && (gv.forEach(function(e) {
				a.add(C(e) || "Component"), _v.add(e.type);
			}), gv = []), 0 < t.size) {
				var o = h(t);
				console.error("Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n\nPlease update the following components: %s", o);
			}
			0 < r.size && (o = h(r), console.error("Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n\nPlease update the following components: %s", o)), 0 < a.size && (o = h(a), console.error("Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n\nPlease update the following components: %s", o)), 0 < e.size && (o = h(e), console.warn("componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o)), 0 < n.size && (o = h(n), console.warn("componentWillReceiveProps has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o)), 0 < i.size && (o = h(i), console.warn("componentWillUpdate has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o));
		};
		var vv = /* @__PURE__ */ new Map(), yv = /* @__PURE__ */ new Set();
		uv.recordLegacyContextWarning = function(e, t) {
			for (var n = null, r = e; r !== null;) r.mode & zg && (n = r), r = r.return;
			n === null ? console.error("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.") : !yv.has(e.type) && (r = vv.get(n), e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (r === void 0 && (r = [], vv.set(n, r)), r.push(e));
		}, uv.flushLegacyContextWarning = function() {
			vv.forEach(function(e) {
				if (e.length !== 0) {
					var t = e[0], n = /* @__PURE__ */ new Set();
					e.forEach(function(e) {
						n.add(C(e) || "Component"), yv.add(e.type);
					});
					var r = h(n);
					D(t, function() {
						console.error("Legacy context API has been detected within a strict-mode tree.\n\nThe old API will be supported in all 16.x releases, but applications using it should migrate to the new version.\n\nPlease update the following components: %s\n\nLearn more about this warning here: https://react.dev/link/legacy-context", r);
					});
				}
			});
		}, uv.discardPendingWarnings = function() {
			dv = [], fv = [], pv = [], mv = [], hv = [], gv = [], vv = /* @__PURE__ */ new Map();
		};
		var bv = { react_stack_bottom_frame: function(e, t, n) {
			var r = _p;
			_p = !0;
			try {
				return e(t, n);
			} finally {
				_p = r;
			}
		} }, xv = bv.react_stack_bottom_frame.bind(bv), Sv = { react_stack_bottom_frame: function(e) {
			var t = _p;
			_p = !0;
			try {
				return e.render();
			} finally {
				_p = t;
			}
		} }, Cv = Sv.react_stack_bottom_frame.bind(Sv), wv = { react_stack_bottom_frame: function(e, t) {
			try {
				t.componentDidMount();
			} catch (t) {
				N(e, e.return, t);
			}
		} }, Tv = wv.react_stack_bottom_frame.bind(wv), Ev = { react_stack_bottom_frame: function(e, t, n, r, i) {
			try {
				t.componentDidUpdate(n, r, i);
			} catch (t) {
				N(e, e.return, t);
			}
		} }, Dv = Ev.react_stack_bottom_frame.bind(Ev), Ov = { react_stack_bottom_frame: function(e, t) {
			var n = t.stack;
			e.componentDidCatch(t.value, { componentStack: n === null ? "" : n });
		} }, kv = Ov.react_stack_bottom_frame.bind(Ov), Av = { react_stack_bottom_frame: function(e, t, n) {
			try {
				n.componentWillUnmount();
			} catch (n) {
				N(e, t, n);
			}
		} }, jv = Av.react_stack_bottom_frame.bind(Av), Mv = { react_stack_bottom_frame: function(e) {
			var t = e.create;
			return e = e.inst, t = t(), e.destroy = t;
		} }, Nv = Mv.react_stack_bottom_frame.bind(Mv), Pv = { react_stack_bottom_frame: function(e, t, n) {
			try {
				n();
			} catch (n) {
				N(e, t, n);
			}
		} }, Fv = Pv.react_stack_bottom_frame.bind(Pv), Iv = { react_stack_bottom_frame: function(e) {
			var t = e._init;
			return t(e._payload);
		} }, Lv = Iv.react_stack_bottom_frame.bind(Iv), Rv = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."), zv = Error("Suspense Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), Bv = Error("Suspense Exception: This is not a real error! It's an implementation detail of `useActionState` to interrupt the current render. You must either rethrow it immediately, or move the `useActionState` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary."), Vv = { then: function() {
			console.error("Internal React error: A listener was unexpectedly attached to a \"noop\" thenable. This is a bug in React. Please file an issue.");
		} }, Hv = null, Uv = !1, Wv = null, Gv = 0, J = null, Kv, qv = Kv = !1, Jv = {}, Yv = {}, Xv = {};
		m = function(e, t, n) {
			if (typeof n == "object" && n && n._store && (!n._store.validated && n.key == null || n._store.validated === 2)) {
				if (typeof n._store != "object") throw Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
				n._store.validated = 1;
				var r = C(e), i = r || "null";
				if (!Jv[i]) {
					Jv[i] = !0, n = n._owner, e = e._debugOwner;
					var a = "";
					e && typeof e.tag == "number" && (i = C(e)) && (a = "\n\nCheck the render method of `" + i + "`."), a || r && (a = "\n\nCheck the top-level render call using <" + r + ">.");
					var o = "";
					n != null && e !== n && (r = null, typeof n.tag == "number" ? r = C(n) : typeof n.name == "string" && (r = n.name), r && (o = " It was passed a child from " + r + ".")), D(t, function() {
						console.error("Each child in a list should have a unique \"key\" prop.%s%s See https://react.dev/link/warning-keys for more information.", a, o);
					});
				}
			}
		};
		var Zv = $i(!0), Qv = $i(!1), $v = 0, ey = 1, ty = 2, ny = 3, ry = !1, iy = !1, ay = null, oy = !1, sy = se(null), cy = se(0), ly = se(null), uy = null, dy = 1, fy = 2, py = se(0), my = 0, hy = 1, gy = 2, _y = 4, vy = 8, yy, by = /* @__PURE__ */ new Set(), xy = /* @__PURE__ */ new Set(), Sy = /* @__PURE__ */ new Set(), Cy = /* @__PURE__ */ new Set(), wy = 0, Y = null, Ty = null, Ey = null, Dy = !1, Oy = !1, ky = !1, Ay = 0, jy = 0, My = null, Ny = 0, Py = 25, X = null, Fy = null, Iy = -1, Ly = !1, Ry = {
			readContext: oi,
			use: Ia,
			useCallback: Ca,
			useContext: Ca,
			useEffect: Ca,
			useImperativeHandle: Ca,
			useLayoutEffect: Ca,
			useInsertionEffect: Ca,
			useMemo: Ca,
			useReducer: Ca,
			useRef: Ca,
			useState: Ca,
			useDebugValue: Ca,
			useDeferredValue: Ca,
			useTransition: Ca,
			useSyncExternalStore: Ca,
			useId: Ca,
			useHostTransitionStatus: Ca,
			useFormState: Ca,
			useActionState: Ca,
			useOptimistic: Ca,
			useMemoCache: Ca,
			useCacheRefresh: Ca
		};
		Ry.useEffectEvent = Ca;
		var zy = null, By = null, Vy = null, Hy = null, Uy = null, Wy = null, Gy = null;
		zy = {
			readContext: function(e) {
				return oi(e);
			},
			use: Ia,
			useCallback: function(e, t) {
				return X = "useCallback", A(), xa(t), Eo(e, t);
			},
			useContext: function(e) {
				return X = "useContext", A(), oi(e);
			},
			useEffect: function(e, t) {
				return X = "useEffect", A(), xa(t), yo(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", A(), xa(n), wo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				X = "useInsertionEffect", A(), xa(t), _o(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", A(), xa(t), So(e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", A(), xa(t);
				var n = B.H;
				B.H = Uy;
				try {
					return Oo(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", A();
				var r = B.H;
				B.H = Uy;
				try {
					return za(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function(e) {
				return X = "useRef", A(), go(e);
			},
			useState: function(e) {
				X = "useState", A();
				var t = B.H;
				B.H = Uy;
				try {
					return Za(e);
				} finally {
					B.H = t;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", A();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", A(), Ao(e, t);
			},
			useTransition: function() {
				return X = "useTransition", A(), Bo();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", A(), Ua(e, t, n);
			},
			useId: function() {
				return X = "useId", A(), Wo();
			},
			useFormState: function(e, t) {
				return X = "useFormState", A(), Sa(), lo(e, t);
			},
			useActionState: function(e, t) {
				return X = "useActionState", A(), lo(e, t);
			},
			useOptimistic: function(e) {
				return X = "useOptimistic", A(), Qa(e);
			},
			useHostTransitionStatus: Uo,
			useMemoCache: La,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", A(), Go();
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", A(), xo(e);
			}
		}, By = {
			readContext: function(e) {
				return oi(e);
			},
			use: Ia,
			useCallback: function(e, t) {
				return X = "useCallback", j(), Eo(e, t);
			},
			useContext: function(e) {
				return X = "useContext", j(), oi(e);
			},
			useEffect: function(e, t) {
				return X = "useEffect", j(), yo(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", j(), wo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				X = "useInsertionEffect", j(), _o(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", j(), So(e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", j();
				var n = B.H;
				B.H = Uy;
				try {
					return Oo(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", j();
				var r = B.H;
				B.H = Uy;
				try {
					return za(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function(e) {
				return X = "useRef", j(), go(e);
			},
			useState: function(e) {
				X = "useState", j();
				var t = B.H;
				B.H = Uy;
				try {
					return Za(e);
				} finally {
					B.H = t;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", j();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", j(), Ao(e, t);
			},
			useTransition: function() {
				return X = "useTransition", j(), Bo();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", j(), Ua(e, t, n);
			},
			useId: function() {
				return X = "useId", j(), Wo();
			},
			useActionState: function(e, t) {
				return X = "useActionState", j(), lo(e, t);
			},
			useFormState: function(e, t) {
				return X = "useFormState", j(), Sa(), lo(e, t);
			},
			useOptimistic: function(e) {
				return X = "useOptimistic", j(), Qa(e);
			},
			useHostTransitionStatus: Uo,
			useMemoCache: La,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", j(), Go();
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", j(), xo(e);
			}
		}, Vy = {
			readContext: function(e) {
				return oi(e);
			},
			use: Ia,
			useCallback: function(e, t) {
				return X = "useCallback", j(), Do(e, t);
			},
			useContext: function(e) {
				return X = "useContext", j(), oi(e);
			},
			useEffect: function(e, t) {
				X = "useEffect", j(), vo(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", j(), To(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return X = "useInsertionEffect", j(), vo(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", j(), vo(4, _y, e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", j();
				var n = B.H;
				B.H = Wy;
				try {
					return ko(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", j();
				var r = B.H;
				B.H = Wy;
				try {
					return Ba(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function() {
				return X = "useRef", j(), Na().memoizedState;
			},
			useState: function() {
				X = "useState", j();
				var e = B.H;
				B.H = Wy;
				try {
					return Ba(Ra);
				} finally {
					B.H = e;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", j();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", j(), jo(e, t);
			},
			useTransition: function() {
				return X = "useTransition", j(), Vo();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", j(), Wa(e, t, n);
			},
			useId: function() {
				return X = "useId", j(), Na().memoizedState;
			},
			useFormState: function(e) {
				return X = "useFormState", j(), Sa(), uo(e);
			},
			useActionState: function(e) {
				return X = "useActionState", j(), uo(e);
			},
			useOptimistic: function(e, t) {
				return X = "useOptimistic", j(), $a(e, t);
			},
			useHostTransitionStatus: Uo,
			useMemoCache: La,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", j(), Na().memoizedState;
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", j(), M(e);
			}
		}, Hy = {
			readContext: function(e) {
				return oi(e);
			},
			use: Ia,
			useCallback: function(e, t) {
				return X = "useCallback", j(), Do(e, t);
			},
			useContext: function(e) {
				return X = "useContext", j(), oi(e);
			},
			useEffect: function(e, t) {
				X = "useEffect", j(), vo(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", j(), To(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return X = "useInsertionEffect", j(), vo(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", j(), vo(4, _y, e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", j();
				var n = B.H;
				B.H = Gy;
				try {
					return ko(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", j();
				var r = B.H;
				B.H = Gy;
				try {
					return Ha(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function() {
				return X = "useRef", j(), Na().memoizedState;
			},
			useState: function() {
				X = "useState", j();
				var e = B.H;
				B.H = Gy;
				try {
					return Ha(Ra);
				} finally {
					B.H = e;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", j();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", j(), Mo(e, t);
			},
			useTransition: function() {
				return X = "useTransition", j(), Ho();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", j(), Wa(e, t, n);
			},
			useId: function() {
				return X = "useId", j(), Na().memoizedState;
			},
			useFormState: function(e) {
				return X = "useFormState", j(), Sa(), mo(e);
			},
			useActionState: function(e) {
				return X = "useActionState", j(), mo(e);
			},
			useOptimistic: function(e, t) {
				return X = "useOptimistic", j(), to(e, t);
			},
			useHostTransitionStatus: Uo,
			useMemoCache: La,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", j(), Na().memoizedState;
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", j(), M(e);
			}
		}, Uy = {
			readContext: function(e) {
				return f(), oi(e);
			},
			use: function(e) {
				return d(), Ia(e);
			},
			useCallback: function(e, t) {
				return X = "useCallback", d(), A(), Eo(e, t);
			},
			useContext: function(e) {
				return X = "useContext", d(), A(), oi(e);
			},
			useEffect: function(e, t) {
				return X = "useEffect", d(), A(), yo(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", d(), A(), wo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				X = "useInsertionEffect", d(), A(), _o(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", d(), A(), So(e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", d(), A();
				var n = B.H;
				B.H = Uy;
				try {
					return Oo(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", d(), A();
				var r = B.H;
				B.H = Uy;
				try {
					return za(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function(e) {
				return X = "useRef", d(), A(), go(e);
			},
			useState: function(e) {
				X = "useState", d(), A();
				var t = B.H;
				B.H = Uy;
				try {
					return Za(e);
				} finally {
					B.H = t;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", d(), A();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", d(), A(), Ao(e, t);
			},
			useTransition: function() {
				return X = "useTransition", d(), A(), Bo();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", d(), A(), Ua(e, t, n);
			},
			useId: function() {
				return X = "useId", d(), A(), Wo();
			},
			useFormState: function(e, t) {
				return X = "useFormState", d(), A(), lo(e, t);
			},
			useActionState: function(e, t) {
				return X = "useActionState", d(), A(), lo(e, t);
			},
			useOptimistic: function(e) {
				return X = "useOptimistic", d(), A(), Qa(e);
			},
			useMemoCache: function(e) {
				return d(), La(e);
			},
			useHostTransitionStatus: Uo,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", A(), Go();
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", d(), A(), xo(e);
			}
		}, Wy = {
			readContext: function(e) {
				return f(), oi(e);
			},
			use: function(e) {
				return d(), Ia(e);
			},
			useCallback: function(e, t) {
				return X = "useCallback", d(), j(), Do(e, t);
			},
			useContext: function(e) {
				return X = "useContext", d(), j(), oi(e);
			},
			useEffect: function(e, t) {
				X = "useEffect", d(), j(), vo(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", d(), j(), To(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return X = "useInsertionEffect", d(), j(), vo(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", d(), j(), vo(4, _y, e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", d(), j();
				var n = B.H;
				B.H = Wy;
				try {
					return ko(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", d(), j();
				var r = B.H;
				B.H = Wy;
				try {
					return Ba(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function() {
				return X = "useRef", d(), j(), Na().memoizedState;
			},
			useState: function() {
				X = "useState", d(), j();
				var e = B.H;
				B.H = Wy;
				try {
					return Ba(Ra);
				} finally {
					B.H = e;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", d(), j();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", d(), j(), jo(e, t);
			},
			useTransition: function() {
				return X = "useTransition", d(), j(), Vo();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", d(), j(), Wa(e, t, n);
			},
			useId: function() {
				return X = "useId", d(), j(), Na().memoizedState;
			},
			useFormState: function(e) {
				return X = "useFormState", d(), j(), uo(e);
			},
			useActionState: function(e) {
				return X = "useActionState", d(), j(), uo(e);
			},
			useOptimistic: function(e, t) {
				return X = "useOptimistic", d(), j(), $a(e, t);
			},
			useMemoCache: function(e) {
				return d(), La(e);
			},
			useHostTransitionStatus: Uo,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", j(), Na().memoizedState;
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", d(), j(), M(e);
			}
		}, Gy = {
			readContext: function(e) {
				return f(), oi(e);
			},
			use: function(e) {
				return d(), Ia(e);
			},
			useCallback: function(e, t) {
				return X = "useCallback", d(), j(), Do(e, t);
			},
			useContext: function(e) {
				return X = "useContext", d(), j(), oi(e);
			},
			useEffect: function(e, t) {
				X = "useEffect", d(), j(), vo(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return X = "useImperativeHandle", d(), j(), To(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return X = "useInsertionEffect", d(), j(), vo(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return X = "useLayoutEffect", d(), j(), vo(4, _y, e, t);
			},
			useMemo: function(e, t) {
				X = "useMemo", d(), j();
				var n = B.H;
				B.H = Wy;
				try {
					return ko(e, t);
				} finally {
					B.H = n;
				}
			},
			useReducer: function(e, t, n) {
				X = "useReducer", d(), j();
				var r = B.H;
				B.H = Wy;
				try {
					return Ha(e, t, n);
				} finally {
					B.H = r;
				}
			},
			useRef: function() {
				return X = "useRef", d(), j(), Na().memoizedState;
			},
			useState: function() {
				X = "useState", d(), j();
				var e = B.H;
				B.H = Wy;
				try {
					return Ha(Ra);
				} finally {
					B.H = e;
				}
			},
			useDebugValue: function() {
				X = "useDebugValue", d(), j();
			},
			useDeferredValue: function(e, t) {
				return X = "useDeferredValue", d(), j(), Mo(e, t);
			},
			useTransition: function() {
				return X = "useTransition", d(), j(), Ho();
			},
			useSyncExternalStore: function(e, t, n) {
				return X = "useSyncExternalStore", d(), j(), Wa(e, t, n);
			},
			useId: function() {
				return X = "useId", d(), j(), Na().memoizedState;
			},
			useFormState: function(e) {
				return X = "useFormState", d(), j(), mo(e);
			},
			useActionState: function(e) {
				return X = "useActionState", d(), j(), mo(e);
			},
			useOptimistic: function(e, t) {
				return X = "useOptimistic", d(), j(), to(e, t);
			},
			useMemoCache: function(e) {
				return d(), La(e);
			},
			useHostTransitionStatus: Uo,
			useCacheRefresh: function() {
				return X = "useCacheRefresh", j(), Na().memoizedState;
			},
			useEffectEvent: function(e) {
				return X = "useEffectEvent", d(), j(), M(e);
			}
		};
		var Ky = {}, qy = /* @__PURE__ */ new Set(), Jy = /* @__PURE__ */ new Set(), Yy = /* @__PURE__ */ new Set(), Xy = /* @__PURE__ */ new Set(), Zy = /* @__PURE__ */ new Set(), Qy = /* @__PURE__ */ new Set(), $y = /* @__PURE__ */ new Set(), eb = /* @__PURE__ */ new Set(), tb = /* @__PURE__ */ new Set(), nb = /* @__PURE__ */ new Set();
		Object.freeze(Ky);
		var rb = {
			enqueueSetState: function(e, t, n) {
				e = e._reactInternals;
				var r = il(e), i = ra(r);
				i.payload = t, n != null && (es(n), i.callback = n), t = ia(e, i, r), t !== null && (fi(r, "this.setState()", e), ol(t, e, r), aa(t, e, r));
			},
			enqueueReplaceState: function(e, t, n) {
				e = e._reactInternals;
				var r = il(e), i = ra(r);
				i.tag = ey, i.payload = t, n != null && (es(n), i.callback = n), t = ia(e, i, r), t !== null && (fi(r, "this.replaceState()", e), ol(t, e, r), aa(t, e, r));
			},
			enqueueForceUpdate: function(e, t) {
				e = e._reactInternals;
				var n = il(e), r = ra(n);
				r.tag = ty, t != null && (es(t), r.callback = t), t = ia(e, r, n), t !== null && (fi(n, "this.forceUpdate()", e), ol(t, e, n), aa(t, e, n));
			}
		}, ib = null, ab = null, ob = Error("This is not a real error. It's an implementation detail of React's selective hydration feature. If this leaks into userspace, it's a bug in React. Please file an issue."), sb = !1, cb = {}, lb = {}, ub = {}, db = {}, fb = !1, pb = {}, mb = {}, hb = {
			dehydrated: null,
			treeContext: null,
			retryLane: 0,
			hydrationErrors: null
		}, gb = !1, _b = null;
		_b = /* @__PURE__ */ new Set();
		var vb = !1, yb = !1, bb = !1, xb = typeof WeakSet == "function" ? WeakSet : Set, Sb = null, Cb = null, wb = null, Tb = null, Eb = !1, Db = null, Ob = !1, kb = 8192, Ab = {
			getCacheForType: function(e) {
				var t = oi(h_), n = t.data.get(e);
				return n === void 0 && (n = e(), t.data.set(e, n)), n;
			},
			cacheSignal: function() {
				return oi(h_).controller.signal;
			},
			getOwner: function() {
				return gp;
			}
		};
		if (typeof Symbol == "function" && Symbol.for) {
			var jb = Symbol.for;
			jb("selector.component"), jb("selector.has_pseudo_class"), jb("selector.role"), jb("selector.test_id"), jb("selector.text");
		}
		var Mb = [], Nb = typeof WeakMap == "function" ? WeakMap : Map, Pb = 0, Fb = 2, Ib = 4, Lb = 0, Rb = 1, zb = 2, Bb = 3, Vb = 4, Hb = 6, Ub = 5, Wb = Pb, Gb = null, Z = null, Q = 0, Kb = 0, qb = 1, Jb = 2, Yb = 3, Xb = 4, Zb = 5, Qb = 6, $b = 7, ex = 8, tx = 9, nx = Kb, rx = null, ix = !1, ax = !1, ox = !1, sx = 0, cx = Lb, lx = 0, ux = 0, dx = 0, fx = 0, px = 0, mx = null, hx = null, gx = !1, _x = 0, vx = 0, yx = 300, bx = Infinity, xx = 500, Sx = null, Cx = null, wx = null, Tx = 0, Ex = 1, Dx = 2, Ox = 3, kx = 0, Ax = 1, jx = 2, Mx = 3, Nx = 4, Px = 5, Fx = 0, Ix = null, Lx = null, Rx = 0, zx = 0, Bx = -0, Vx = null, Hx = null, Ux = null, Wx = Tx, Gx = null, Kx = 50, qx = 0, Jx = null, Yx = !1, Xx = !1, Zx = 50, Qx = 0, $x = null, eS = !1, tS = null, nS = !1, rS = /* @__PURE__ */ new Set(), iS = {}, aS = null, oS = null, sS = !1, cS = !1, lS = !1, uS = !1, dS = 0, fS = {};
		(function() {
			for (var e = 0; e < cg.length; e++) {
				var t = cg[e], n = t.toLowerCase();
				t = t[0].toUpperCase() + t.slice(1), qn(n, "on" + t);
			}
			qn(eg, "onAnimationEnd"), qn(tg, "onAnimationIteration"), qn(ng, "onAnimationStart"), qn("dblclick", "onDoubleClick"), qn("focusin", "onFocus"), qn("focusout", "onBlur"), qn(rg, "onTransitionRun"), qn(ig, "onTransitionStart"), qn(ag, "onTransitionCancel"), qn(og, "onTransitionEnd");
		})(), rt("onMouseEnter", ["mouseout", "mouseover"]), rt("onMouseLeave", ["mouseout", "mouseover"]), rt("onPointerEnter", ["pointerout", "pointerover"]), rt("onPointerLeave", ["pointerout", "pointerover"]), nt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), nt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), nt("onBeforeInput", [
			"compositionend",
			"keypress",
			"textInput",
			"paste"
		]), nt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), nt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), nt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
		var pS = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mS = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pS)), hS = "_reactListening" + Math.random().toString(36).slice(2), gS = !1, _S = !1, vS = !1, yS = !1, bS = !1, xS = !1, SS = !1, CS = {}, wS = /\r\n?/g, TS = /\u0000|\uFFFD/g, ES = "http://www.w3.org/1999/xlink", DS = "http://www.w3.org/XML/1998/namespace", OS = "javascript:throw new Error('React form unexpectedly submitted.')", kS = "suppressHydrationWarning", AS = "&", jS = "/&", MS = "$", NS = "/$", PS = "$?", FS = "$~", IS = "$!", LS = "html", RS = "body", zS = "head", BS = "F!", VS = "F", HS = "loading", US = "style", WS = 0, GS = 1, KS = 2, qS = null, JS = null, YS = {
			dialog: !0,
			webview: !0
		}, XS = null, ZS = void 0, QS = typeof setTimeout == "function" ? setTimeout : void 0, $S = typeof clearTimeout == "function" ? clearTimeout : void 0, eC = -1, tC = typeof Promise == "function" ? Promise : void 0, nC = typeof queueMicrotask == "function" ? queueMicrotask : tC === void 0 ? QS : function(e) {
			return tC.resolve(null).then(e).catch(Ju);
		}, rC = null, iC = 0, aC = 1, oC = 2, sC = 3, cC = 4, lC = /* @__PURE__ */ new Map(), uC = /* @__PURE__ */ new Set(), dC = Yf.d;
		Yf.d = {
			f: function() {
				var e = dC.f(), t = dl();
				return e || t;
			},
			r: function(e) {
				var t = Qe(e);
				t !== null && t.tag === 5 && t.type === "form" ? zo(t) : dC.r(e);
			},
			D: function(e) {
				dC.D(e), jd("dns-prefetch", e, null);
			},
			C: function(e, t) {
				dC.C(e, t), jd("preconnect", e, t);
			},
			L: function(e, t, n) {
				dC.L(e, t, n);
				var r = fC;
				if (r && e && t) {
					var i = "link[rel=\"preload\"][as=\"" + gt(t) + "\"]";
					t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + gt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + gt(n.imageSizes) + "\"]")) : i += "[href=\"" + gt(e) + "\"]";
					var a = i;
					switch (t) {
						case "style":
							a = R(e);
							break;
						case "script": a = Ld(e);
					}
					lC.has(a) || (e = z({
						rel: "preload",
						href: t === "image" && n && n.imageSrcSet ? void 0 : e,
						as: t
					}, n), lC.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Pd(a)) || t === "script" && r.querySelector(Rd(a)) || (t = r.createElement("link"), Du(t, "link", e), tt(t), r.head.appendChild(t)));
				}
			},
			m: function(e, t) {
				dC.m(e, t);
				var n = fC;
				if (n && e) {
					var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + gt(r) + "\"][href=\"" + gt(e) + "\"]", a = i;
					switch (r) {
						case "audioworklet":
						case "paintworklet":
						case "serviceworker":
						case "sharedworker":
						case "worker":
						case "script": a = Ld(e);
					}
					if (!lC.has(a) && (e = z({
						rel: "modulepreload",
						href: e
					}, t), lC.set(a, e), n.querySelector(i) === null)) {
						switch (r) {
							case "audioworklet":
							case "paintworklet":
							case "serviceworker":
							case "sharedworker":
							case "worker":
							case "script": if (n.querySelector(Rd(a))) return;
						}
						r = n.createElement("link"), Du(r, "link", e), tt(r), n.head.appendChild(r);
					}
				}
			},
			X: function(e, t) {
				dC.X(e, t);
				var n = fC;
				if (n && e) {
					var r = et(n).hoistableScripts, i = Ld(e), a = r.get(i);
					a || (a = n.querySelector(Rd(i)), a || (e = z({
						src: e,
						async: !0
					}, t), (t = lC.get(i)) && Hd(e, t), a = n.createElement("script"), tt(a), Du(a, "link", e), n.head.appendChild(a)), a = {
						type: "script",
						instance: a,
						count: 1,
						state: null
					}, r.set(i, a));
				}
			},
			S: function(e, t, n) {
				dC.S(e, t, n);
				var r = fC;
				if (r && e) {
					var i = et(r).hoistableStyles, a = R(e);
					t ||= "default";
					var o = i.get(a);
					if (!o) {
						var s = {
							loading: iC,
							preload: null
						};
						if (o = r.querySelector(Pd(a))) s.loading = aC | cC;
						else {
							e = z({
								rel: "stylesheet",
								href: e,
								"data-precedence": t
							}, n), (n = lC.get(a)) && Vd(e, n);
							var c = o = r.createElement("link");
							tt(c), Du(c, "link", e), c._p = new Promise(function(e, t) {
								c.onload = e, c.onerror = t;
							}), c.addEventListener("load", function() {
								s.loading |= aC;
							}), c.addEventListener("error", function() {
								s.loading |= oC;
							}), s.loading |= cC, Bd(o, t, r);
						}
						o = {
							type: "stylesheet",
							instance: o,
							count: 1,
							state: s
						}, i.set(a, o);
					}
				}
			},
			M: function(e, t) {
				dC.M(e, t);
				var n = fC;
				if (n && e) {
					var r = et(n).hoistableScripts, i = Ld(e), a = r.get(i);
					a || (a = n.querySelector(Rd(i)), a || (e = z({
						src: e,
						async: !0,
						type: "module"
					}, t), (t = lC.get(i)) && Hd(e, t), a = n.createElement("script"), tt(a), Du(a, "link", e), n.head.appendChild(a)), a = {
						type: "script",
						instance: a,
						count: 1,
						state: null
					}, r.set(i, a));
				}
			}
		};
		var fC = typeof document > "u" ? null : document, pC = null, mC = 6e4, hC = 800, gC = 500, _C = 0, vC = null, yC = null, bC = Xf, xC = {
			$$typeof: Rf,
			Provider: null,
			Consumer: null,
			_currentValue: bC,
			_currentValue2: bC,
			_threadCount: 0
		}, SC = "%c%s%c", CC = "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", wC = "", TC = " ", EC = Function.prototype.bind, DC = !1, OC = null, kC = null, AC = null, jC = null, MC = null, NC = null, PC = null, FC = null, IC = null, LC = null;
		OC = function(e, r, i, a) {
			r = t(e, r), r !== null && (i = n(r.memoizedState, i, 0, a), r.memoizedState = i, r.baseState = i, e.memoizedProps = z({}, e.memoizedProps), i = hr(e, 2), i !== null && ol(i, e, 2));
		}, kC = function(e, n, r) {
			n = t(e, n), n !== null && (r = s(n.memoizedState, r, 0), n.memoizedState = r, n.baseState = r, e.memoizedProps = z({}, e.memoizedProps), r = hr(e, 2), r !== null && ol(r, e, 2));
		}, AC = function(e, n, r, a) {
			n = t(e, n), n !== null && (r = i(n.memoizedState, r, a), n.memoizedState = r, n.baseState = r, e.memoizedProps = z({}, e.memoizedProps), r = hr(e, 2), r !== null && ol(r, e, 2));
		}, jC = function(e, t, r) {
			e.pendingProps = n(e.memoizedProps, t, 0, r), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = hr(e, 2), t !== null && ol(t, e, 2);
		}, MC = function(e, t) {
			e.pendingProps = s(e.memoizedProps, t, 0), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = hr(e, 2), t !== null && ol(t, e, 2);
		}, NC = function(e, t, n) {
			e.pendingProps = i(e.memoizedProps, t, n), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = hr(e, 2), t !== null && ol(t, e, 2);
		}, PC = function(e) {
			var t = hr(e, 2);
			t !== null && ol(t, e, 2);
		}, FC = function(e) {
			var t = Le(), n = hr(e, t);
			n !== null && ol(n, e, t);
		}, IC = function(e) {
			u = e;
		}, LC = function(e) {
			c = e;
		};
		var RC = !0, zC = null, BC = !1, VC = null, HC = null, UC = null, WC = /* @__PURE__ */ new Map(), GC = /* @__PURE__ */ new Map(), KC = [], qC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" "), JC = null;
		if (Ef.prototype.render = Tf.prototype.render = function(e) {
			var t = this._internalRoot;
			if (t === null) throw Error("Cannot update an unmounted root.");
			var n = arguments;
			typeof n[1] == "function" ? console.error("does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : b(n[1]) ? console.error("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : n[1] !== void 0 && console.error("You passed a second argument to root.render(...) but it only accepts one argument."), n = e;
			var r = t.current;
			tf(r, il(r), n, t, null, null);
		}, Ef.prototype.unmount = Tf.prototype.unmount = function() {
			var e = arguments;
			if (typeof e[0] == "function" && console.error("does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."), e = this._internalRoot, e !== null) {
				this._internalRoot = null;
				var t = e.containerInfo;
				(Wb & (Fb | Ib)) !== Pb && console.error("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), tf(e.current, 2, null, e, null, null), dl(), t[Yp] = null;
			}
		}, Ef.prototype.unstable_scheduleHydration = function(e) {
			if (e) {
				var t = Je();
				e = {
					blockedOn: null,
					target: e,
					priority: t
				};
				for (var n = 0; n < KC.length && t !== 0 && t < KC[n].priority; n++);
				KC.splice(n, 0, e), n === 0 && _f(e);
			}
		}, (function() {
			var e = kf.version;
			if (e !== "19.2.8") throw Error("Incompatible React versions: The \"react\" and \"react-dom\" packages must have the exact same version. Instead got:\n  - react:      " + (e + "\n  - react-dom:  19.2.8\nLearn more: https://react.dev/warnings/version-mismatch"));
		})(), typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://react.dev/link/react-polyfills"), Yf.findDOMNode = function(e) {
			var t = e._reactInternals;
			if (t === void 0) throw typeof e.render == "function" ? Error("Unable to find node on an unmounted component.") : (e = Object.keys(e).join(","), Error("Argument appears to not be a ReactComponent. Keys: " + e));
			return e = re(t), e = e === null ? null : ie(e), e = e === null ? null : e.stateNode, e;
		}, !(function() {
			var e = {
				bundleType: 1,
				version: "19.2.8",
				rendererPackageName: "react-dom",
				currentDispatcherRef: B,
				reconcilerVersion: "19.2.8"
			};
			return e.overrideHookState = OC, e.overrideHookStateDeletePath = kC, e.overrideHookStateRenamePath = AC, e.overrideProps = jC, e.overridePropsDeletePath = MC, e.overridePropsRenamePath = NC, e.scheduleUpdate = PC, e.scheduleRetry = FC, e.setErrorHandler = IC, e.setSuspenseHandler = LC, e.scheduleRefresh = v, e.scheduleRoot = _, e.setRefreshHandler = y, e.getCurrentFiber = sf, Ae(e);
		})() && th && window.top === window.self && (-1 < navigator.userAgent.indexOf("Chrome") && navigator.userAgent.indexOf("Edge") === -1 || -1 < navigator.userAgent.indexOf("Firefox"))) {
			var YC = window.location.protocol;
			/^(https?|file):$/.test(YC) && console.info("%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools" + (YC === "file:" ? "\nYou might need to use a local HTTP server (instead of file://): https://react.dev/link/react-devtools-faq" : ""), "font-weight:bold");
		}
		e.createRoot = function(e, t) {
			if (!b(e)) throw Error("Target container is not a DOM element.");
			Df(e);
			var n = !1, r = "", i = as, a = os, o = ss;
			return t != null && (t.hydrate ? console.warn("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t && t.$$typeof === Mf && console.error("You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:\n\n  let root = createRoot(domContainer);\n  root.render(<App />);"), !0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (a = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = $d(e, 1, !1, null, null, n, r, null, i, a, o, wf), e[Yp] = t.current, du(e), new Tf(t);
		}, e.hydrateRoot = function(e, t, n) {
			if (!b(e)) throw Error("Target container is not a DOM element.");
			Df(e), t === void 0 && console.error("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
			var r = !1, i = "", a = as, o = os, s = ss, c = null;
			return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (a = n.onUncaughtError), n.onCaughtError !== void 0 && (o = n.onCaughtError), n.onRecoverableError !== void 0 && (s = n.onRecoverableError), n.formState !== void 0 && (c = n.formState)), t = $d(e, 1, !0, t, n ?? null, r, i, c, a, o, s, wf), t.context = ef(null), n = t.current, r = il(n), r = We(r), i = ra(r), i.callback = null, ia(n, i, r), fi(r, "hydrateRoot()", null), n = r, t.current.lanes = n, ze(t, n), P(t), e[Yp] = t.current, du(e), new Ef(t);
		}, e.version = "19.2.8", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), f = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
			if (process.env.NODE_ENV !== "production") throw Error("^_^");
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (e) {
				console.error(e);
			}
		}
	}
	process.env.NODE_ENV === "production" ? (n(), t.exports = u()) : t.exports = d();
})), p = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), m = /* @__PURE__ */ e(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === oe ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case b: return "Profiler";
				case y: return "StrictMode";
				case ne: return "Suspense";
				case re: return "SuspenseList";
				case S: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case ee: return e.displayName || "Context";
				case x: return (e._context.displayName || "Context") + ".Consumer";
				case te:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case ie: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case ae:
					n = e._payload, e = e._init;
					try {
						return t(e(n));
					} catch {}
			}
			return null;
		}
		function n(e) {
			return "" + e;
		}
		function r(e) {
			try {
				n(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var r = t.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return r.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", i), n(e);
			}
		}
		function i(e) {
			if (e === v) return "<>";
			if (typeof e == "object" && e && e.$$typeof === ae) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function a() {
			var e = C.A;
			return e === null ? null : e.getOwner();
		}
		function s() {
			return Error("react-stack-top-frame");
		}
		function c(e) {
			if (se.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function l(e, t) {
			function n() {
				le || (le = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function u() {
			var e = t(this.type);
			return ue[e] || (ue[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function d(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: g,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: u
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function f(e, n, i, o, s, u) {
			var f = n.children;
			if (f !== void 0) {
				if (o) {
					if (ce(f)) {
						for (o = 0; o < f.length; o++) p(f[o]);
						Object.freeze && Object.freeze(f);
					} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
				} else p(f);
			}
			if (se.call(n, "key")) {
				f = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", de[f + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, f, m, f), de[f + o] = !0);
			}
			if (f = null, i !== void 0 && (r(i), f = "" + i), c(n) && (r(n.key), f = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return f && l(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), d(e, f, i, a(), s, u);
		}
		function p(e) {
			m(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === ae && (e._payload.status === "fulfilled" ? m(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function m(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var h = o(), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), ee = Symbol.for("react.context"), te = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), re = Symbol.for("react.suspense_list"), ie = Symbol.for("react.memo"), ae = Symbol.for("react.lazy"), S = Symbol.for("react.activity"), oe = Symbol.for("react.client.reference"), C = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = Object.prototype.hasOwnProperty, ce = Array.isArray, w = console.createTask ? console.createTask : function() {
			return null;
		};
		h = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var le, ue = {}, T = h.react_stack_bottom_frame.bind(h, s)(), E = w(i(s)), de = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > C.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !1, r ? Error("react-stack-top-frame") : T, r ? w(i(e)) : E);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > C.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !0, r ? Error("react-stack-top-frame") : T, r ? w(i(e)) : E);
		};
	})();
})), h = /* @__PURE__ */ e(((e, t) => {
	t.exports = process.env.NODE_ENV === "production" ? p() : m();
})), g = f(), _ = h();
function v() {
	return /* @__PURE__ */ (0, _.jsx)("div", {
		style: {
			position: "fixed",
			top: "12px",
			right: "12px",
			zIndex: 1e4,
			padding: "12px 16px",
			color: "#fff",
			background: "#222",
			border: "1px solid #555",
			borderRadius: "6px"
		},
		children: "苍玄界插件已运行"
	});
}
//#endregion
//#region src/main.tsx
var y = "tavern-cangxuanjie-root", b = null, x = null;
$(() => {
	$(`#${y}`).remove(), x = $("<div>").attr("id", y).appendTo("body")[0], b = (0, g.createRoot)(x), b.render(/* @__PURE__ */ (0, _.jsx)(v, {})), toastr.success("苍玄界插件已加载");
}), $(window).on("pagehide", () => {
	b?.unmount(), x?.remove(), b = null, x = null;
});
//#endregion
