"use strict";

const Koa = require('koa');
const app = new Koa();

const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const render = require('koa-ejs');
const path = require('path');

const index = require('./routes/index');
const authors = require('./routes/authors');
const books = require('./routes/books');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    cache: false,
    debug: false
});

// logger
// app.use(async (ctx, next) => {
//   const start = new Date();
//   await next();
//   const ms = new Date() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

// routes
app.use(index.routes());
app.use(authors.routes());
app.use(books.routes());

// error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// });

module.exports = app;
