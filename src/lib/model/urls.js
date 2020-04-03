const fs = require('fs');
const http = require('axios');

const sitemap = require('./parser/sitemap');
const csv = require('./parser/csv');

module.exports = class Urls {
    static TYPE_URL = 'url';
    static TYPE_FILE = 'file';

    static FORMAT_SITEMAP = 'sitemap';
    static FORMAT_CSV = 'csv';

    constructor({type, format, url}) {
        if (type == undefined) {
            type = Urls.TYPE_URL;
        }

        this.type = type;
        this.format = format;
        this.url = url;
    }

    toString() {
        return "[" + this.type + "] [" + this.format + "] " + this.url;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            switch (this.type) {
                case Urls.TYPE_URL:
                    http
                        .get(this.url)
                        .then(response => {
                            if (response.status == 200) {
                                resolve(this.parse(response.data));
                            } else {
                                reject('Url ' + this.url + ' returned ' + response.status + ' ' + response.statusText);
                            }
                        });
                    break;
                case Urls.TYPE_FILE:
                    if (fs.existsSync(this.url)) {
                        fs.readFile(this.url, 'utf-8', (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(this.parse(data));
                            }
                        });
                    } else {
                        reject('File does not exist: ' + this.url);
                    }
                    break;
                default:
                    reject('Unknown url type: ' + this.type);
                    break;
            }

        });
    }

    parse(data) {
        switch(this.format) {
            case Urls.FORMAT_SITEMAP:
                return sitemap.parse(data);
                break;
            case Urls.FORMAT_CSV:
                return csv.parse(data).map(row => row[0]);
                break;
            default:
                return [];
                break;
        }
    }
}
