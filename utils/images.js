"use strict";

const {getPool} = require('./mysql');

module.exports = {
    addImage,
    getNewImageId
};

async function addImage(name) {
    const sql = `INSERT INTO image (name) VALUES ('${name}');`;
    const [result] = await getPool().query(sql);
    return result.insertId;
}

async function getNewImageId() {
    const sql = 'SELECT image_id FROM image ORDER BY image_id DESC LIMIT 1';
    const [rows] = await getPool().query(sql);
    return rows[0].image_id + 1;
}