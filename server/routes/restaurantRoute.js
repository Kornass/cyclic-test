const express = require ('express')
router        = express.Router(),
    controller    = require('../controllers/restaurantController');

router.post('/remove', controller.removeRestaurant)
router.post('/update', controller.updateRestaurant)
router.post('/register', controller.registerRestaurant)
router.post('/login', controller.loginRestaurant)
router.post('/verify_token', controller.verify_tokenRestaurant)




module.exports=router;