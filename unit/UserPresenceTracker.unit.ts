/// <reference path="../src/UserPresenceTracker.ts" />
/// <reference path="tpyings/jasmine.d.ts" />

describe("UserPresneceTracker", function () {

    var tracker = UserPresenceTracker.UserPresenceTracker;
    

    //beforeEach(function () {
    //    var userPresenceTracker = //(<any>window).UserPresenceTracker.UserPresenceTracker;
    //        UserPresenceTracker.UserPresenceTracker;
    //    (<any>UserPresenceTracker).timeoutMs = 1;
    //});

    it("exists", function () {
        expect(UserPresenceTracker).toBeDefined();
    });

    it("notifys of inactivity", function (done) {
        var hasBeenCalled = false;
        var _tracker = new tracker(window, () => hasBeenCalled = true,null,1000);

        setTimeout(() => {
            expect(hasBeenCalled).toBe(true);
            done();
        }, 1500);
    });

});