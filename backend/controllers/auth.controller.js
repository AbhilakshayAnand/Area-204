import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Sign Up

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try{
        if( password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters!"});
        }
        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({message: "User already exists!"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User ({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({message: "Invalid user data!"})
        }

    } catch (error)  {
        console.error("Error during signup: ", error);
        res.status(500).json({message: "Internal server error!"})
    }
}

// Login

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    try {
        const user = await User. findOne({email})

        if (!user) {
            res.status(400).json({message: "Invalid credentials!"})
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({message: "Invalid credentials!"})
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.error("Error during login: ", error);
        res.status(500).json({message: "Internal server error!"})
    }
} 

// Logout

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logged out successfully!"})
    } catch (error) {
        console.error("Error during logout: ", error);
        res.status(500).json({message: "Internal server error!"})
    }
}

// Update profile

export const updateProfile = async (req, res) => {

    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile picture is required!"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updateUser)

    } catch (error) {
        console.error("Error during update profile: ", error);
        res.status(500).json({message: "Internal server error!"})
    }
}

// Check Auth

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
} catch (error) {
    console.error("Error during check auth: ", error);
    res.status(500).json({message: "Internal server error!"})
    }
}