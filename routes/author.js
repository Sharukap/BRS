const router = require('express').Router();
let Author = require('../model/author.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config author.js)'
    })
})

// add new author (POST localhost:5000/book/newbook)
router.route('/newauthor').post((req, res) => {
    
    const { body } = req;
    const { name } = body; 
    
    console.log(req.body);

    if (!name) {
        return res.send({
            success: false,
            message: 'Error: Author Name cannot be blank.'
        })
    }
    const newauthor = new Author(req.body);
    
    console.log(newauthor);
    newauthor.save()
        .then(() =>
            res.send({
                success: true,
                message: 'New Author added to list.'
            })
        )
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;