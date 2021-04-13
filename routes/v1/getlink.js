module.exports = (app, Link, log) => {
    /* This endpoint is used to get the encrypted url from the database. */
    app.get('/api/getlink', async (req, res) => {
        log('New request to /api/getlink')
        if (!req.query.id) return res.status(400).send({ err: "Please provide an ID" });
        const link = await Link.findOne({ id: req.query.id });
        if (!link) return res.status(404).json({ err: "This link doesn't exist" });

        res.send(link.data);
    });
}