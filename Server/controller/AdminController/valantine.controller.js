const Valentine = require("../../models/valantine.model.js");



exports.getAllValentineOrder = async (req, res) => {

    try {

        const valentineOrders = await Valentine.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Valentine orders retrieved successfully", data: valentineOrders });

    } catch (error) {
        res.status(500).json({ message: error.message })


    }
}


exports.getValentineCard = async (req, res) => {
    try {

        const inisitatedOrder = await Valentine.find({ paymentStatus: "PENDING" }).countDocuments();
        const completedOrder = await Valentine.find({ paymentStatus: "COMPLETED" }).countDocuments();
        const totalSale = await Valentine.find({ paymentStatus: "COMPLETED" }).countDocuments() * 199


        res.status(200).json({ success: true, message: "Valentine card stats retrieved successfully", data: { inisitatedOrder, completedOrder, totalSale } });

    } catch (error) {

        res.status(500).json({ message: error.message })

    }
}