/// <reference path="typings/jquery.d.ts" />

module UserPresenceTracker {

    function noop() { };

    export class Tracker{

        public static eventNames = "click mousemove keydown mousedown touchstart";

        private _timeoutMs: number = 10 * 60 * 1000;
        public get timeoutMs(){return this._timeoutMs;}
        private _lastActivityDate = new Date();
        public get lastActivityDate() { return this._lastActivityDate; }
        private _isUserPresent = true;
        public get isUserPresent() { return this._isUserPresent; }
        private _isDestroyed = false;
        public get isDestroyed() { return this._isDestroyed; }

        public triggerActivity() {
            this.onAnyActivity();
        }
         
        public destroy(){
            if (this.lastTimeoutId) {
                this.window.clearTimeout(this.lastTimeoutId);
            }
            this.removeEventListener(Tracker.eventNames, this.onAnyActivity);
            this._isDestroyed = true;
        }

        private window: Window;
        private $: JQueryStatic;

        private addEventListener(events: string, clbck: () => void) {
            if (this.$) {
                this.$(this.window).on(events, clbck);
                return;
            }
            var keys = events.split(" ");
            keys.forEach((key) => window.addEventListener(key, clbck));
        }

        private removeEventListener(events: string, clbck: () => void) {
            if (this.$) {
                this.$(this.window).off(events, clbck);
                return;
            }

            var keys = events.split(" ");
            keys.forEach((key) => {
                window.removeEventListener(key, clbck);
            });
        }

        private lastTimeoutId: number;
        private onInactiveCallback: () => void;
        private onActivityResumeCallback: () => void;

        private onInactive = () => {
            this._isUserPresent = false;
            this.lastTimeoutId = null;
            (this.onInactiveCallback || noop)();

        }

        private onActivityResume = () => {
            this._isUserPresent = true;
            (this.onActivityResumeCallback || noop)();
        }

        private onAnyActivity = () => {

            this._lastActivityDate = new Date();

            if (this.lastTimeoutId) {
                this.window.clearTimeout(this.lastTimeoutId);
            }

            this.lastTimeoutId = this.window.setTimeout(this.onInactive, this._timeoutMs);

            if (!this._isUserPresent) {
                this.onActivityResume(); 
            }
        }; 

        constructor(window: Window,
                    onInactive?: () => void,
                    onActivityResume?: () => void,
                    timeoutMs?: number,
                    jQuery?: JQueryStatic
            ) {
            this.onInactiveCallback = onInactive;
            this.onActivityResumeCallback = onActivityResume;
            this._timeoutMs = timeoutMs || this._timeoutMs;
            this.window = window;
            this.$ = jQuery;

            this.onAnyActivity();

            this.addEventListener(Tracker.eventNames, this.onAnyActivity);

        }
    }
}
