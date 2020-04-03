const http = require('axios');
const logger = require('../logger');
const chalk = require('chalk');

module.exports = class Url {
    constructor(results, url) {
        this.results = results;
        this.url = url;
    }

    run(cb) {
        this.cb = cb;
        const msg = chalk.grey(this.url) + ' ';
        http
            .head(this.url)
            .then(response => {
                if (response.status == 200) {
                    // success
                    logger.debug(msg + chalk.green('OK'));
                    this.flush(true, 200);
                } else {
                    // error
                    logger.debug(msg + chalk.red(response.statusText));
                    this.flush(false, response.status, response.statusText);
                }
            })
            .catch(error => {
                // error
                logger.debug(msg + chalk.red(error));

                this.flush(false, 404, error);
            });

    }

    flush(success, type, msg) {
        msg = this.url + (msg ? ' ' + msg : '');
        this.results.log(success, 'url_' + type, msg);

        this.cb(success);
        this.results = null;
    }
}
