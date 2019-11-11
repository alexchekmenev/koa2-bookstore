"use strict";

const nconf = require('nconf');
const path = require('path');

let p = path.join(__dirname, 'local.json');
nconf.file({file: p});

module.exports = nconf;