const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        ip: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female"]
        },

        lookingFor: {
            type: String,
            enum: ["Male", "Female"]
        },

        coin: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        chats: {
            type: Number,
            default: 0,

        },
        email: {
            type: String,
            default: null,
            unique: true,
            sparse: true
        },

        phone: {
            type: Number
        },

        password: {
            type: String,
            default: null
        },

        isGuest: {
            type: Boolean,
            default: true
        },

        refferdBy: {
            type: String
        },


        isOnline: { type: Boolean, default: false },
        socketId: String,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
