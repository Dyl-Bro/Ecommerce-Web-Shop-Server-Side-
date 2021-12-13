const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan')//morgan is library that allows for the logging of http requests coming from front end
const mongoose = require('mongoose')//mongo db database 
const cors = require('cors');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');
app.use(cors());
app.options('*', cors())//allowing everything (all http requests) to be passed
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })


const api = process.env.API_URL;

//Routes
const productsRouter = require('./ROUTERS/products');
const usersRouter = require('./ROUTERS/users');
const ordersRouter = require('./ROUTERS/orders');
const categoriesRouter = require('./ROUTERS/categories');
const orderItemsRouter =require('./ROUTERS/orderItems');
//middleware
app.use(express.json());//express.json is good for body parsing which allows json data to be interpreted by the software
app.use(morgan('tiny'));//logs http(middleware) rewuests in the 'tiny' format
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orderItems`, orderItemsRouter);





mongoose.connect(process.env.CONNECTION_STRING)//call mongoose.connect and pass connection string as parameter
.then(()=> {
    console.log('DATABASE CONNECTION IS READY')
})
.catch((err)=>{
    console.log(err);
})
app.listen(4000, ()=>{ //app/server is running on localhost:4000
    console.log(api);
    console.log('Server is now running in http://localhost:4000');
})
app.get('/favicon.ico', function(req, res) { 
    res.status(204);
    res.end();    
});
app.get("/", (req, res) => {
    res.send({ message: "We did it!" });
  });




module.exports = app;