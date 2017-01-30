export default class queue {
    constructor() {
        this.queueing = [];
    }

    queued(action, context) {
        let that = this;
        return function () {
            var self = this
            var args = arguments

            that.queue(function (next) {
                action.apply(context, Array.prototype.concat.apply(next, args))
            })
        }
    }

    queue(action) {
        let self = this;
        if (!action) {
            return
        }

        self.queueing.push(action)

        if (self.queueing.length === 1) {
            self.next()
        }
    }

    next() {
        let self = this;
        self.queueing[0](function (err) {
            if (err) {
                throw err
            }

            self.queueing = self.queueing.slice(1)

            if (self.queueing.length) {
                self.next()
            }
        })
    }
}
