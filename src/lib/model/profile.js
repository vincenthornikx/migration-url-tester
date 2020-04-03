const Urls = require('./urls');
const Rewrites = require('./rewrites');

const Runner = require('../test/runner');
const Url = require('../test/url');
const Rewrite = require('../test/rewrite');

const Results = require('./results');

module.exports = class Profile {
    constructor({name, baseUrl, testUrl, urls, rewrites}) {
        // debug
        //sitemaps = [];

        this.name = name;
        this.baseUrl = baseUrl;
        this.testUrl = testUrl;
        this.urls = urls ? urls.map(urlConfig => new Urls(urlConfig)) : [];
        this.rewrites = rewrites ? rewrites.map(rewriteConfig => new Rewrites(rewriteConfig)) : [];
    }

    test(runner) {
        const results = new Results(this.name);

        this.urls.map(urls => {
            urls
                .fetch()
                .then(list => {
                    list.map(url => {
                        url = url.replace(this.baseUrl, this.testUrl);

                        runner.push(new Url(results, url));
                    });
                });
        });

        this.rewrites.map(rewrite => {
            rewrite
                .fetch()
                .then(rows => {
                    rows.map(row => {
                         runner.push(new Rewrite(results, this.testUrl, row[0], row[1]));
                    });
                });
        })
    }
}
