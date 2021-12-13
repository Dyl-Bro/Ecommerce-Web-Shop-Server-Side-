function errorHandler(err,req,res,next){
    if(err.name === 'UnauthorizedError'){
        return res.status(401).json({message: "The user is not authorized with valid token"})
    }

    //will be used for images
    if(err.name === 'ValidationError'){
        return res.status(401).json({message: err})
    }
    return res.status(500).json({message: err})
}

module.exports = errorHandler;