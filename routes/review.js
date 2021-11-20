const router = require('express').Router();
let Review = require('../model/review.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config review.js)'
    })
})




module.exports = router;