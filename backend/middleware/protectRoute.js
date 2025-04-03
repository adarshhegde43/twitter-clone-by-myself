import { User } from "../models/user.model.js";     
import jwt from "jsonwebtoken"; // Import jwt

export const protectRoute = async (req , res , next ) => { //nce this function is executed , call the "next" function...
    try {
        const token = req.cookies.jwt ; //getting cookies from token..
        if(!token){ //if no cookie...
            return  res.status(401).json({error : "Unauthorized , no token provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET); 

        if(!decoded) { //if there is a cookie , but invalid..
            return res.status(401).json({error : "Invalid Token "}); 
        }

        const user = await User.findById(decoded.userId).select("-password") ;

        if(!user){
            return res.status(404).json({error : "User not found"}); 
        }

        req.user = user ; 
        next() ; //call the next function in pipeline...getMe...
    } catch (error) {
        console.log("Error in protectedRoute middleware" , error.message);
        return res.status(500).json({
            error : "Internal server error"
        });
    }
}

//The protectRoute middleware ensures that only authenticated users can access certain routes (e.g., /me). 
//It verifies the JWT token stored in the jwt cookie and attaches the authenticated user to the req object.