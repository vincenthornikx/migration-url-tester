const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

module.exports = class Results {

    static results = [];

    static flush() {
        Results.results.map(result => result.write());
    }

    constructor(profile) {
        this.profile = profile;
        this.path = path.normalize(process.cwd() + '/results/');
        if (fs.existsSync(this.path)) {
            rimraf.sync(this.path);
        }

        this.logs = {};
        this.successes = 0;
        this.failures = 0;

        Results.results.push(this);
    }

    log(success, type, msg) {
        if (!this.logs[type]) {
            this.logs[type] = [];
        }

        if (success) {
            this.successes++;
        } else {
            this.failures++;
        }

        this.logs[type].push(msg);
    }

    write() {
        const logPath = path.normalize(process.cwd() + '/results/' + this.profile + '/');

        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath, { recursive: true });
        }

        const summary = [
            'Success: ' + this.successes,
            'Failed: ' + this.failures,
            ''
        ];

        Object.keys(this.logs).map(key => {
            const logFile = logPath + key + '.log';

            fs.writeFileSync(logFile, this.logs[key].join("\n"), 'utf-8');
            summary.push(key + ': ' + this.logs[key].length);
        });

        const summaryPath = logPath + 'summary.log';
        fs.writeFileSync(summaryPath, summary.join("\n"), 'utf-8');
    }
}
