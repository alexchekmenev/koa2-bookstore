"use strict";

const router = require('koa-router')();
const koaBody = require('koa-body');
const {getById, addAuthor, updateAuthor} = require('../utils/authors');

router.prefix('/authors');

router.param('author_id', async (id, ctx, next) => {
    console.log('fetch author');
    ctx.author = await getById(id);
    console.log(ctx.author);
    if (!ctx.author) {
        return ctx.status = 404;
    }
    return next();
});

router.post('/', koaBody({multipart: true}), async (ctx, next) => {
    if (!ctx.request.body.name) {
        return ctx.throw(400, 'Missing name');
    }
    ctx.body = {
        id: await addAuthor(ctx.request.body.name)
    };
});

router.put('/:author_id', koaBody({multipart: true}), async (ctx, next) => {
    const name = ctx.request.body.name || ctx.author.name;
    ctx.body = await updateAuthor(ctx.author.id, name);
});

router.get('/:author_id', (ctx, next) => {
    ctx.body = ctx.author;
});

module.exports = router;
