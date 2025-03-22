import mongoose from "mongoose" ;

const userSchema = new mongoose.Schema({
        username : {
            type : String ,
            required : true ,
            unique: true,
        },

        fullName : {
            type : String ,
            required : true
        },

        password : {
            type : String ,
            required : true ,
            minlength : 6,
        },

        email : {
            type : String,
            required : true,
            unique : true
        },

        followers : {
            type : [mongoose.Schema.Types.ObjectId] ,
            ref : "User",
            default : []
        },

        following : {
            type : [mongoose.Schema.Types.ObjectId] ,
            ref : "User",
            default : []
        },

        profileImg : {
            type : String , //we are infact storing the URL to the image , after saving it to cloudinary !...
            default : ""
        },

        coverImg : {
            type : String , //we are infact storing the URL to the image , after saving it to cloudinary !...
            default : ""
        },

        bio : {
            type : String ,
            default : ""
        },

        link : {
            type : String ,
            default : ""
        },
    }, 
    {timestamps:true}
); //timestamps object is true , as we would like to know when this objext was created...
   // Automatically adds createdAt and updatedAt fields to the document.

export const User = mongoose.model("User" , userSchema ) ;//creating a model named "User" , with the provided userSchema 
//A model is created from the schema and represents a MongoDB collection.