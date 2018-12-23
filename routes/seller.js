const router = require('express').Router();
const Product = require('../models/product');
const Category = require('../models/category');

const checkJWT  = require('../middlewares/check-jwt');

const faker = require('faker');

router.route('/products')
    .get(checkJWT, (req,res,next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if(products) {
                    res.json({
                        success: true,
                        products: products
                    })
                }
            });
    })
    .post([checkJWT], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = 'http://placekitten.com/300/300';
        product.save();
        res.json({
            success: true,
            message: "Successfully added the product"
        });
    });

/*Just for testing*/
router.get('/faker/test', async (req,res,next) => {
    console.log("obj id");
    var categoryId = null;
    await Category.findOne({name: 'uncategorized'}, function (err, data) {
        categoryId = data._id;
    });
    for (let i = 0; i < 20; i++) {
        let product = new Product();
        product.category = categoryId;
        product.owner = '5c1fc3ae91c92132d834b405';
        product.image = 'http://placekitten.com/300/300';
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }
    res.json({
        message: "Successfully added 20 Pictures"
    });
})
/*Just for testing*/

module.exports = router;