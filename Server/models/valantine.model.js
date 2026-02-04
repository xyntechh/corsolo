const mongoose = require("mongoose");

const valentineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        note: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },

        orderId: {
            type: String,
            default: null,
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "COMPLETED"],
            default: "PENDING",
        },

        paymentId: { type: String }


    },
    {
        timestamps: true,
    }
);

const Valentine = mongoose.model("Valentine", valentineSchema);

module.exports = Valentine;
