/// <reference path="../src/UserPresenceTracker.ts" />
/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/jasmine.d.ts" />
/// <reference path="typings/Q.d.ts" />
/// <reference path="dep/triggerEvent.ts" />
describe("UserPresneceTracker", function () {
    it("exists", function () {
        console.log("jQuery is " + (!!window.$ ? "present" : "absent"));
        expect(UserPresenceTracker).toBeDefined();
    });
    it("notifies of inactivity", function (done) {
        var callsConter = 0;
        var tracker = new UserPresenceTracker.Tracker(window, function () { callsConter++; }, null, 1000, window.$);
        Q.delay(200)
            .then(function () {
            expect(tracker.isUserPresent).toBe(true);
            expect(callsConter).toBe(0);
        })
            .delay(1500)
            .then(function () {
            expect(tracker.isUserPresent).toBe(false);
            expect(callsConter).toBe(1);
        })
            .delay(1500)
            .then(function () {
            expect(tracker.isUserPresent).toBe(false);
            expect(callsConter).toBe(1);
        })
            .finally(done);
    });
    it("notifies of activity resume", function (done) {
        var currentState = false;
        var tracker = new UserPresenceTracker.Tracker(window, function () { currentState = true; }, function () { currentState = false; }, 200, window.$);
        Q.delay(300)
            .then(function () {
            expect(tracker.isUserPresent).toBe(false);
            expect(currentState).toBe(true);
        })
            .then(function () { return window.triggerEvent("click"); })
            .delay(100)
            .then(function () {
            expect(tracker.isUserPresent).toBe(true);
            expect(currentState).toBe(false);
        })
            .finally(done);
    });
    it("tracks all events", function (done) {
        var currentState = false;
        var tracker = new UserPresenceTracker.Tracker(window, function () { currentState = true; }, function () { currentState = false; }, 200, window.$);
        var promise = Q.delay(300)
            .then(function () {
            expect(tracker.isUserPresent).toBe(false);
            expect(currentState).toBe(true);
        });
        UserPresenceTracker.Tracker.eventNames.split(" ").forEach(function (name) {
            promise = promise.then(function () { return window.triggerEvent(name); })
                .delay(100)
                .then(function () {
                expect(tracker.isUserPresent).toBe(true);
                expect(currentState).toBe(false);
            })
                .delay(300)
                .then(function () {
                expect(tracker.isUserPresent).toBe(false);
                expect(currentState).toBe(true);
            });
        });
        promise.finally(done);
    });
    it("does not notify inactivity while user is active", function (done) {
        var callsConter = 0;
        var tracker = new UserPresenceTracker.Tracker(window, function () { callsConter++; }, null, 1000, window.$);
        var promise = Q.when(true);
        var count = 20;
        while (count-- > 0) {
            promise = promise
                .delay(100)
                .then(function () {
                expect(tracker.isUserPresent).toBe(true);
                expect(callsConter).toBe(0);
            })
                .then(function () { return window.triggerEvent("click"); });
        }
        promise
            .delay(1500)
            .then(function () {
            expect(tracker.isUserPresent).toBe(false);
            expect(callsConter).toBe(1);
        })
            .finally(done);
    });
    it("can be destroyed", function (done) {
        var callsConter = 0;
        var tracker = new UserPresenceTracker.Tracker(window, function () { callsConter++; }, null, 500, window.$);
        Q.delay(100)
            .then(function () {
            expect(tracker.isDestroyed).toBe(false);
            expect(tracker.isUserPresent).toBe(true);
            expect(callsConter).toBe(0);
        })
            .then(function () { return tracker.destroy(); })
            .delay(1000)
            .then(function () {
            expect(tracker.isDestroyed).toBe(true);
            expect(tracker.isUserPresent).toBe(true);
            expect(callsConter).toBe(0);
        })
            .delay(1000)
            .then(function () {
            expect(tracker.isUserPresent).toBe(true);
            expect(callsConter).toBe(0);
        })
            .finally(done);
    });
    it("activity can be simulated programatically", function (done) {
        var callsConter = 0;
        var tracker = new UserPresenceTracker.Tracker(window, function () { callsConter++; }, null, 500, window.$);
        Q.delay(100)
            .then(function () {
            expect(tracker.isUserPresent).toBe(true);
            expect(callsConter).toBe(0);
        })
            .then(function () { return tracker.triggerActivity(); })
            .delay(300)
            .then(function () { return tracker.triggerActivity(); })
            .delay(300)
            .then(function () { return tracker.triggerActivity(); })
            .delay(300)
            .then(function () { return tracker.triggerActivity(); })
            .delay(300)
            .then(function () {
            expect(tracker.isUserPresent).toBe(true);
            expect(callsConter).toBe(0);
        })
            .delay(1000)
            .then(function () {
            expect(tracker.isUserPresent).toBe(false);
            expect(callsConter).toBe(1);
        })
            .finally(done);
    });
    it("several trackers can work independently", function (done) {
        var callsConter1 = 0;
        var tracker1 = new UserPresenceTracker.Tracker(window, function () { callsConter1++; }, null, 200, window.$);
        var callsConter2 = 0;
        var tracker2 = new UserPresenceTracker.Tracker(window, function () { callsConter2++; }, null, 1000, window.$);
        Q.delay(500)
            .then(function () {
            expect(tracker1.isUserPresent).toBe(false);
            expect(callsConter1).toBe(1);
            expect(tracker2.isUserPresent).toBe(true);
            expect(callsConter2).toBe(0);
        })
            .then(function () { return tracker1.triggerActivity(); })
            .delay(50)
            .then(function () { return tracker1.destroy(); })
            .delay(2000)
            .then(function () {
            expect(callsConter1).toBe(1);
            expect(tracker2.isUserPresent).toBe(false);
            expect(callsConter2).toBe(1);
        })
            .finally(done);
    });
});
//# sourceMappingURL=UserPresenceTracker.unit.js.map