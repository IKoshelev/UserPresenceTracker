window.triggerEvent = function (name) {
    var event; // The custom event that will be created
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(name, true, true);
    }
    else {
        event = document.createEventObject();
        event.eventType = name;
    }
    event.eventName = name;
    if (document.createEvent) {
        document.dispatchEvent(event);
    }
    else {
        document.fireEvent("on" + event.eventType, event);
    }
};
//# sourceMappingURL=triggerEvent.js.map