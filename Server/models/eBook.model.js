// models/chat.model.js
const mongoose = require("mongoose");

const Ebook = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    orderId: { type: String, required: true, unique: true },
    Status: { type: String, enum: ["PENDING", "COMPLETED"], default: "PENDING" },
    paymentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Ebook", Ebook);
