import express from "express" ;//express is a module already downloaded on your desktop..
import dotenv from "dotenv" ;
import cookieParser from "cookie-parser";
import { v2 as cloudinary} from "cloudinary";

import authRoutes from "./routes/auth.routes.js"; //Don't forget to add .js at the end , because we are using type:module...
import userRoutes from "./routes/user.routes.js";

import connectMongoDb from "./dB/connectMongoDb.js";

dotenv.config() ; //allows us to access process.env...
cloudinary.config({ //This "logs in" our  app to Cloudinary’s API.
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
}); //These keys authenticate our app with Cloudinary’s API!

const app = express(); //Function which creates express app...
const PORT = process.env.PORT || 5000 ;

app.use(express.json()); //parse the requested body 
app.use(express.urlencoded({extended : true})) ; //to parse form-data (urlencoded)...
app.use(cookieParser()); //parse cookies...

app.use("/api/auth" , authRoutes);
app.use("/api/users" , userRoutes);

app.listen(PORT , (req,res) => {
    console.log(`You are listening to port ${PORT}`);
    connectMongoDb(); //connect to dB after listening to port...
});

