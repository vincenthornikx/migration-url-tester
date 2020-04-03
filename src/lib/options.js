const args = require('minimist')([,,...process.argv]);

module.exports = new class Options {
    constructor() {
        this.concurrency = args['concurrency'] || 10;
        this.maxFailures = Math.max(args['max-failures'], this.concurrency) || -1;
    }
}

