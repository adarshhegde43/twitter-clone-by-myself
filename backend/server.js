import express from "express" ;//express is a module already downloaded on your desktop..
import authRoutes from "./routes/auth.routes.js"; //Don't forget to add .js at the end , because we are using type:module...
import dotenv from "dotenv" ;
import connectMondoDb from "./dB/connectMongoDb.js";

dotenv.config() ; //allows us to access process.env...

const app = express(); //Function which creates express app...
const PORT = process.env.PORT || 5000 ;

app.use("/api/auth" , authRoutes);

app.listen(PORT , (req,res) => {
    console.log(`You are listening to port ${PORT}`);
    connectMondoDb(); //connect to dB after listening to port...
});

