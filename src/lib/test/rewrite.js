const chalk = require('chalk');
const http = require('axios');
const logger = require('../logger');

module.exports = class Rewrite {
    constructor(results, baseUrl, testBaseUrl, fromPath, toPath) {
        if (baseUrl.substring(baseUrl.length -1) === '/') {
            baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }

        if (testBaseUrl.substring(testBaseUrl.length -1) === '/') {
            testBaseUrl = testBaseUrl.substring(0, testBaseUrl.length - 1);
        }

        if (fromPath.substring(0, 1) !== '/') {
            fromPath = '/' + fromPath;
        }

        if (toPath.substring(0, 1) !== '/') {
            toPath = '/' + toPath;
        }

        this.results = results;
        this.baseUrl = baseUrl;
        this.testBaseUrl = testBaseUrl;
        this.fromPath = fromPath;
        this.toPath = toPath;
    }

    run(cb) {
        this.cb = cb;

        const url = this.testBaseUrl + this.fromPath;
        http
            .head(url)
            .then(response => {
                this.checkResponse(response);
            })
            .catch(error => {
                this.checkResponse(error);
            });
    }

    checkResponse(response) {
        const redirectedUrl = (response.request && response.request._redirectable) ? response.request._redirectable._currentUrl : '__NONE__';
        const redirectPath = redirectedUrl.replace(this.testBaseUrl, '');
        const msg = 'Rewrite result: ' + chalk.grey(this.fromPath) + ' -> ' + chalk.grey(this.toPath) + ' ';
        if (redirectPath == this.toPath) {
            logger.debug(msg + chalk.green('OK'));
            this.flush(true, 'ok');
        } else {
            logger.debug(msg + chalk.yellow('Received: ' + redirectPath));
            this.checkOrigin(redirectPath);
            // logger.debug(msg + chalk.red('FAIL'));
            // this.flush(false);
        }
    }

    checkOrigin(newRedirectPath) {
        const url = this.baseUrl + this.fromPath;
        http
            .head(url)
            .then(response => {
                this.checkOriginResponse(response, newRedirectPath);
            })
            .catch(error => {
                this.checkOriginResponse(error, newRedirectPath);
            });
    }

    checkOriginResponse(response, newRedirectPath) {
        const redirectedUrl = (response.request && response.request._redirectable) ? response.request._redirectable._currentUrl : '__NONE__';
        const redirectPath = redirectedUrl.replace(this.baseUrl, '');
        const msg = 'Rewrite result: ' + chalk.yellow(this.fromPath) + ' -> ' + chalk.yellow(this.toPath) + ' ';
        if (redirectPath == this.toPath) {
            logger.debug(msg + chalk.red('Origin redirect is working'));
            this.flush(false, 'error');
        } else if (redirectPath == newRedirectPath) {
            logger.debug(msg + chalk.green('Origin redirects to the same page'));
            this.flush(true, 700);
        } else {
            logger.debug(msg + chalk.yellow('Origin redirect also doesn\'t work'));
            this.flush(true, 600);
        }
    }

    get name() {
        return this.fromPath + ' -> ' + this.toPath;
    }

    flush(success, code) {
        this.results.log(success, 'rewrite_' + code, this.name);

        this.cb(success);

        this.cb = false;
        this.results = false;
    }
}
