const http = require('axios');
const logger = require('../logger');
const chalk = require('chalk');

module.exports = class Url {
    constructor(results, url, testUrl) {
        this.results = results;
        this.url = url;
        this.testUrl = testUrl;
    }

    get msg() {
        return chalk.grey(this.testUrl) + ' ';
    }

    run(cb) {
        this.cb = cb;
        this.testNewUrl();
    }

    testNewUrl() {
        http
            .head(this.testUrl)
            .then(response => {
                if (response.status == 200) {
                    logger.debug(this.msg + chalk.green('OK'));
                    this.flush(true, 200);
                } else {
                    logger.debug(this.msg + chalk.yellow(response.status + ', Testing origin system'));
                    this.testOriginUrl(response.status);
                }
            })
            .catch(() => {
                logger.debug(this.msg + chalk.yellow('404, Testing origin system'));
                this.testOriginUrl(404);
            });
    }

    testOriginUrl(newUrlStatusCode) {
        http
            .head(this.url)
            .then(response => {
                if (response.status == newUrlStatusCode) {
                    logger.debug(this.msg + chalk.yellow(newUrlStatusCode + ' but the same on both systems'));
                    this.flush(true, 700);
                } else {
                    logger.debug(this.msg + chalk.red(newUrlStatusCode + ' and origin says ' + response.status));
                    this.flush(false, newUrlStatusCode);
                }
            })
            .catch(() => {
                logger.debug(this.msg + chalk.green('errors but the origin system also has errors'));
                this.flush(true, 600);
            });
    }

    flush(success, type, msg) {
        msg = this.testUrl + (msg ? ' ' + msg : '');
        this.results.log(success, 'url_' + type, msg);

        this.cb(success);
        this.results = null;
    }
}
