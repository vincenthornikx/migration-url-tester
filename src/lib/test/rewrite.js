const chalk = require('chalk');
const http = require('axios');
const logger = require('../logger');

module.exports = class Rewrite {
    constructor(results, baseUrl, fromPath, toPath) {
        if (baseUrl.substring(baseUrl.length -1) === '/') {
            baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }

        if (fromPath.substring(0, 1) !== '/') {
            fromPath = '/' + fromPath;
        }

        if (toPath.substring(0, 1) !== '/') {
            toPath = '/' + toPath;
        }

        this.results = results;
        this.baseUrl = baseUrl;
        this.fromPath = fromPath;
        this.toPath = toPath;
    }

    run(cb) {
        this.cb = cb;
        const url = this.baseUrl + this.fromPath;
        const msg = 'Rewrite result: ' + chalk.yellow(this.fromPath) + ' -> ' + chalk.yellow(this.toPath) + ' ';
        http
            .head(url)
            .then(response => {
                if (response.request._redirectable._isRedirect) {
                    const redirectedUrl = response.request._redirectable._currentUrl;
                    const redirectPath = redirectedUrl.replace(this.baseUrl, '');

                    if (redirectPath == this.toPath) {
                        logger.debug(msg + chalk.green('OK'));
                        this.flush(true);
                        return;
                    }
                }
                logger.debug(msg + chalk.red('FAIL'));
                this.flush(false)
            })
            .catch(error => {
                logger.debug(msg + chalk.red(error));
                this.flush(false);
            })
    }

    get name() {
        return this.fromPath + ' -> ' + this.toPath;
    }

    flush(success) {
        if (success) {
            this.results.log(success, 'rewrite_ok', this.name);
        } else {
            this.results.log(success, 'rewrite_failed', this.name);
        }

        this.cb(success);

        this.cb = false;
        this.results = false;
    }
}
