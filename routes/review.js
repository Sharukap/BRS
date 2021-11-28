const router = require('express').Router();
let Review = require('../model/review.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config review.js)'
    })
})

//Create Operation: create rewiew (POST localhost:5000/review/createReview )
router.route('/createReview').post((req, res) => {
    const { body } = req;
    const { reviewTitle, reviewBody, rating } = body; 
    //Data constraints/ validations
    if (rating < 0 || rating > 5) {
        return res.send({
            success: false,
            message: 'Error: Rating can not be less than 0 or greater than 5'
        })
    }
    
    //saving to database
    const newReview = new Review(req.body); //req.body is needed to save unstructred docs  

    newReview.save()
        .then(() =>
            res.send({
                success: true,
                message: 'New Review Created'
            })
        )
        .catch(err => res.status(400).json('Error: ' + err));
});

//Read operation: List users  (GET localhost:5000/review/list)
router.route('/list').get((req, res) => {
    Review.find({
    }, (err, reviewList) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        } else {
            let data = [];
            for (i in reviewList) {
                let reviewTitle = reviewList[i].reviewTitle;
                let reviewBody = reviewList[i].reviewBody;
                let rating = reviewList[i].rating;
                data.push({ 'reviewTitle': reviewTitle, 'reviewBody': reviewBody, 'rating': rating })
            }

            return res.send({
                success: true,
                message: 'List received',
                data: data
            })
        }
    })
})

//Delete Operation: Deleting a user (DELETE localhost:5000/review/delete)
router.route('/delete').delete((req, res) => {
    const { body } = req;
    const { _id } = body; //username of account to be deleted
    
    Review.findOneAndDelete({_id: _id}, //deletion condition
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
                message: 'Deletion successfull',
                deleted_docs:docs
            })
        }
    });
});

//Update Operation
router.route('/update').post((req, res) => {
    const {body} = req;
    const { _id, newTitle, newBody, newRating} = body;
    
    if (newRating < 0 || newRating > 5) {
        return res.send({
            success: false,
            message: 'Error: Rating can not be less than 0 or greater than 5'
        })
    }
    
        //Update
        Review.findOneAndUpdate({
            _id: _id
        },{$set:{reviewTitle: newTitle, 
                reviewBody:  newBody, 
                rating: newRating}},
                
        (err) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error:'+err
                })
            }
            else {
                return res.send({
                    success: true,
                    message: 'Review updated.'
                })
            }
        })
    
});

module.exports = router;