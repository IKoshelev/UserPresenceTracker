/// <reference path="typings/jquery.d.ts" />
var UserPresenceTracker;
(function (UserPresenceTracker_1) {
    function noop() { }
    ;
    var UserPresenceTracker = (function () {
        function UserPresenceTracker(window, onInactive, onActivityResume, timeoutMs, jQuery) {
            var _this = this;
            this.timeoutMs = 10 * 60 * 1000;
            this.lastActivityDate = new Date();
            this.isActive = true;
            this.destroy = function () {
                _this.removeEventListener(UserPresenceTracker.eventNames, _this.onAnyActivity);
            };
            this.onInactive = function () {
                _this.isActive = false;
                _this.lastTimeoutId = null;
                (_this.onInactiveCallback || noop)();
            };
            this.onActivityResume = function () {
                _this.isActive = true;
                (_this.onActivityResumeCallback || noop)();
            };
            this.onAnyActivity = function () {
                _this.lastActivityDate = new Date();
                if (_this.lastTimeoutId) {
                    _this.window.clearTimeout(_this.lastTimeoutId);
                }
                _this.lastTimeoutId = _this.window.setTimeout(_this.onInactive, _this.timeoutMs);
                if (!_this.isActive) {
                    _this.onActivityResume();
                }
            };
            this.onInactiveCallback = onInactive;
            this.onActivityResumeCallback = onActivityResume;
            this.timeoutMs = timeoutMs;
            this.window = window;
            this.$ = jQuery;
            this.onAnyActivity();
            this.addEventListener(UserPresenceTracker.eventNames, this.onAnyActivity);
        }
        UserPresenceTracker.prototype.addEventListener = function (events, clbck) {
            if (this.$) {
                this.$(this.window).on(events, clbck);
                return;
            }
            var keys = events.split(" ");
            keys.forEach(function (key) { return window.addEventListener(key, clbck); });
        };
        UserPresenceTracker.prototype.removeEventListener = function (events, clbck) {
            if (this.$) {
                this.$(this.window).off(events, clbck);
                return;
            }
            var keys = events.split(" ");
            keys.forEach(function (key) { return window.removeEventListener(key, clbck); });
        };
        UserPresenceTracker.eventNames = "click mousemove keydown mousedown touchstart";
        return UserPresenceTracker;
    })();
    UserPresenceTracker_1.UserPresenceTracker = UserPresenceTracker;
})(UserPresenceTracker || (UserPresenceTracker = {}));
//# sourceMappingURL=UserPresenceTracker.js.map