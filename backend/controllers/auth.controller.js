import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";


export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }
        
        if(password.length < 6){
            return res.status(400).json({error : "Password must be atleast 6 characters long !"});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user in dB
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // Generate token and set cookie
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller:", error); // Detailed error logging
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req , res) => {
    try {
        const {username , password} = req.body ;
        const user = await User.findOne({username}); //The User.findOne() method queries the database to find a user with the provided username.
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || ""); //if user.password is not empty , compare the password entered with our user's password.

        if(!user || !isPasswordCorrect){ //if password is incorrect  
            return res.status(400).json({error : "Invalid username or password !"});
        }
        //Once verification done , generate token , set cookie , send response . 

        generateTokenAndSetCookie(user._id , res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        }) ;


    } catch (error) {
        console.log("Error in login controller:", error); // Detailed error logging
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req , res) => {
    try {
        res.cookie("jwt" ,"", { //we are not sending token in our cookie now...
            maxAge : 0 //cookie expires immediately !
        });
        res.status(200).json({message : "Logout successfully "});
    } catch (error) {
        console.log("error in logout controller" , error.message);
        res.status(500).json({error : "Internal server error"});
    }
};

export const getMe = async (req , res) => { 
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller");
        res.status(500).json({error : "Internal Server Error"});
    }
}; 
//The getMe function is a controller that fetches the currently authenticated user’s details 
//(excluding the password) and sends them back in the response.
//This function only executes once we verify route is secure !