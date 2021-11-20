const router = require('express').Router();
let Library = require('../model/library.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config library.js)'
    })
})




module.exports = router;