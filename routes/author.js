const router = require('express').Router();
let Author = require('../model/author.model');


// add new author (POST localhost:5000/author/newauthor)
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

//View list of Authors (GET localhost:5000/author/list)
router.route('/list').get((req, res) => {
    Author.find({
    }, (err, authorList) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        } else {
            let data = [];
            for (i in authorList) {
                data.push(authorList[i]);
            }

            return res.send({
                success: true,
                message: 'List received',
                data: data
            })
        }
    })
})

//delete an author
router.route('/remove').delete((req, res) => {
    const { body } = req;
    const { name } = body;

    Author.findOneAndDelete({ name: name }, //deletion condition
        function (err, docs) {
            if (err) {
                res.send({
                    success: false,
                    message: 'Error: Deletion error'
                })
            }
            else {
                res.send({
                    success: true,
                    message: 'Author successfully removed from system',
                    deleted_docs: docs
                })
            }
        });
});

//update author details
router.route('/update').post((req, res) => {
    const { body } = req;
    const { name, nationality, authorDesc, genreSpec } = body;
    Author.find({
        name: name
    }, (err, authors) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        }
        if (authors.length != 1) {
            return res.send({
                success: false,
                message: 'Error : Author does not exist'
            })
        }
        const author = authors[0];
        console.log(author);
        Author.findOneAndUpdate({
            name: name
        }, { $set: { genreSpec: genreSpec, authorDesc: authorDesc, nationality: nationality } },null,
            (err, author) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
                }
                else {
                    return res.send({
                        success: true,
                        message: 'Author details updated.'
                    })
                }
            })

    });
});

module.exports = router;