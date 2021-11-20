const router = require('express').Router();
let User = require('../model/user.model');

//test route
router.route('/hello').get((req, res) => {
    return res.send({
        success: true,
        message: 'Hello!!!'
    })
})

//Read operation: List users  (GET localhost:5000/user/list)
router.route('/list').get((req, res) => {
    User.find({
    }, (err, userList) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error:Server error'
            })
        } else {
            let data = [];
            for (i in userList) {
                let username = userList[i].username;
                let name = userList[i].name;
                data.push({ 'username': username, 'name': name })
            }

            return res.send({
                success: true,
                message: 'List received',
                data: data
            })
        }
    })
})

//Create Operation: Sign up (POST localhost:5000/user/signup )
router.route('/signup').post((req, res) => {
    const { body } = req;
    const { username, name, password } = body; 
    //Data constraints/ validations
    if (!username || username.length < 4) {
        return res.send({
            success: false,
            message: 'Error: Username invalid.'
        })
    }
    if (!name) {
        return res.send({
            success: false,
            message: 'Error: Name cannot be blank.'
        })
    }
    if (!password || password.length < 4) {
        return res.send({
            success: false,
            message: 'Error: Password invalid.'
        })
    }
    //saving to database
    const newUser = new User(req.body); //req.body is needed to save unstructred docs
    newUser.password = newUser.generateHash(password); //for password hashing
    

    newUser.save()
        .then(() =>
            res.send({
                success: true,
                message: 'New user signed up.'
            })
        )
        .catch(err => res.status(400).json('Error: ' + err));
});

//Delete Operation: Deleting a user (DELETE localhost:5000/user/delete)
router.route('/delete').delete((req, res) => {
    const { body } = req;
    const { username } = body; //username of account to be deleted
    //Data constraints
    if (!username || username.length < 4) {
        return res.send({
            success: false,
            message: 'Error: Username invalid.'
        })
    }

    User.findOneAndDelete({username: username}, //deletion condition
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

//Update Operation: Changing password (POST localhost:5000/user/changepassword)
router.route('/changepassword').post((req, res) => {
    const { body } = req;
    const {username, oldpassword, newpassword } = body; //username of account to be updated
    //Data constraints, validations
    if (!username|| !oldpassword || !newpassword || username.length < 4 || oldpassword.length < 4 ||newpassword.length < 4) {
        return res.send({
            success: false,
            message: 'Error: Password invalid.'
        })
    }
                //validate old password
                User.find({
                    username: username
                }, (err, users) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error:Server error'
                        })
                    }
                    if (users.length != 1) {
                        return res.send({
                            success: false,
                            message: 'Error : Invalid username'
                        })
                    }
                    const user = users[0];
                    if (!user.validPassword(oldpassword)) {
                        return res.send({
                            success: false,
                            message: 'Error :Invalid password'
                        })
                    }
                    //update password
                    User.findOneAndUpdate({
                        username: username
                    }, { $set: { password: user.generateHash(newpassword) } }, null,
                        (err, user) => {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Error: Server error'
                                })
                            }
                            else {
                                return res.send({
                                    success: true,
                                    message: 'Password updated.'
                                })
                            }
                        })
            
                });
});


module.exports = router;