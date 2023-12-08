//% weight=100 color=#ab9e26 icon="\uf0a1" block="Events"
//% groups='["Senders", "Handlers"]'
namespace events {
    class Event {
        _name: string
        _time: number
        _fired: boolean

        constructor(name: string) {
            this._name = name
            this._time = 0
            this._fired = false
        }

        public update(time: number): boolean {
            if (!this._fired)
            {
                if (time >= this._time) {
                    this._fired = true
                    return true
                }
            }
            return false
        }

        public getName(): string { return this._name }

        public setTime(time: number) {
            this._time = time
            this._fired = false
        }

        public cancel() {
            this._fired = true
        }
    }

    class Handler {
        _name: string
        _callback: () => void

        constructor(name: string, callback: () => void) {
            this._name = name
            this._callback = callback
        }

        public call() {
            if (this._callback) {
                this._callback()
            }
        }

        public getName(): string { return this._name }
    }

    class EventManager {
        _events: Event[]
        _handlers: Handler[]
        _time: number

        constructor() {
            this._events = []
            this._handlers = []
            this._time = game.runtime()
        }

        public init() {
            game.onUpdate(function () {
                getEventManager().update()
            })
        }

        private update() {
            this._time = game.runtime()

            // Update all events
            this._events.forEach(e => {
                if (e.update(this._time)) {
                    // Event fired, call all handlers
                    this._handlers.forEach(h => {
                        if (e.getName() == h.getName()) {
                            h.call()
                        }
                    })
                }
            })
        }

        public createHandler(name: string, callback: () => void) {
            const h = new Handler(name, callback)
            this._handlers.push(h)
        }

        public createEvent(name: string): Event {
            // Check for existing event with this name
            const found = this._events.find(e => e._name == name)
            if (found) {
                return found
            }

            // Create new event
            const e = new Event(name)
            this._events.push(e)
            return e
        }
    }

    function getEventManager(): EventManager {
        let em = game.currentScene().data.eventManager
        if (!em) {
            em = new EventManager()
            em.init()
            game.currentScene().data.eventManager = em
        }
        return em
    }

    //% blockId=events_on_event
    //% group="Handlers"
    //% block="on event $name"
    export function onEvent(name: string, callback: () => void) {
        const em = getEventManager()
        em.createHandler(name, callback)
    }

    //% blockId=events_send_event
    //% group="Senders"
    //% block="send event $name in $delay seconds"
    export function sendEvent(name: string, delay: number = 0) {
        const em = getEventManager()
        const e = em.createEvent(name)
        e.setTime(em._time + 1000 * delay)
    }

    //% blockId=events_cancel_event
    //% group="Senders"
    //% block="cancel event $name"
    export function cancelEvent(name: string) {
        const em = getEventManager()
        const e = em.createEvent(name)
        e.cancel()
    }
}
