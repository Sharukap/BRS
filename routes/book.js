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

//update books
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
//delete book


module.exports = router;