module.exports = (app, Link, log) => {
    /* This endpoint is used to get the encrypted url from the database. */
    app.get('/api/v1/count', async (req, res, next) => {
        log('New request to /api/v1/count')
        Link.countDocuments({}, (err, count) => {
            if (err) next(err);
            res.json({c: count});
        });
    });
}