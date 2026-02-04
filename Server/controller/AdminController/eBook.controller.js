const Ebook = require("../../models/eBook.model")


exports.getAllEbooksOrder = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const ebooks = await Ebook.find()
            .sort({ createdAt: -1 })   // latest first
            .skip(skip)
            .limit(limit);

        const totalEbooks = await Ebook.countDocuments();

        res.status(200).json({
            success: true,
            message: "Ebooks fetched successfully",
            currentPage: page,
            totalPages: Math.ceil(totalEbooks / limit),
            totalEbooks,
            ebooks
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching ebooks",
            error: error.message
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {

        const completedEbooks = await Ebook.countDocuments({ Status: "COMPLETED" });
        const pendingEbooks = await Ebook.countDocuments({ Status: "PENDING" });
        const totalSale = completedEbooks * 199; // assuming each ebook costs 199

        res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data: {
                completedEbooks,
                pendingEbooks,
                totalSale
            }

        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard stats",
            error: error.message
        });
    }
};