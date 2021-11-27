const router = require('express').Router();
let Publisher = require('../model/publisher.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello! (config category.js)'
    })
})

//Read Operation : Get list of publishers (GET localhost:5000/publisher/list)
router.route('/list').get((req, res) => {
    Publisher.find({
    }, (err, publisherList) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        } else {
            let data = [];
            for (i in publisherList) {
                let regNo = publisherList[i].regNo;
                let name = publisherList[i].name;
                let location = publisherList[i].location;
                let contactNo = publisherList[i].contactNo;
                data.push({ 'regNo': regNo, 'name': name,'location': location ,'contactNo': contactNo })
            }

            return res.send({
                success: true,
                message: 'List received',
                data: data
            })
        }
    })
})

// Create Opration: Create Publisher (GET localhost:5000/publisher/addPublisher)
router.route('/addPublisher').post((req, res) => {
    const { body } = req;
    const { regNo, name, location, contactNo } = body; 
   // Data constraints

    if (!regNo) {
        return res.send({
            success: false,
            message: 'Error: Publisher Registration Number cannot be blank.'
        })
    }
    if (!name) {
        return res.send({
            success: false,
            message: 'Error: Name cannot be blank.'
        })
    }
    //saving to database
    const newPublisher = new Publisher(req.body); //req.body is needed to save unstructred docs   

    newPublisher.save()
        .then(() =>
            res.send({
                success: true,
                message: 'New publisher added.'
            })
        )
        .catch(err => res.status(400).json('Error: ' + err));
});

//Delete Operation: Deleting a user (DELETE localhost:5000/publisher/delete)
router.route('/delete').delete((req, res) => {
    const { body } = req;
    const { regNo } = body; 
    //Data constraints
    if (!regNo) {
        return res.send({
            success: false,
            message: 'Error: Publisher Registration Number invalid.'
        })
    }

    Publisher.findOneAndDelete({regNo: regNo}, //deletion condition
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

//Update operation
router.route('/update').post((req, res) => {
    const {body} = req;
    const { regNo, newName, newLocation, newContactNo} = body;
    
    if (!regNo) {
        return res.send({
            success: false,
            message: 'Error : Invalid Publisher Register Number'
        })
    }
    
        //Update
        Publisher.findByIdAndUpdate({
            regNo: parseInt(regNo)
        },{$set:{name: newName, 
                location: newLocation, 
                contactNo: newContactNo}},
                
        (err) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })
            }
            else {
                return res.send({
                    success: true,
                    message: 'Publisher updated.'
                })
            }
        })
    
});


module.exports = router;