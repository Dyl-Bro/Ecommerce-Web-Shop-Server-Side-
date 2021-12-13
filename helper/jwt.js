const expressJwt = require('express-jwt');//library used for checking 


//protection function
//we pass our custom secret as an option for the expressJwt function. when someone passes a... 
//token to our backend we need to compare the token to our secret and if they're token isnt...
//based on our secret they will not be granted acces but will be given access when it is .
//the second parameter passed in the function within our authJWT function is the algorithm for...
//generating the token. We can find generic algorithms on jwt.io 
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],//taken from the algorithms section of JWT.io
        isRevoked: isRevoked
    }).unless({//we want the users login & register apis or the get requests for the productsto be excluded from being authenticated because we want everyone to be able to access the login page and get a valid token from there
        path:  [
            {url: /\/public\/uploads(.*)/, methods:['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/, methods:['GET', 'OPTIONS'] },//using regex in first parameter to exlude more than one product api route at the same time without having to list aech one out every single time. this regex is specifically referring to everthing after products in the request
            {url: /\/api\/v1\/categories(.*)/, methods:['GET', 'OPTIONS'] },//using regex in first parameter to exlude more than one product api route at the same time without having to list aech one out every single time. this regex is specifically referring to everthing after categories in the request  
            `${api}/users/login`,
            `${api}/users/register`,
            `/`
            
        ]
    })
}
 //request is when we want to use request parameter or body. The payload contains the data that is inside the token for ex: isAdmin
async function isRevoked(req,payload,done){
    if(!payload.isAdmin) {
        done(null,true)//is the user token does not have payload specifiying that the user is an admin we will reject the user
    }
    done();
}

module.exports = authJwt;