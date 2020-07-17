const Urls = require('./urls');
const Rewrites = require('./rewrites');

const Runner = require('../test/runner');
const Url = require('../test/url');
const Rewrite = require('../test/rewrite');

const Results = require('./results');
const options = require('../options');
const logger = require('../logger');

module.exports = class Profile {
    constructor({name, enabled, baseUrl, testUrl, urls, rewrites}) {
        // debug
        //sitemaps = [];

        this.name = name;
        this.enabled = enabled;
        this.baseUrl = baseUrl;
        this.testUrl = testUrl;
        this.urls = urls ? urls.map(urlConfig => new Urls(urlConfig)) : [];
        this.rewrites = rewrites ? rewrites.map(rewriteConfig => new Rewrites(rewriteConfig)) : [];
    }

    test(runner) {
        if (!this.enabled) {
            return;
        }

        const results = new Results(this.name);

        this.urls.map(urls => {
            urls
                .fetch()
                .then(list => {
                    if (options.dryRun) {
                        logger.notice('Will test ' + list.length + ' urls from list ' + urls.url);
                    } else {
                        list.map(url => {
                            runner.push(new Url(results, url, url.replace(this.baseUrl, this.testUrl)));
                        });
                    }
                });
        });

        this.rewrites.map(rewrite => {
            rewrite
                .fetch()
                .then(rows => {
                    if (options.dryRun) {
                        logger.notice('Will test ' + rows.length + ' rewrites from ' + rewrite.url);
                    } else {
                        rows.map(row => {
                             runner.push(new Rewrite(results, this.baseUrl, this.testUrl, row[0], row[1]));
                        });
                    }
                });
        })
    }
}
