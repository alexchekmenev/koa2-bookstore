"use strict";

const router = require('koa-router')();

/**
 * Render main page
 */
router.get('/', async (ctx, next) => {
    await ctx.render('index');
});

module.exports = router;
