"use strict";

const {getPool} = require('./mysql');
const moment = require('moment-timezone');
const config = require('../config');

const TIMEZONE = config.get('timezone');
console.log('timezone', TIMEZONE);

module.exports = {
    addBook,
    updateBook,
    getById
};

async function addBook(book) {
    const b = {
        title: book.title,
        title_lowercased: book.title.toLowerCase(),
        description: book.description,
        description_lowercased: book.description.toLowerCase(),
        image_id: book.image_id,
        date: moment.tz(TIMEZONE).utc().format('YYYY-MM-DD HH:mm:ss')
    };
    const sql = `INSERT INTO book (title,title_lowercased,description,description_lowercased,image_id,date) 
        VALUES ('${b.title}','${b.title_lowercased}','${b.description}','${b.description_lowercased}',${b.image_id},'${b.date}');`;
    const [result] = await getPool().query(sql);
    const bookId = result.insertId;
    await setBookAuthorIds(bookId, book.author_ids);
    return bookId;
}

async function updateBook(book) {
    const b = {
        book_id: book.book_id,
        title: book.title,
        title_lowercased: book.title.toLowerCase(),
        description: book.description,
        description_lowercased: book.description.toLowerCase(),
        image_id: book.image_id
    };
    const sql = `UPDATE book SET title='${b.title}',title_lowercased='${b.title_lowercased}',
        description='${b.description}',description_lowercased='${b.description_lowercased}',image_id=${b.image_id}
        WHERE book_id=${b.book_id};`;
    await getPool().query(sql);
    if (book.author_ids) {
        await setBookAuthorIds(book.book_id, book.author_ids);
    }
    return await getById(book.book_id);
}

async function getById(bookId) {
    const sql = `SELECT * FROM book WHERE book_id=${bookId}`;
    const [rows] = await getPool().query(sql);
    if (!rows[0]) {
        return null;
    }
    return rows[0]; // TODO: add author_ids
}

async function getBookAuthorIds(bookId) {
    // TODO
}

async function setBookAuthorIds(bookId, authorIds) {
    // TODO
}

async function getBooks(filters, sorting, offset, limit) {
    // TODO add author_ids
}