const {Product} = require('../MODELS/product')
const express = require('express');
const { Category } = require('../MODELS/category');
const router = express.Router(); //when imported to app.js this router can be used for middlewear
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const FILE_TYPE_MAP = { //specifying the types of files/mimetypes accepted to the backend
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid =  FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-')
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName } - ${Date.now()}.${extension}` )
    }
  })
  const uploadOptions = multer({ storage: storage })

router.get(`/`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    let filter = {};
    if(req.query.categories){
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');//will return the productList with product names and images taking away the id without the rest of the details such as rating, reviews,etc
   
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res, ) =>{//async is an alternative to .then() and .catch()
    const product = await Product.findById(req.params.id).populate('category');
   
    if(!product){
        res.status(500).json({success:false})
    }
    res.send(product);
})
router.put(`/:id`,uploadOptions.single('image'), async (req, res, ) =>{//finding single categories by id and updating them
   if(!mongoose.isValidObjectId(req.params.id)){//use mongoose, required above to check for validity of id so that bacjend doesnt hang when an invalid id is passed as a param.
    res.status(400).send('invalid product ID')
   }
    const category = await Category.findById(req.body.category);
    if(!category){return res.status(400).send('Invalid Category!') }

    const product = await Product.findById(req.params.id);
    if(!product){return res.status(400).send('Invalid Product!');}

   const file = req.file;
   let imgPath;//use to fill the path of the img itwill be the old one already in database or new filepath if user uploads it to request
   if(file){//case: user has uploaded a file in the put request
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    imgPath = `${basePath}${fileName}`;
   } else {//case: user has not uploaded a file in the put request so the imgPath remains unchanged
       imgPath = product.image;
   }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name, 
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imgPath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,//we'll use category id 
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new: true}//this is optional and is to be used if you would like to see the new data returned after sending put request in postman 
    )
    if(!updatedProduct){
        res.status(500).json({message:'product cannot be updated'})
    }
    res.status(200).send(updatedProduct);
})

router.post(`/`,uploadOptions.single('image'), async (req, res, ) =>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid Category!')
    }
    const file = req.file;
    if(!file){ return res.status(400).send('No image in the request')}
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;//so that we can get the full URL of img including the http part when we receive image
    const product = new Product({
        name: req.body.name, 
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,//"http://localhost:3000/public/uploads"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,//we'll use category id 
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product.save().then((createdProduct=>{//save the cerateduser\ and then return the created user to see it in the front end and in case of error we will catch the error and create an error object 
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success:false
        })
    })
})
router.put(`/gallery-images/:id`,uploadOptions.any('images', 10), async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){//use mongoose, required above to check for validity of id so that bacjend doesnt hang when an invalid id is passed as a param.
        res.status(400).send('invalid product ID')
       }
       const files = req.files
       let imagesPaths = [];
       const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
       if(files){
           files.map(file =>{
               imagesPaths.push(`${basePath}${file.fileName}`);//looping through files uploaded and adding to imagesPath array
           })
       }
       const product = await Product.findByIdAndUpdate(
        req.params.id, 
        {
           images: imagesPaths
        },
        {new: true}
       )
       if(!product){
        res.status(500).json({message:'product cannot be updated'})
    }
        res.status(200).send(product);
        
})
router.delete(`/:id`, (req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product){
            return res.status(200).json({success: true, message: 'product successfully deleted!'})
        } else{
            return res.status(404).json({success: false, message:'product not found' })
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})

router.get('/get/count', async (req, res, ) =>{//get number of products
    const productCount = await Product.countDocuments()
    if(!productCount){
        res.status(500).json({success:false})
    }
    res.send({
        productCount: productCount
    });//returning json data that will look like --> "count" : productCount
})
router.get('/get/featured/:count', async (req, res, ) =>{//get featured products
    count = req.params.count ? req.params.count: 0 //similar to if statement saying if there is a count passed w/ the api, then get it. if not then return 0
    const products = await Product.find({isFeatured: true}).limit(count)
    if(!products){
        res.status(500).json({success:false})
    }
    res.send(products);//returning json data that will look like --> "count" : productCount
})
module.exports = router;