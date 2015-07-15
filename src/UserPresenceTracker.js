/// <reference path="typings/jquery.d.ts" />
var UserPresenceTracker;
(function (UserPresenceTracker) {
    function noop() { }
    ;
    var Tracker = (function () {
        function Tracker(window, onInactive, onActivityResume, timeoutMs, jQuery) {
            var _this = this;
            this._timeoutMs = 10 * 60 * 1000;
            this._lastActivityDate = new Date();
            this._isUserPresent = true;
            this._isDestroyed = false;
            this.onInactive = function () {
                _this._isUserPresent = false;
                _this.lastTimeoutId = null;
                (_this.onInactiveCallback || noop)();
            };
            this.onActivityResume = function () {
                _this._isUserPresent = true;
                (_this.onActivityResumeCallback || noop)();
            };
            this.onAnyActivity = function () {
                _this._lastActivityDate = new Date();
                if (_this.lastTimeoutId) {
                    _this.window.clearTimeout(_this.lastTimeoutId);
                }
                _this.lastTimeoutId = _this.window.setTimeout(_this.onInactive, _this._timeoutMs);
                if (!_this._isUserPresent) {
                    _this.onActivityResume();
                }
            };
            this.onInactiveCallback = onInactive;
            this.onActivityResumeCallback = onActivityResume;
            this._timeoutMs = timeoutMs || this._timeoutMs;
            this.window = window;
            this.$ = jQuery;
            this.onAnyActivity();
            this.addEventListener(Tracker.eventNames, this.onAnyActivity);
        }
        Object.defineProperty(Tracker.prototype, "timeoutMs", {
            get: function () { return this._timeoutMs; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tracker.prototype, "lastActivityDate", {
            get: function () { return this._lastActivityDate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tracker.prototype, "isUserPresent", {
            get: function () { return this._isUserPresent; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tracker.prototype, "isDestroyed", {
            get: function () { return this._isDestroyed; },
            enumerable: true,
            configurable: true
        });
        Tracker.prototype.triggerActivity = function () {
            this.onAnyActivity();
        };
        Tracker.prototype.destroy = function () {
            if (this.lastTimeoutId) {
                this.window.clearTimeout(this.lastTimeoutId);
            }
            this.removeEventListener(Tracker.eventNames, this.onAnyActivity);
            this._isDestroyed = true;
        };
        Tracker.prototype.addEventListener = function (events, clbck) {
            if (this.$) {
                this.$(this.window).on(events, clbck);
                return;
            }
            var keys = events.split(" ");
            keys.forEach(function (key) { return window.addEventListener(key, clbck); });
        };
        Tracker.prototype.removeEventListener = function (events, clbck) {
            if (this.$) {
                this.$(this.window).off(events, clbck);
                return;
            }
            var keys = events.split(" ");
            keys.forEach(function (key) {
                window.removeEventListener(key, clbck);
            });
        };
        Tracker.eventNames = "click mousemove keydown mousedown touchstart";
        return Tracker;
    })();
    UserPresenceTracker.Tracker = Tracker;
})(UserPresenceTracker || (UserPresenceTracker = {}));
//# sourceMappingURL=UserPresenceTracker.js.map