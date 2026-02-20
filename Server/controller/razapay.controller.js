const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model")
const Partner = require("../models/Partner.model");
const Ebook = require("../models/eBook.model")
const Valentine = require("../models/valantine.model.js");

// Razorpay Instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE PAYMENT LINK
exports.createPaymentLink = async (req, res) => {

    const userId = req.user?.userId

    const { amount, email, plan } = req.body;

    console.log(amount, email, plan)

    try {


        if (!amount || !email || !plan) {
            return res.status(400).json({ success: false, message: "Please fill all details" });
        }

        // Create Transaction first (PENDING)
        const transaction = await Transaction.create({
            email,
            amount,
            plan,
            transactionType: "PENDING",
            userId

        });

        const options = {
            amount: amount * 100,
            currency: "INR",
            description: `Payment for course: ${plan}`,
            customer: {
                name: "User",
                email: email,
            },
            notify: { sms: false, email: true },

            notes: {
                transactionId: transaction._id.toString(),
                planName: plan,
                userId: userId.toString()
            },
            callback_url: "https://www.corsolo.com/home",
            callback_method: "get",
        };

        const link = await instance.paymentLink.create(options);

        return res.status(200).json({
            success: true,
            paymentLinkId: link.id,
            url: link.short_url,
            transactionId: transaction._id,
            userId: userId
        });

    } catch (error) {
        console.error("Payment Link Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.razorWebhookooooooo = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const webhookSecret = process.env.WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }

        const event = req.body.event;

        if (event === "payment_link.paid") {
            const paymentLink = req.body.payload.payment_link.entity;
            const notes = paymentLink.notes;

            const transactionId = notes.transactionId;
            const userId = notes.userId;
            const plan = notes.planName;

            console.log("Webhook Transaction:", transactionId);
            console.log("Webhook UserId:", userId);









            return res.json({
                success: true,
                message: "Payment verified & user coins updated"
            });
        }

        return res.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ success: false });
    }

};

exports.razorpayWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const expectedSignature = crypto
            .createHmac("sha256", process.env.WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ success: false });
        }

        const event = req.body.event;
        if (event !== "payment_link.paid") {
            return res.json({ success: true });
        }

        const paymentLink = req.body.payload.payment_link.entity;
        const notes = paymentLink.notes;
        const plan = notes.planName;
        const transactionId = notes.transactionId;
          const userId = notes.userId;

        console.log("Webhook Plan:", plan);

        // 🔥 ROUTING LOGIC
        if (plan === "Ebook Purchase") {
            await Ebook.findByIdAndUpdate(transactionId, {
                Status: "COMPLETED",
                paymentId: paymentLink.id,
            });
        }

        else if (plan === "Valantine Purchase") {
            await Valentine.findByIdAndUpdate(transactionId, {
                paymentStatus: "COMPLETED",
                paymentId: paymentLink.id,
            });
        }

        else {
            // course / coins
            // Update user coins
            const user = await User.findById(userId);



            console.log("user RefferdBy:", user);

            // Update transaction
            const transaction = await Transaction.findByIdAndUpdate(
                transactionId,
                {
                    transactionType: "SUCCESS",
                    paymentId: paymentLink.id,
                    refferdBy: user.refferdBy || "Default"

                },
                { new: true }
            );

            if (!user) return res.status(404).json({ message: "User not found" });

            user.coin = (user.coin || 0) + transaction.amount;
            await user.save();


            //update partner coins if refferdBy exists
            if (user.refferdBy) {
                const partner = await Partner.findOne({ referralCode: user.refferdBy });
                if (partner) {
                    partner.coins = (partner.coins || 0) + Math.floor(transaction.amount * 0.2); // 20 % commission
                    partner.totalSubscriptions += 1;
                    await partner.save();
                }
            }

        }

        return res.json({ success: true });

    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ success: false });
    }
};





