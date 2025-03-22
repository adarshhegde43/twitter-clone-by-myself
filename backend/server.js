import express from "express" ;//express is a module already downloaded on your desktop..
import authRoutes from "./routes/auth.routes.js"; //Don't forget to add .js at the end , because we are using type:module...
import dotenv from "dotenv" ;
import connectMongoDb from "./dB/connectMongoDb.js";
import cookieParser from "cookie-parser";

dotenv.config() ; //allows us to access process.env...

const app = express(); //Function which creates express app...
const PORT = process.env.PORT || 5000 ;

app.use(express.json()); //parse the requested body 
app.use(express.urlencoded({extended : true})) ; //to parse form-data (urlencoded)...
app.use(cookieParser()); //parse cookies...

app.use("/api/auth" , authRoutes);

app.listen(PORT , (req,res) => {
    console.log(`You are listening to port ${PORT}`);
    connectMongoDb(); //connect to dB after listening to port...
});

