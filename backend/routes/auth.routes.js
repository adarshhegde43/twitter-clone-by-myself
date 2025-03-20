import express from "express" 
import { signup } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router(); //creates a new router object , where we can define routes for our object

router.post("/signup" , signup); //writing the signup function in auth.controller.js instead...

router.post("/login" , login);//writing the login function in auth.controller.js instead...

router.post("/logout" , logout);//writing the logout function in auth.controller.js instead...

export default router ;