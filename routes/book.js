const router = require('express').Router();
let Book = require('../model/book.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config book.js)'
    })
})




module.exports = router;