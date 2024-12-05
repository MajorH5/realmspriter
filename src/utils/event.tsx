// class for basic event emitter
// Original source: https://github.com/MajorH5/PhysicsJS2D/blob/main/src/event.js

export default class Event {
    private handlers: ((...args: any[]) => void)[];

    constructor() {
        this.handlers = [];
    }

    listen(handler: (...args: any[]) => void) {
        // binds a handler to the event
        if (this.handlers.includes(handler)) {
            return;
        }

        this.handlers.push(handler);
    }

    listenOnce(handler: (...args: any[]) => void) {
        // binds a handler to the event that will only
        // be called once
        const onceHandler = (...data: any[]) => {
            this.unlisten(onceHandler);
            handler(...data);
        };

        this.listen(onceHandler);
    }

    unlisten(handler: (...args: any[]) => void) {
        // unbinds a handler from the event
        const index = this.handlers.indexOf(handler);

        if (index !== -1) {
            this.handlers.splice(index, 1);
        }
    }

    trigger(...data: any[]) {
        // fires the event and calls all listening handlers
        // with the given data
        for (let i = 0; i < this.handlers.length; i++) {
            try {
                this.handlers[i](...data);
            } catch (e) {
                console.error(e);
            }
        }
    }

    // clears all handlers from the event
    clear() {
        this.handlers = [];
    }
}
