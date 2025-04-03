import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User' ,//reference it to the user model...
        required : true
    },

    text:{
        type:String,
    },
    img:{
        type: String,
    },
    likes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ], //Likes is an array of user values !
    comments :[ //comments is an array of objects having text and user...
        {
            text : {
                type : String,
                required : true,
            },
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User',
                required : true,
            },
        },
    ],
},{timestamps:true});

export const Post = mongoose.model("Post" , postSchema);