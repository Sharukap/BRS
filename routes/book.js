const router = require('express').Router();
let Book = require('../model/book.model');
let Author = require('../model/author.model');
let Category = require('../model/category.model');



 
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

//List books with populated data from author and category  (GET localhost:5000/book/listmore) 
router.route('/listmore').get((req, res) => {
    Book.find({})
    .populate('author')
    .populate('bookshelf')
    .then((books)=>{
        const data = books
        return res.send({
            success: true,
            message: 'Book list',
            data: data
        })
    }

    )
    
})

//update book availability
router.route('/updateavailability').post((req, res) => {
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
    const { id } = body; 
    Book.findByIdAndDelete(id, //deletion condition
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


//Individual contribution of  185016T Collure K.S
router.route('/newreview').post((req, res, next) => {
    const { body } = req;
    const { isbn } = body; 
    Book.find({
        isbn:isbn
    },(err,books)=>{
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
        book.review.push(req.body);
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
        isbn:isbn
    },(err,books)=>{
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

module.exports = router;