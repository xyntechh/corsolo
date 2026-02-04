const Ebook = require("../models/eBook.model")


exports.purchaseEbook = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const orderId = `ORDER-${Date.now()}`;

        const newEbookPurchase = new Ebook({
            name,
            email,
            phone,
            orderId
        });
        await newEbookPurchase.save();

        res.status(201).json({ message: "Ebook purchased successfully", orderId });
    } catch (error) {
        console.error("Error purchasing ebook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};