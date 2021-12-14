# Ecommerce-Web-Shop-Server-Side-
Backend of on-going ecommerce web app project. utilizing node, express, and mongodb created for learning purposes.



 ## Get list of Products  
 **Request...**
 
 ``` GET http://localhost:4000/api/v1/products```
 ```
var axios = require('axios');

var config = {
  method: 'get',
  url: 'localhost:4000/api/v1/products',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```
 **Response...**
 ```
  {
        "richDescription": "",
        "images": [],
        "brand": [],
        "price": 0,
        "rating": 0,
        "isFeatured": false,
        "_id": "614fbeacd1c36f09baea568e",
        "name": "bike",
        "image": "some_url",
        "countInStock": 590,
        "__v": 0,
        "dateCreated": "2021-12-13T09:56:41.478Z",
        "id": "614fbeacd1c36f09baea568e"
    },
    {
        "_id": "6154a3950beebd95c24f9133",
        "name": "Coat",
        "description": "Coat description",
        "richDescription": "Coat detailed descrition",
        "image": "http://localhost:3000/public/uploads/pexels-marlene-leppänen-1183266 (1).jpg",
        "images": [],
        "brand": [
            "puppy coat brand"
        ],
        "price": 10,
        "category": {
            "_id": "6152a974706927df141ba997",
            "name": "apparel",
            "color": "red",
            "icon": "linkforicon",
            "image": "linkforimg",
            "__v": 0
        },
        "countInStock": 2,
        "rating": 4.5,
        "numReviews": 12,
        "isFeatured": true,
        "dateCreated": "2021-09-29T17:34:13.828Z",
        "__v": 0,
        "id": "6154a3950beebd95c24f9133"
    },
```

 ## Get list of Products filtered by Category 
 **Request...**
 
 ``` GET localhost:4000/api/v1/products?categories=6152a629e055a4405b1cc51d```
 ```
var axios = require('axios');

var config = {
  method: 'get',
  url: 'localhost:4000/api/v1/products?categories=6152a629e055a4405b1cc51d',
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```
**Result**
```
 {
        "_id": "6160fa2b1a3f7dfbab043b28",
        "name": "Product 6",
        "description": "product 6 Description",
        "richDescription": "product 6 richDescription",
        "image": "http://localhost:3000/public/uploads/Caesar.jpg-1633745451237",
        "images": [],
        "brand": [
            "product 6 brand"
        ],
        "price": 25,
        "category": {
            "_id": "6152a629e055a4405b1cc51d",
            "name": "furniture",
            "color": "green",
            "icon": "linktoicon",
            "image": "linktoimg"
        },
        "countInStock": 4,
        "rating": 4,
        "numReviews": 16,
        "isFeatured": true,
        "dateCreated": "2021-10-09T02:10:51.363Z",
        "__v": 0,
        "id": "6160fa2b1a3f7dfbab043b28"
    },
    {
        "_id": "6160ff3b1a3f7dfbab043b2b",
        "name": "product 7",
        "description": "product 7 Description",
        "richDescription": "product 6 richDescription",
        "image": "http://localhost:3000/public/uploads/Caesar.jpg-1633746746939",
        "images": [],
        "brand": [
            "product 6 brand"
        ],
        "price": 25,
        "category": {
            "_id": "6152a629e055a4405b1cc51d",
            "name": "furniture",
            "color": "green",
            "icon": "linktoicon",
            "image": "linktoimg"
        },
        "countInStock": 4,
        "rating": 4,
        "numReviews": 16,
        "isFeatured": true,
        "dateCreated": "2021-10-09T02:32:27.017Z",
        "__v": 0,
        "id": "6160ff3b1a3f7dfbab043b2b"
    },
```
## User Login 
**Request...**
 
 ``` POST http://localhost:4000/api/v1/users/login```
 ```
var axios = require('axios');
var data = JSON.stringify({
  "email": "op@gmail.com",
  "password": "opspassword"
});

var config = {
  method: 'post',
  url: 'localhost:4000/api/v1/users/login',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```

**Response...**
```
{
    "user": "op@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTU2MWY2ZmFiZTA0MzUzZDBmZjRiYzgiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2Mzk0NTMwNjEsImV4cCI6MTYzOTUzOTQ2MX0.zzpvspsau5wQgeOQbquhhYoM0-JJFIbu7S-XSn4QXnY"
}
```

## Register new User  
**Request...**
 
 ``` POST http://localhost:3000/api/v1/users/register```
 
 ```var axios = require('axios');
var data = JSON.stringify({
  "name": "AZ",
  "email": "az@gmail.com",
  "password": "azspassword",
  "street": "az street name",
  "phone": "1234567890"
});

var config = {
  method: 'post',
  url: 'localhost:4000/api/v1/users/register',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```

**Response...**
```{
    "name": "AZ",
    "email": "ab@gmail.com",
    "passwordHash": "$2a$10$5dEhIkv0gNNYSFIVvVuHEuk6bT42Qv3QwhJEgkv5ZjgHF0IeGE6CG",
    "street": "ab street name",
    "apartment": "",
    "city": "",
    "zip": "",
    "country": "",
    "phone": "1234567890",
    "isAdmin": false,
    "_id": "61b814b705ad9e9632b0cba5",
    "__v": 0,
    "id": "61b814b705ad9e9632b0cba5"
}```
