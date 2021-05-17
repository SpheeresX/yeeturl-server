module.exports = (app) => {
    /* This endpoint is used to get the encrypted url from the database. */
    app.get('/privacy.txt', async (req, res) => {
        res.redirect('/privacy.html');
    });
}
