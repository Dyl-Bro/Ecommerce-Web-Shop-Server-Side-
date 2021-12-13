const {orderItem} = require('../MODELS/orderItem');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const orderItemList = await orderItem.find();
   
    if(!orderItemList){
        res.status(500).json({success:false})
    }
    res.send(orderItemList);
})
router.post(`/`, (req, res, ) =>{
    const orderitem = new orderItem({
       quantity: req.body.quantity
    })
    orderitem.save().then((createdorderItem=>{//save the ceratedvategory\ and then return the created order to see it in the front end and in case of error we will catch the error and create an error object 
        res.status(201).json(createdorderItem)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success:false
        })
    })
})
module.exports = router;