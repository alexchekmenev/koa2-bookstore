"use strict";

// get the client
const mysql = require('mysql2');
const config = require('../config');

// create the pool
const pool = mysql.createPool({
    host: config.get('mysql:host'),
    user: config.get('mysql:user'),
    password: config.get('mysql:password'),
    database: config.get('mysql:database'),
});
const promisePool = pool.promise();

module.exports = {
    getPool: () => {
        return promisePool;
    }
};