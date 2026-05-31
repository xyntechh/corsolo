// controllers/paymentController.js

const https = require("https");
const Transaction = require("../models/transaction.model.js");
const Ebook = require("../models/eBook.model.js");
const User = require("../models/user.model.js");
require("dotenv").config();
const crypto = require("crypto");



exports.createPaymentLink = async (req, res) => {

    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized / Token Expired"
            });
        }

        const { amount, email, plan } = req.body;

        if (!amount || !email || !plan) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details"
            });
        }

        // Save pending transaction
        const transaction = await Transaction.create({
            email,
            amount,
            plan,
            transactionType: "PENDING",
            userId
        });

        const orderId = `order_${Date.now()}`;

        const postData = JSON.stringify({
            order_id: orderId,

            order_amount: amount,

            order_currency: "INR",

            customer_details: {
                customer_id: userId.toString(),
                customer_email: email,
            },

            order_meta: {
                return_url:
                    `https://www.corsolo.com/home?order_id={order_id}`
            },

            order_tags: {
                plan: plan,
                amount: amount,
                transactionId: transaction._id.toString(),
                email: email,
                userId: userId.toString()

            },
        });

        const options = {

            // LIVE URL
            hostname: "sandbox.cashfree.com",

            path: "/pg/orders",

            method: "POST",

            headers: {
                "Content-Type": "application/json",

                "Content-Length":
                    Buffer.byteLength(postData),

                "x-client-id":
                    process.env.CASHFREE_APP_ID,

                "x-client-secret":
                    process.env.CASHFREE_SECRET_KEY,

                "x-api-version":
                    "2023-08-01"
            }
        };

        const request = https.request(options, (response) => {

            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {

                try {

                    const parsedData = JSON.parse(data);

                    console.log(
                        "Cashfree Response:",
                        parsedData
                    );

                    // If Cashfree returns error
                    if (parsedData.type === "authentication_error") {

                        return res.status(401).json({
                            success: false,
                            message: parsedData.message
                        });

                    }

                    return res.status(200).json({
                        success: true,

                        payment_session_id:
                            parsedData.payment_session_id,

                        order_id:
                            parsedData.order_id,

                        transactionId:
                            transaction._id
                    });

                } catch (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Invalid Cashfree Response"
                    });

                }

            });

        });

        request.on("error", (error) => {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Payment creation failed",
                error: error.message
            });

        });

        request.write(postData);

        request.end();

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};



exports.cashFreeWebhook = async (req, res) => {
    try {

        const signature = req.headers["x-webhook-signature"];

        const generatedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("base64");

        if (signature !== generatedSignature) {
            return res.status(401).json({
                success: false,
                message: "Invalid Signature"
            });
        }

        console.log(
            "Cashfree Webhook Received:",
            JSON.stringify(req.body, null, 2)
        );

        const data = req.body;

        const paymentStatus = data?.data?.payment?.payment_status;

        if (paymentStatus !== "SUCCESS") {
            return res.status(200).json({
                success: true,
                message: "Payment not successful",
            });
        }

        const order = data?.data?.order;

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order data not found",
            });
        }

        const tags = order?.order_tags || {};

        const transactionId = tags.transactionId;
        const userId = tags.userId;
        const email = tags.email;
        const amount = Number(tags.amount || 0);
        const plan = tags.plan;

        if (!transactionId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing transactionId or userId",
            });
        }

        const existingTransaction = await Transaction.findById(transactionId);

        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Prevent duplicate coin credit
        if (existingTransaction.transactionType === "SUCCESS") {
            return res.status(200).json({
                success: true,
                message: "Webhook already processed",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update transaction
        await Transaction.findByIdAndUpdate(
            transactionId,
            {
                transactionType: "SUCCESS",
                paymentId: data?.data?.payment?.cf_payment_id,
                orderId: order?.order_id,
                email,
                amount,
                plan,
                userId,
            },
            { new: true }
        );

        // Add coins
        await User.findByIdAndUpdate(
            userId,
            {
                $inc: {
                    coins: amount,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Payment processed successfully",
        });
    } catch (error) {
        console.error("Cashfree Webhook Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};