import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";


import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export const getUserProfile = async (req , res) => {
    const {username} = req.params ; //dynamic value obtained from req.params.....why is {} used ?

    try {
        const user = await user.findOne({username}).select("-password");
        if(!user) return res.status(404).json({error : "User not found"});

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error : error.message});
        console.log("Error in getUserProfile controller" , error.message);
    }
}

export const followUnfollowUser = async(req , res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()){ //converting the object to string representation....as req params are a string too.
            return res.status(400).json({error: "You can't follow or unfollow yourself"});
        }

        if(!userToModify || !currentUser) {
            return res.status(400).json({error : "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            //Unfollows user
            await User.findByIdAndUpdate(id , { $pull: { followers : req.user._id} });
            await User.findByIdAndUpdate(req.user._id , { $pull: { following : id} });

            res.status(200).json({message : "User unfollowed successfully"});

        }else {
            //Follows user
            await User.findByIdAndUpdate(id , { $push: { followers : req.user._id }}) ;
            await User.findByIdAndUpdate(req.user._id , { $push: { following : id}});

            //Send a notif to the user...
            try {
                const newNotification = new Notification({
                    type: "follow",
                    from: req.user._id,
                    to: userToModify._id,
                });
                await newNotification.save();
            } catch (error) {
                console.log("Error creating notification:", error.message);
            }
            
            // TODO : return id of the user as response
            res.status(200).json({message : "User followed successfully"});
        }

    } catch (error) {
        res.status(500).json({error : error.message});
        console.log("Error in followUnfollow controller" , error.message);
    }
}

export const getSuggestedUsers = async(req , res) =>{
    try {
        const userId = req.user._id ;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match : {
                    _id : {$ne : userId}//exclude current user from this array .
                }
            },
            {$sample : {size:10}}
        ])

        const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach(user=>user.password=null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({error : error.message});
        console.log("Error in getSuggestedusers controller" , error.message);
    }
};

export const updateUser = async (req, res) => {
    const { fullName, email, userName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Password validation logic (keep your existing code)
        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({ error: "Please provide both current and new password!" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect!" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long!" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle file uploads if they exist in the request
        if (req.files?.profileImg) {
            const profileImgFile = req.files.profileImg[0];
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImgFile.buffer.toString('base64'), {
                folder: 'profile_images'
            });
            profileImg = uploadedResponse.secure_url;
        }

        if (req.files?.coverImg) {
            const coverImgFile = req.files.coverImg[0];
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImgFile.buffer.toString('base64'), {
                folder: 'cover_images'
            });
            coverImg = uploadedResponse.secure_url;
        }

        // Update user fields
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = userName || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save();
        user.password = null;

        // Send the updated user as response
        res.status(200).json(user);
        
    } catch (error) {
        console.log("Error in updateUser controller!", error.message);
        res.status(500).json({ error: error.message });
    }
};