//CREATE EBOOK PAYMENT LINK 
exports.razorWebhookforEbook = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const webhookSecret = process.env.WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }

        const event = req.body.event;

        if (event === "payment_link.paid") {
            const paymentLink = req.body.payload.payment_link.entity;
            const notes = paymentLink.notes;

            const transactionId = notes.transactionId;
            const plan = notes.planName;

            console.log("Webhook Transaction:", transactionId);


            // Update ebook status
            const ebook = await Ebook.findByIdAndUpdate(
                transactionId,
                {
                    Status: "COMPLETED",
                    paymentId: paymentLink.id,

                },
                { new: true }
            );
            if (!ebook) return res.status(404).json({ message: "Ebook transaction not found" });








            return res.json({
                success: true,
                message: "Payment verified & user coins updated"
            });
        }

        return res.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ success: false });
    }

};


exports.createPaymentLinkForEBook = async (req, res) => {

    const userId = req.user?.userId

    const { name, email, phone } = req.body;

    console.log(name, email, phone)

    try {




        if (!name || !email || !phone) {
            return res.status(400).json({ success: false, message: "Please fill all details" });
        }


        const orderId = `EBOOK-${Date.now()}`;

        // Create Transaction first (PENDING)
        const ebook = await Ebook.create({
            name,
            email,
            phone,
            orderId
        });

        const amount = 499; // Ebook price
        const plan = "Ebook Purchase";

        const options = {
            amount: amount * 100,
            currency: "INR",
            description: `Payment for ${plan}`,
            customer: {
                name: name,
                email: email,
            },
            notify: { sms: false, email: true },

            notes: {
                transactionId: ebook._id.toString(),
                planName: plan,
            },
            callback_url: "https://www.corsolo.com/paymentSuccessEbook",
            callback_method: "get",
        };

        const link = await instance.paymentLink.create(options);

        return res.status(200).json({
            success: true,
            paymentLinkId: link.id,
            url: link.short_url,
            transactionId: ebook._id,
        });

    } catch (error) {
        console.error("Payment Link Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};




//CREATE VALENTINE PAYMENT LINK
exports.razorWebhookforValantine = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const webhookSecret = process.env.WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }

        const event = req.body.event;

        if (event === "payment_link.paid") {
            const paymentLink = req.body.payload.payment_link.entity;
            const notes = paymentLink.notes;

            const transactionId = notes.transactionId;
            const plan = notes.planName;

            console.log("Webhook Transaction:", transactionId);
            console.log("Webhook Plan:", plan);


            // Update ebook status
            const ebook = await Valentine.findByIdAndUpdate(
                transactionId,
                {
                    paymentStatus: "COMPLETED",
                    paymentId: paymentLink.id,

                },
                { new: true }
            );
            if (!ebook) return res.status(404).json({ message: "Valentine transaction not found" });



            return res.json({
                success: true,
                message: "Payment verified & user coins updated"
            });
        }

        return res.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ success: false });
    }

};

exports.createPaymentLinkForValantine = async (req, res) => {

    const { name, email, phone, note } = req.body;

    console.log(name, email, phone, note)

    try {

        if (!name || !email || !phone) {
            return res.status(400).json({ success: false, message: "Please fill all details" });
        }


        const orderId = `VAL-${Date.now()}`;

        // Create Transaction first (PENDING)
        const valantine = await Valentine.create({
            name,
            email,
            phone,
            orderId,
            note
        });

        const amount = 199;
        const plan = "Valantine Purchase";

        const options = {
            amount: amount * 100,
            currency: "INR",
            description: `Payment for ${plan}`,
            customer: {
                name: name,
                email: email,
            },
            notify: { sms: false, email: true },

            notes: {
                transactionId: valantine._id.toString(),
                planName: plan,
            },
            callback_url: "https://www.corsolo.com/valantinePaymentSuccess",
            callback_method: "get",
        };

        const link = await instance.paymentLink.create(options);

        return res.status(200).json({
            success: true,
            paymentLinkId: link.id,
            url: link.short_url,
            transactionId: valantine._id,
        });

    } catch (error) {
        console.error("Payment Link Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

