const router = require('express').Router();
let Category = require('../model/category.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config category.js)'
    })
})




module.exports = router;