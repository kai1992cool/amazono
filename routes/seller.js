const router = require('express').Router();
const Product = require('../models/product');

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
        product.image = 'https://via.placeholder.com/300';
        product.save();
        res.json({
            success: true,
            message: "Successfully added the product"
        });
    });

/*Just for testing*/
router.get('/faker/test', (req,res,next) => {
    for (let i = 0; i < 20; i++) {
        let product = new Product();
        product.category = '5c1108ffc1bd8e113c64c0c6';
        product.owner = '5c0b3019da58f12824fd3735';
        product.image = 'https://via.placeholder.com/300';
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