"use strict";

const {getPool} = require('./mysql');
const moment = require('moment-timezone');
const config = require('../config');

const TIMEZONE = config.get('timezone');

module.exports = {
    addBook,
    updateBook,
    getById,
    getBooks
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
    return {
        book_id: +bookId,
        title: rows[0].title,
        description: rows[0].description,
        image_id: rows[0].image_id,
        date: rows[0].date,
        author_ids: await getBookAuthorIds(bookId)
    };
}

async function getBookAuthorIds(bookId) {
    const sql = `SELECT * FROM book_author WHERE book_id=${bookId};`;
    const [rows] = await getPool().query(sql);
    const authorIds = rows.reduce((prev, row) => {
        prev.push(row.author_id);
        return prev;
    }, []);
    return authorIds;
}

async function setBookAuthorIds(bookId, authorIds) {
    // TODO
}

async function getBooks(filter, sorting, offset, limit) {
    const sql = `SELECT b.*, 
    GROUP_CONCAT(DISTINCT a.name ORDER BY a.author_id ASC SEPARATOR ',') AS authors,
    GROUP_CONCAT(DISTINCT a.author_id ORDER BY a.author_id ASC SEPARATOR ',') AS author_ids
    FROM book b 
    INNER JOIN book_author ba USING (book_id)
    INNER JOIN author a USING (author_id)
    GROUP BY b.book_id LIMIT ${offset}, ${limit};`;
    const [rows] = await getPool().query(sql);
    return rows.map(row => {
        return {
            book_id: row.book_id,
            title: row.title,
            description: row.description,
            image_id: row.image_id,
            date: row.date,
            authors: row.authors,
            author_ids: row.author_ids.split(',').map(id => +id)
        }
    });
}