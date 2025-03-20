import mongoose from "mongoose" ;

const connectMondoDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected : ${conn.connection.host}`);  
        
    } catch (error) {
        console.log(`Error connecting to mongoDB : ${error.message}`);
        process.exit(1) ;
    }
}

export default connectMondoDb;