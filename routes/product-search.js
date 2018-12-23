const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('ECKXZNL7QA', '45355853c43dcf5a62110ee570a47fb9');
const index = client.initIndex('amazonov1');

router.get('/', (req, res, next) => {
    if(req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page
        }, (err, content) => {
            res.json({
                success: true,
                message: "Here is your search",
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }
});

module.exports = router;