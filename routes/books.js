"use strict";

const router = require('koa-router')();
const koaBody = require('koa-body');
const path = require('path');
const {addImage} = require('../utils/images');
const {getById, addBook, updateBook} = require('../utils/books');

router.prefix('/books');

router.param('book_id', async (id, ctx, next) => {
    // console.log('fetch book');
    ctx.book = await getById(id);
    console.log(ctx.book);
    if (!ctx.book) {
        return ctx.status = 404;
    }
    return next();
});

router.post('/', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(process.cwd(), 'public/uploads'),
        keepExtensions: true
    }
}), async (ctx, next) => {
    if (!ctx.request.body.title) {
        return ctx.throw(400, 'Missing title');
    }
    if (!ctx.request.body.description) {
        return ctx.throw(400, 'Missing description');
    }
    if (!ctx.request.body.author_ids) {
        return ctx.throw(400, 'Missing author_ids');
    }
    if (!ctx.request.files || !ctx.request.files.image) {
        return ctx.throw(400, 'Missing image');
    }
    const filePath = ctx.request.files.image.path;
    const fileName = filePath.substr(filePath.indexOf('upload_'));
    if (!isValidImage(fileName)) {
        return ctx.throw(400, 'Wrong image format');
    }
    const imageId = await addImage(fileName);
    const bookId = await addBook({
        title: ctx.request.body.title,
        description: ctx.request.body.description,
        image_id: imageId,
        author_ids: ctx.request.body.author_ids.split(',').map(id => +id)
    });
    ctx.body = {id: bookId};
});

router.put('/:book_id', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(process.cwd(), 'public/uploads'),
        keepExtensions: true
    }
}), async (ctx, next) => {
    let imageId;
    if (ctx.request.files && ctx.request.files.image) {
        const filePath = ctx.request.files.image.path;
        const fileName = filePath.substr(filePath.indexOf('upload_'));
        if (!isValidImage(fileName)) {
            return ctx.throw(400, 'Wrong image format');
        }
        imageId = await addImage(fileName);
    }
    const updater = {
        book_id: ctx.book.book_id,
        title: ctx.request.body.title || ctx.book.title,
        description: ctx.request.body.description || ctx.book.description,
        image_id: imageId || ctx.book.image_id
    };
    if (ctx.request.body.author_ids) {
        updater.author_ids = ctx.request.body.author_ids.split(',').map(id => +id);
    }
    ctx.body = await updateBook(updater);
});

router.get('/:book_id', async (ctx, next) => {
    ctx.body = ctx.book;
});

router.get('/', (ctx, next) => {
    ctx.body = '';
});

module.exports = router;

function isValidImage(fileName) {
    return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
}
