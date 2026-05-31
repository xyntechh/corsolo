// controllers/paymentController.js

const https = require("https");
const Transaction = require("../models/transaction.model.js");
const Ebook = require("../models/eBook.model.js");
const User = require("../models/user.model.js");
require("dotenv").config();
const crypto = require("crypto");
const { Cashfree, CFEnvironment } = require("cashfree-pg")


//CASHFREE CONFIGURATION
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

//initialize cashfree instance
const cashfree = new Cashfree(
    process.env.NODE_ENV === "production" ? CFEnvironment.PROD
        : CFEnvironment.SANDBOX,
    CASHFREE_APP_ID,
    CASHFREE_SECRET_KEY
)


//Function to create OrderId
const generateOrderId = () => {
    return `order_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
};


// Create Payment Link  

exports.createCashfreePaymentLink = async (req, res) => {

    const userId = req.user?.userId
    const { amount, email, plan } = req.body;

    console.log(amount, email, plan)

    try {

        // Basic validation
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized / Token Expired"
            });
        }

        if (!amount || !email || !plan) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details"
            });
        }


        //Validate Cashfree Credentials
        if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "Payment gateway not configured"
            });
        }


        //genrate unique order id
        const orderId = generateOrderId();


        //create pending transaction
        const transaction = await Transaction.create({
            email,
            amount,
            plan,
            transactionType: "PENDING",
            userId,
            orderId: orderId,
        })

        await transaction.save();

        // Create Cashfree Payment Link

        const orderData = {
            order_amount: amount,

            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: userId.toString(),
                customer_email: email,
                customer_phone: "9999999999",
                customer_plan: plan

            },

            order_meta: {
                return_url: `https://www.corsolo.com/home?order_id={order_id}`,
                notify_url: "https://www.corsolo.com/api/cashfree/paymentwebook",

            },

            order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        }


        console.log("Creating Cashfree Payment Link with data:", orderData);

        const cashfreeResponse = await cashfree.PGCreateOrder(orderData);
        console.log("Cashfree Response:", cashfreeResponse);

        //checking cashfree have a session id or not
        if (cashfreeResponse.data?.payment_session_id) {

            return res.status(200).json({
                success: true,
                payment_session_id: cashfreeResponse.data.payment_session_id,
                order_id: cashfreeResponse.data.order_id,
                transactionId: transaction._id
            });
        } else {

            throw new Error("Failed to create payment link");

        }


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
}


exports.cashFreeWebhook = async (req, res) => {
    try {

        const { orderId } = req.body;

        console.log("Received Cashfree Webhook with data:", req.body);

        //basic validation
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Webhook Data"
            });
        }

        //get order details from cashfree using order id

        const cashFreeResponse = await cashfree.PGFetchOrder(orderId);
        console.log("Fetched Order Details from Cashfree:", cashFreeResponse);

        const orderStatus = cashFreeResponse.data.order_status;
        const paymentDetails = cashFreeResponse.data.payment_details || {};

        console.log("Payment Details:", paymentDetails);

        if (orderStatus === "PAID") {


            //find Transaction in database using order id
            const transaction = await Transaction.findOne({ orderId });
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found"
                });
            } else {

                transaction.transactionType = "SUCCESS";
                transaction.paymentId = paymentDetails.payment_id || null;
                await transaction.save();
            }

            //coin update pending here 
        }




    } catch (error) {
        console.error("Cashfree Webhook Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};