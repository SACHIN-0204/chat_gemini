import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router()

const generateToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});

router.post("/register", async(req, res) => {

    const {username, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "user already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            message: "account created"});

    } catch(err) {
        res.status(401).json({
            message: err.message
        });
    }
});


router.post("/login", async(req, res) => {

    const {email, password} = req.body;

    try {

       const user = await User.findOne({email});
       if(user && (await bcrypt.compare(password, user.password))) {

        res.status(200).json({
             _id: user.id,
             username: user.username,
             email: user.email,
             token: generateToken(user._id),
             role: user.role
        });
       } else {
        res.status(401).json({message: "Invalid email or password"});
       }

    } catch(err) {
        res.status(400).json({success : false, message: err.message});
    }
});

export default router;