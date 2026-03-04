import User from "../models/userModel.js";
import generateCode from "../utils/generateCode.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/emailService.js";

const register = async(req, res) => {
    const { username, email, studentId, password } = req.body;
    try {

        let user;

        user = await User.findOne({username});
        if(user){
            return res.status(400).json({"message": "Username already exists"});
        };

        user = await User.findOne({email});
        if(user){
            return res.status(400).json({"message": "Email already exists"});
        };

        user = await User.findOne({studentId});
        if(user){
            return res.status(400).json({"message": "Student ID already exists"});
        };

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const verificationToken = generateCode();

        const newUser = new User({
            username,
            email,
            studentId,
            password: hash,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            try {
                await sendVerificationEmail(email, verificationToken);
            } catch (error) {
                console.log("Error sending verification email:", error);
            }

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
                message: "Registration successful! Please check your email for verification."
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error registering", error);
    }
};

const verifyEmail = async(req, res) => {
    const { token } = req.query;
    try {
        if(!token){
            return res.status(400).json({"message": "Please provide token"});
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if(!user) return res.status(400).json({ message: "Invalid or expired verification token" });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log("Error in verifyEmail:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async(req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({"message": "Incorrect credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({"message": "Incorrect credentials"});
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.log("Error logging in user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({"message": "User doesn't exist"});
        }

        const resetToken = generateCode();

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 3600000;
        await user.save();

        try {
            await sendPasswordResetEmail(email, resetToken);
        } catch (error) {
            console.log("Error sending password reset email: ", error);
        }

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.log("Error sending reset email: ", error);
        res.status(500).json( {message: "Internal server error"} );
    }
};

const resetPassword = async(req, res) => {
    const { token } = req.query;
    const { password } = req.body;
    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({"message": "Invalid or expired reset token"});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async(req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error logging out user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updatePic = async(req, res) => {
    const { profilePic } = req.body;
    try {
        if (!profilePic) {
            return res.status(400).json({ message: "Please provide a profile picture" });
        }

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new: true});

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error updating profile picture", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserById = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(400).json({ "message": "User not found" });
        }

        res.status(200).json(user);
    } catch(error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAccount = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkAuth = async(req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error checking auth", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { register, verifyEmail, login, forgotPassword, resetPassword, logout, deleteAccount, checkAuth, updatePic, getUserById };
