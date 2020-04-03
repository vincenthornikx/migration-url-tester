const chalk = require('chalk');
const minimist = require('minimist');

module.exports = new class Logger {
    static DEBUG = 0;
    static NOTICE = 1;
    static WARN = 2;
    static ERROR = 3;

    constructor() {
        this.setup();
    }

    setup() {
        if (process.argv.indexOf('-vvv') > -1) {
            this.verbosity = Logger.DEBUG;
        } else if (process.argv.indexOf('-vv') > -1) {
            this.verbosity = Logger.NOTICE;
        } else if (process.argv.indexOf('-v') > -1) {
            this.verbosity = Logger.WARN;
        } else {
            this.verbosity = Logger.ERROR;
        }
    }

    log(msg, verbosity) {
        verbosity >= this.verbosity && console.log(msg);
    }

    error(msg) {
        this.log(chalk.red(msg), Logger.ERROR);
    }

    warn(msg) {
        this.log(chalk.orange(msg), Logger.WARN);
    }

    notice(msg) {
        this.log(chalk.yellow(msg), Logger.NOTICE);
    }

    debug(msg) {
        this.log(chalk.grey(msg), Logger.DEBUG);
    }
}
