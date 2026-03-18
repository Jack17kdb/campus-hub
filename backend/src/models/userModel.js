import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@(kist\.ac\.ke|kiambupoly\.ac\.ke)$/,
            "Please use a valid KINAP institutional email (@kist.ac.ke or @kiambupoly.ac.ke)"
        ]
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
