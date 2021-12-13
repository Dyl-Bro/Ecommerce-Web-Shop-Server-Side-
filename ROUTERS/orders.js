const {Order} = require('../MODELS/order');
const express = require('express');
const {User} =require('../MODELS/user');
const {orderItem} = require('../MODELS/orderItem')
const router = express.Router();

router.get(`/`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
   
    if(!orderList){
        res.status(500).json({success:false})
    }
    res.send(orderList);
})
router.get(`/:id`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({path: 'orderItems', populate: 'product'});//basically a method of embedding population
   
    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order);
})
router.get(`/get/userorders/:userid`, async (req, res, ) =>{//page will be user orders with userid as a parameter for getting user order/purchase history
    const userOderList = await Order.find({user: req.params.userid}).populate({path: 'orderItems', populate: 'product'}).sort({'dateOrdered': -1});
    
    if(!userOderList){
        res.status(500).json({success:false})
    }
    res.send(userOderList);
})
//with map we are looping through every order item, saving them, and returning only the order item Ids.
router.post (`/`, async (req, res, ) =>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem =>{//Promise.all cobines the multiple promises into one sigle promise that can be resolved at one time 
        let newOrderItem = new orderItem({
            quantity: orderitem.quantity,
            product: orderitem.product

        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    
     const orderItemsIdsResolved = await orderItemsIds;//resolving the orderItemIds promises inside of the async await function
     
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const item = await orderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = item.product.price * item.quantity;
        return totalPrice
    }))
    const totalPrice = totalPrices.reduce((a,b)=> a + b, 0);
    console.log(totalPrices);
    console.log("total: " + totalPrice)

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1:  req.body.shippingAddress1,
        shippingAddress2:  req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        dateOrdered: req.body.dateOrdered,
        user: req.body.user
    })
  
    order = await order.save();
    
    if(!order){
        return res.status(400).send('the order cannot be created');
    }
    res.send(order);
    // order.save().then((createdOrder=>{//save the ceratedorder\ and then return the created order to see it in the front end and in case of error we will catch the error and create an error object 
    //     res.status(201).json(createdOrder)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error: err,
    //         success:false
    //     })
    // })
})

router.put(`/:id`, async (req, res, ) =>{//finding single categories by id and updating them
    const order = await Order.findByIdAndUpdate(
        req.params.id, 
        {
            status: req.body.status  
        },
        {new: true}//this is optional and is to be used if you would like to see the new data returned after sending put request in postman 
    )

    if(!order){
        res.status(500).json({message:'NO order with given id found, category cannot be updated'})
    }
    res.status(200).send(order);
})
router.delete(`/:id`, (req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if(order){
            //after deleting the order THEN we loop over the orderitems with a map 
            //and find the order items by id and delete them.
            await order.orderItems.map(async order =>{
                await orderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'order successfully deleted!'})
        } else{
            return res.status(404).json({success: false, message:'order not found' })
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})
router.get(`/get/totalsales`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const totalSales = await Order.aggregate([
        //using mongoose aggregate method to grop together all of the
        // totalPrices of our database
        {$group: {_id: null, totalsales : {$sum: '$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(400).send('the order sales cannot be generated')
    }
    res.send({totalsales: totalSales.pop().totalsales})
})
router.get('/get/count', async (req, res, ) =>{//get number of products
    const orderCount = await Order.countDocuments()
    if(!orderCount){
        res.status(500).json({success:false})
    }
    res.send({
        orderCount: orderCount
    });//returning json data that will look like --> "count" : productCount
})

module.exports = router;