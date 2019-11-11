"use strict";

const {getPool} = require('./mysql');

module.exports = {
    getById,
    addAuthor,
    updateAuthor
};

async function getById(authorId) {
    const sql = `SELECT * FROM author WHERE author_id=${authorId}`;
    const [rows] = await getPool().query(sql);
    if (!rows[0]) {
        return null;
    }
    return {
        id: rows[0].author_id,
        name: rows[0].name
    };
}

async function addAuthor(name) {
    const sql = `INSERT INTO author (name, name_lowercased) VALUES ('${name}', '${name.toLowerCase()}');`;
    const [result] = await getPool().query(sql);
    return result.insertId;
}

async function updateAuthor(authorId, name) {
    console.log(authorId, name);
    const sql = `UPDATE author SET name='${name}',name_lowercased='${name.toLowerCase()}' WHERE author_id=${authorId};`;
    await getPool().query(sql);
    return await getById(authorId);
}