const router = require('express').Router();
let Author = require('../model/author.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config author.js)'
    })
})




module.exports = router;