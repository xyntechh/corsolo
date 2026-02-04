const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    handle: {
        type: String,
        required: true,
    },

    handleUserName: {
        type: String,
        required: true,
    },

    handleLink: {
        type: String,
        required: true,
    },

    referralCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    referralLink: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },


    totalVisits: {
        type: Number,
        default: 0,
    },

    totalSignups: {
        type: Number,
        default: 0,
    },

    totalSubscriptions: {
        type: Number,
        default: 0,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,

    },


    phone: {

        type: Number,
        required: true,
        unique: true,

    },

    upiId: {
        type: String,
    },

    balance: {
        type: Number,
        default: 0,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

},
    { timestamps: true });

module.exports = mongoose.model("Partner", PartnerSchema);
