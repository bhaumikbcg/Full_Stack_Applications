import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateJWTTokenAndSetCookie from "../utils/generateTokens.js";

const signup = async(req, res) => {
    try{
        const {username, password} = req.body;//got the request
        const hashedPassword = await bcrypt.hash(password, 10);//hashed the password

        const foundUser = await User.findOne({username});//check if user already exists
        if(foundUser) {
            return res.status(201).json({message: "User already exists"});
        } else {
            const newUser = new User({username: username, password: hashedPassword});
            generateJWTTokenAndSetCookie(username._id, res);
            await newUser.save();
            res.status(201).json({message: "User created successfully"});
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}


export const login = async(req, res) => {
    try{
        const {username, password} = req.body;//got the request

        const foundUser = await User.findOne({username});//check if user already exists
        if(!foundUser) {
            return res.status(401).json({message: "Auth failed"});
        } else {
            const passwordMatch = await bcrypt.compare(password, foundUser.password);
            if(!passwordMatch) {
                return res.status(401).json({message: "Auth failed"});
            }
            generateJWTTokenAndSetCookie(foundUser._id, res);
            res.status(201).json({_id: foundUser._id, username: foundUser.username});//send back user details on successful login
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Login failed"});
    }
}

export default signup;