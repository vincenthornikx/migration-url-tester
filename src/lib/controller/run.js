const yargs = require('yargs');
const config = require('../config');
const Runner = require('../test/runner');
const options = require('../options');

module.exports = new class Controller {
    constructor() {
        this.setup();
    }

    setup() {
        yargs.command('run', 'Run tests', () => {}, this.run);
    }

    run() {
        const runner = new Runner(options.concurrency);
        const selectedProfile = options.profile;

        config.getProfiles().map(profile => {
            if (!selectedProfile || selectedProfile == profile.name) {
                profile.test(runner);
            }
        });
    }
}
