const chalk = require('chalk');
const config = require('../config');
const {table, getBorderCharacters} = require('table');
const yargs = require('yargs');

module.exports = new class Controller {
    constructor() {
        this.setup();
    }

    setup() {
        yargs
            .command('profile', 'Manage profiles', () => {
                yargs
                    .command('list', 'List profiles', () => {}, this.list)
                    .command('create', 'Create Profile', () => {}, this.create)
                    .command('remove', 'Remove Profile', () => {}, this.remove);
            });
    }

    list() {
        const tableData = [];
        const headers = [
            chalk.bold('Name'),
            chalk.bold('Base URL'),
            chalk.bold('Test URL'),
            chalk.bold('Urls'),
            chalk.bold('Rewrites')
        ];

        config.getProfiles().map(profile => {
            const urls = [];
            const rewrites = [];

            profile.urls.map(url => urls.push(url.toString()));
            profile.rewrites.map(rewrite => rewrites.push(rewrite.toString()));

            tableData.push([
                profile.name,
                profile.baseUrl,
                profile.testUrl,
                urls.join("\n"),
                rewrites.join("\n")
            ]);
        });

        const output = table(
            [].concat([headers]).concat(tableData),
            {
                border: getBorderCharacters('norc')
            }
        );
        console.log(output);
    }

    create() {
        console.log('create model')
    }

    remove() {
        console.log('remove model')
    }
}
