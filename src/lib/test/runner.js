const options = require('../options');
const logger = require('../logger');

module.exports = class TestRunner {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];

        this.failures = 0;
        this.successes = 0;
    }

    push(task) {
        this.queue.push(task);
        this.next();
    }

    next() {
        while(this.running < this.concurrency && this.queue.length) {
            const task = this.queue.shift();
            task.run(success => {
                this.running--;
                this.next();

                if (success) {
                    this.successes++;
                } else {
                    this.failures++;
                    if (options.maxFailures > -1 && this.failures >= options.maxFailures) {
                        logger.error('Max failures reached');
                        process.exit();
                    }
                }
                if (options.maxTests > -1 && (this.successes + this.failures) > options.maxTests) {
                    logger.notice('Max tests reached');
                    process.exit();
                }
            });
            this.running++;
        }
    }
}
