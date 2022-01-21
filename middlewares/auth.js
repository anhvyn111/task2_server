const jwt = require("jsonwebtoken");
module.exports =  (req, res, next) => {
    const authorizationHeaders = req.headers['authorization'];
    const token = authorizationHeaders.split(' ')[1];
    if(!token) res.status(401).json("You need to login");
    jwt.verify(token, process.env.SECRET_TOKEN, async (err,data) => {
        if(err){
            res.status(401).json("You need to login");
        }
        else{
            next();
        }   
    })
} 
