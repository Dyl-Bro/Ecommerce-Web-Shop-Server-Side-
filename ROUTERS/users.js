const {User} = require('../MODELS/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');//used to save passwords as passwordhash
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const userList = await User.find().select('name phone email isAdmin');//only shwoing name and contact information when getting list of users
   
    if(!userList){
        res.status(500).json({success:false})
    }
    res.send(userList);
})

router.get(`/:id`, async (req, res, ) =>{//finding single user by id
    const user = await User.findById(req.params.id).select('-passwordHash');//ecxcludes user paswors from being shown everytime someone looks up a specific user by id

    if(!user){
        res.status(500).json({message:'No user with given Id not found'})
    }
    res.status(200).send(user);
})
router.get('/get/count', async (req, res, ) =>{//get number of products
    const userCount = await User.countDocuments()
    if(!userCount){
        res.status(500).json({success:false})
    }
    res.send({
        userCount: userCount
    });//returning json data that will look like --> "count" : productCount
})
router.post(`/`, (req, res, ) =>{//for the admin to add and remove users
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),//salt(2nd parameter is an additional secret that can be added to make it harder for someone to decrypt your hash)
        street:req.body.street,
        apartment:req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin
    })
    user.save().then((createdUser=>{//save the cerateduser\ and then return the created user to see it in the front end and in case of error we will catch the error and create an error object 
        res.status(201).json(createdUser)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success:false
        })
    })
})
router.post(`/register`, (req, res, ) =>{//user can register an account
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),//salt(2nd parameter is an additional secret that can be added to make it harder for someone to decrypt your hash)
        street:req.body.street,
        apartment:req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin
    })
    user.save().then((createdUser=>{//save the cerateduser\ and then return the created user to see it in the front end and in case of error we will catch the error and create an error object 
        res.status(201).json(createdUser)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success:false
        })
    })
})
router.post(`/login`, async (req, res, ) =>{
    const user = await User.findOne({email: req.body.email})//searching for a user via email to see if the user exists
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send(' user not found')
    }
    
    //to login a user we must compare the password entered to a password that already exists within the database
    //we must decrypt the password stored in the database and use the decrytpted password to compare to the entered password
    //we use bcrypt.compareSynch to compare the password entered in the request body, to the passwordHash that is already stored for the user.
    //one the server has authenticated the user it will store a JWT we need to retreive the JSON 
    //Web Token using the JWT library
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign({userId: user.id, isAdmin: user.isAdmin}, secret, {expiresIn: '1d'} )//third parameter is exp. date for token which we have set for 1 day (1d) 
        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('Incorrect Password, User NOT Authenticated')
    }

})
router.delete(`/:id`, (req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user){
            return res.status(200).json({success: true, message: 'user successfully deleted!'})
        } else{
            return res.status(404).json({success: false, message:'user not found' })
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})




module.exports = router;