const fs = require('fs');

const parser = require('./parser/csv');

module.exports = class Rewrites {
    constructor({url}) {
        this.url = url;
    }

    toString() {
        return 'file: ' + this.url;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.url)) {
                reject('File ' + this.url + ' does not exist');
                return;
            }

            fs.readFile(this.url, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(parser.parse(data));
            });
        });
    }
}
