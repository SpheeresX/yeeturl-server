module.exports = (app, Link, log, isJSON) => {
    const crypto = require('crypto');

    /* The endpoint below is used to send the encrypted URL to the database. */
    app.post('/api/shorten', async (req, res) => {
        log('New request to /api/shorten');
        if (!req.body.url || !isJSON(req.body.url)) return res.status(400).send();
        // Generate an ID for the url
        var id = crypto.randomBytes(3).toString('hex');
        // Save everything to the database
        const link = new Link({
            id: id,
            data: req.body.url
        }).save((err, doc) => {
            if (err) return res.status(500).json({ err: "An error has occured while saving your url to the database." });

            res.status(200).json({ link: id });
        });
    });
}