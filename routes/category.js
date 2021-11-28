const router = require('express').Router();
let Category = require('../model/category.model');

// create new book (POST localhost:5000/book/newbook)
router.route('/create').post((req, res) => {
    
    const { body } = req;
    const { title } = body; 
    
    console.log(req.body);

    if (!title) {
        return res.send({
            success: false,
            message: 'Error: Book Name cannot be blank.'
        })
    }
    const newcategory = new Category(req.body); //req.body is needed to save unstructred docs
    
    //console.log(newcategory);
    newcategory.save()
        .then(() =>
            res.send({
                success: true,
                message: 'New Category added.'
            })
        )
        .catch(err => res.status(400).json('Error: ' + err));
});

//list category
router.route('/list').get((req, res) => {
    Category.find({
    }, (err, categorylist) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        } else {
            let data = [];
            for (i in categorylist) {
                data.push(categorylist[i]);
            }

            return res.send({
                success: true,
                message: 'Category list',
                data: data
            })
        }
    })
})

//update book availability
router.route('/update').post((req, res) => {
    const { body } = req;
    const {isbn,availability } = body; //isbn of the book
    
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

    Book.findOneAndDelete({isbn: isbn}, //deletion condition
        function (err, docs) {
        if (err){
            res.send({
                success: false,
                message: 'Error: Deletion error'
            })
        }
        else{
            res.send({
                success: true,
                message: 'Book successfully removed from system',
                deleted_docs:docs
            })
        }
    });
});




module.exports = router;