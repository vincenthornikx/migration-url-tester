const parser = require('csv-parse/lib/sync');

module.exports = new class Csv {
    parse(data) {
        return parser(data);
    }
}
