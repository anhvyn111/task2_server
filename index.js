const express = require("express");
const app = express();
const PORT = 5000;
const User = require("./models/user");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");
app.use(cors());
app.use(express.json());
dotenv.config()

mongoose.connect(
    process.env.CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
)

app.get("/api/auth", auth, (req, res) => {
    res.status(200).json({code: 1});
})

app.post("/api/login", (req, res) => {
    let {username, password} = req.body;
    if(username == "admin" && password == "123456"){
        var token = jwt.sign(username, 
            process.env.SECRET_TOKEN
           );
        res.status(200).json({code:1, token: token});
    }
    else{
        res.status(400).json({code: 0, message: "Incorrect username or password."})
    }
})

app.get("/api/users", auth, async (req, res) => {
    const name = req.query.name;
    try{
        if(name){
            const users = await User.find({ $or:[{username:{'$regex' : name, '$options' : 'i'}}, {email:{'$regex' : name, '$options' : 'i'}}]});
            res.status(200).json(users);
        }
        else{
            const users = await User.find();
            res.status(200).json(users);
        }
        
    }
    catch(error){
        res.status(500).json(error);
    }
})

app.post("/api/users", auth, async (req, res) => {
    try{
        const error = 0;
        const updateUsers = req.body;
        //Validate input
        updateUsers.forEach((user) => {
            if(!user.email || user.email == "" 
            || !user.username || user.username == "" 
            || !user.birthdate || user.birthdate == ""){
                error += 1;
            }
        });
        if(error > 0) res.status(400).json("Please enter full information");
        updateUsers.map(async (user) => {
            await User.findByIdAndUpdate({_id: user._id}, {username: user.username, email: user.email, birthdate: user.birthdate}, (err, data) => {
            });
        });
        res.status(200).json({code: 1, message: "Updated successful."});
    }catch(error){
        res.status(400).json("Please enter full information");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})