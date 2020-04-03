#!/usr/bin/env node

const yargs = require('yargs');
const results = require('../lib/model/results');

process.on('exit', results.flush);

require('../lib/controller/profile');
require('../lib/controller/run');


const argv = yargs
    .help("h")
    .alias("h", "help")
    .argv;
