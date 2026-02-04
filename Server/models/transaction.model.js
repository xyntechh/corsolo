const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        paymentId: {
            type: String,
        },
        orderId: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: true,
        },

        refferdBy: {
            type: String,
            default: "Default"
        },
        amount: {
            type: Number,
            required: true,
        },
        transactionType: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING",
        },
        plan: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
