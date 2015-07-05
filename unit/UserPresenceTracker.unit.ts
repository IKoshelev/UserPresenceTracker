/// <reference path="../src/UserPresenceTracker.ts" />
/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/jasmine.d.ts" />
/// <reference path="typings/Q.d.ts" />
/// <reference path="dep/triggerEvent.ts" />

describe("UserPresneceTracker", function () {

    it("exists", function () {
        console.log("jQuery is " + (!!(<any>window).$ ? "present" : "absent")); 
        expect(UserPresenceTracker).toBeDefined();
    });

    it("notifies of inactivity", function (done) {
        var callsConter = 0;
        var tracker = new UserPresenceTracker.Tracker(window, () => { callsConter++},null,1000,(<any>window).$);
        

        Q   .delay(200)
            .then(() => {
                expect(tracker.isUserPresent).toBe(true);
                expect(callsConter).toBe(0);
            })
            .delay(1500)
            .then(() => {
                expect(tracker.isUserPresent).toBe(false);
                expect(callsConter).toBe(1);
            })
            .delay(1500)
            .then(() => {
                expect(tracker.isUserPresent).toBe(false);
                expect(callsConter).toBe(1);
            })
            .finally(done); 
    });

    it("notifies of activity resume", function (done) {
        var currentState = false;
        var tracker = new UserPresenceTracker.Tracker(
            window,
            () => { currentState = true },
            () => { currentState = false },
            200, (<any>window).$);

        Q.delay(300)
            .then(() => {
            expect(tracker.isUserPresent).toBe(false);
            expect(currentState).toBe(true);
        })
            .then(() => window.triggerEvent("click"))
            .delay(100)
            .then(() => {
            expect(tracker.isUserPresent).toBe(true);
            expect(currentState).toBe(false);
        })
            .finally(done); 
    });

    it("tracks all events", function (done) {
        var currentState = false;
        var tracker = new UserPresenceTracker.Tracker(
            window,
            () => { currentState = true },
            () => { currentState = false },
            200, (<any>window).$);

        var promise = Q.delay(300)
            .then(() => {
                expect(tracker.isUserPresent).toBe(false);
                expect(currentState).toBe(true);
            });

        UserPresenceTracker.Tracker.eventNames.split(" ").forEach((name) => {

            promise = promise.then(() => window.triggerEvent(name))
                .delay(100)
                .then(() => {
                    expect(tracker.isUserPresent).toBe(true);
                    expect(currentState).toBe(false);
                })
                .delay(300)
                .then(() => {
                    expect(tracker.isUserPresent).toBe(false);
                    expect(currentState).toBe(true);
            })

        });

        promise .finally(done);
    });

    it("does not notify inactivity while user is active", function (done) {
        var callsConter = 0;
        var tracker = new UserPresenceTracker.Tracker(window, () => { callsConter++ }, null, 1000, (<any>window).$);

        var promise = Q.when(true);

        var count = 20;
        while (count-- > 0) {
            promise = promise
                .delay(100)
                .then(() => {
                    expect(tracker.isUserPresent).toBe(true);
                    expect(callsConter).toBe(0);
                })
                .then(() => window.triggerEvent("click"));   
         }

        promise
            .delay(1500)
            .then(() => {
                expect(tracker.isUserPresent).toBe(false);
                expect(callsConter).toBe(1);
            })
            .finally(done);
    });

    it("can be destroyed", function (done) {

            var callsConter = 0;
            var tracker = new UserPresenceTracker.Tracker(window, () => { callsConter++; console.log("inactive"); }, null, 500, (<any>window).$);
         
            Q.delay(100)
                .then(() => {
                    expect(tracker.isUserPresent).toBe(true);
                    expect(callsConter).toBe(0);
                })
                .then(() => tracker.destroy())
                .delay(1000)
                .then(() => {
                    expect(tracker.isUserPresent).toBe(true);
                    expect(callsConter).toBe(0);
                })
                .delay(1000)
                .then(() => {
                    expect(tracker.isUserPresent).toBe(true);
                    expect(callsConter).toBe(0);
                })
                .finally(done);
        });
});