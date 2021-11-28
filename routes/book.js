const router = require('express').Router();
const path = require('path'); // include for hanlding path to html files
let Book = require('../model/book.model');


router.route('/home').get((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// create new book (POST localhost:5000/book/newbook)
router.route('/newbook').post((req, res) => {

    const { body } = req;
    const { title } = body;

    console.log(req.body);

    if (!title) {
        return res.send({
            success: false,
            message: 'Error: Book Name cannot be blank.'
        })
    }
    const newbook = new Book(req.body); //req.body is needed to save unstructred docs

    console.log(newbook);
    newbook.save()
        .then(() =>
            res.send({
                success: true,
                message: 'New book added.'
            })
        )
        .catch(err => res.status(400).json('Error: ' + err));
});

//List books  (GET localhost:5000/book/list)
router.route('/list').get((req, res) => {
    Book.find({
    }, (err, bookList) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        } else {
            let data = [];
            for (i in bookList) {
                data.push(bookList[i]);
            }

            return res.send({
                success: true,
                message: 'List received',
                data: data
            })
        }
    })
})

//update book availability
router.route('/updateavailability').post((req, res) => {
    const { body } = req;
    const { isbn, availability } = body; //isbn of the book

    //Can remove this part later when frontend  is implemented
    Book.find({
        isbn: isbn
    }, (err, books) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        }
        if (books.length != 1) {
            return res.send({
                success: false,
                message: 'Error : book does not exist'
            })
        }
        const book = books[0];
        console.log(book);
        Book.findOneAndUpdate({
            isbn: isbn
        }, { $set: { availability: availability } }, null,
            (err, book) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
                }
                else {
                    return res.send({
                        success: true,
                        message: 'Book availability updated.'
                    })
                }
            })

    });
});

//delete books

router.route('/remove').delete((req, res) => {
    const { body } = req;
    const { isbn } = body;

    Book.findOneAndDelete({ isbn: isbn }, //deletion condition
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
                    message: 'Book successfully removed from system',
                    deleted_docs: docs
                })
            }
        });
});
//delete book




//Individual contribution of  185016T Collure K.S
// Adding a new review to a book
router.route('/newreview').post((req, res, next) => {
    const { body } = req;
    const { isbn } = body;
    Book.findOne({
        isbn: isbn
    }, (err, books) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        }
        if (!books) {
            return res.send({
                success: false,
                message: 'Error : book does not exist'
            })
        }
        const book = books;
        book.review.push(
            {
                reviewTitle: req.body.reviewTitle,
                reviewBody: req.body.reviewBody,
                rating: req.body.rating
            }
        );
        book.save()
            .then(() =>
                res.send({
                    success: true,
                    message: 'New review added.'
                })
            )
            .catch(err => res.status(400).json('Error: ' + err));

    });


})

//listing reviews
router.route('/listreview').get((req, res, next) => {
    const { body } = req;
    const { isbn } = body;
    Book.find({
        isbn: isbn
    }, (err, books) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        }
        if (books.length != 1) {
            return res.send({
                success: false,
                message: 'Error : book does not exist'
            })
        }
        const book = books[0];
        const data = book.review
        return res.send({
            success: true,
            message: 'List received',
            data: data
        })

    });


})

//Delete 
router.route('/deletereview').delete((req, res) => {
    

    Book.findOne({ isbn: req.body.isbn })
        .then(book => {
            book.review.pull({ _id: req.body.reviewId })
            book.save()
        })
        .then(book => {
            return res.send({
                success: true,
                message: 'Review deleted successfully'
            })
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            })
        })

});
router.route('/updatereview').put((req, res) => {
    Book.findOne({ isbn: req.body.isbn })
        .then(book => {
            let index = book.review.findIndex(x => x._id == req.body.reviewId)
            book.review[index].reviewBody = req.body.reviewBody
            book.save();
        })
        .then(book => {
            return res.send({
                success: true,
                message: 'Review Updated Successfully'
            })
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            })
        })

});


module.exports = router;