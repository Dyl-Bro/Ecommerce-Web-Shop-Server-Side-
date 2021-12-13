const {Category} = require('../MODELS/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const categoryList = await Category.find();
   
    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.status(200).send(categoryList);
})
router.get(`/:id`, async (req, res, ) =>{//finding single categories by id
    const category = await Category.findById(req.params.id);

    if(!category){
        res.status(500).json({message:'No category with given Id not found'})
    }
    res.status(200).send(category);
})

//the firt parameter for findByIdAndUpdate is the id we get from the user/client side and the second one is an object holding updated info
router.put(`/:id`, async (req, res, ) =>{//finding single categories by id and updating them
    const category = await Category.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name, 
            color: req.body.color, 
            icon: req.body.icon, 
            image: req.body.image  
        },
        {new: true}//this is optional and is to be used if you would like to see the new data returned after sending put request in postman 
    )

    if(!category){
        res.status(500).json({message:'NO category with given id found, category cannot be updated'})
    }
    res.status(200).send(category);
})


router.post(`/`, (req, res, ) =>{
    const category = new Category({
        name: req.body.name, //this is saying that the new product being created has the name of whatever the client enters on the front end(the POSTMAN body section) this is the same for image and countInStock
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
    })
    category.save().then((createdCategory=>{//save the ceratedProduct and then return the created product to see it in the front end and in case of error we will catch the error and create an error object 
        res.status(201).json(createdCategory)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success:false
        })
    })
})
//will get category id from the client in the url and delete
router.delete(`/:id`, (req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({success: true, message: 'category successfully deleted!'})
        } else{
            return res.status(404).json({success: false, message:'category not found' })
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})
module.exports = router;
