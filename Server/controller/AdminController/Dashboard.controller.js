const User = require("../../models/user.model")
const Payment = require("../../models/transaction.model")
const Partner = require("../../models/Partner.model")


//HELPER FUCNTION FO TIME 
const getTimeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
};



exports.dashboardStats = async (req, res) => {
    try {
        const guestUsers = await User.countDocuments({ isGuest: true });
        const signupUsers = await User.countDocuments({ isGuest: false });
        const totalUser = await User.countDocuments()
        const partners = await Partner.countDocuments();


        const transactions = await Payment.find(
            { transactionType: "SUCCESS" },
            { amount: 1 }
        );


        const totalAmount = transactions.reduce(
            (sum, t) => sum + (t.amount || 0),
            0
        );

        return res.status(200).json({
            success: true,
            message: "dashboard Stats successfully fatched",
            data: {
                guestUsers,
                signupUsers,
                partners,
                totalUser,
                totalTransactions: transactions.length,
                totalAmount,
            },
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
        });
    }
};

exports.recentUser = async (req, res) => {
    try {
        const users = await User.find()
            .select("ip _id name age gender isGuest createdAt lookingFor")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const usersWithExtras = users.map((user) => ({
            ...user,
            timeAgo: getTimeAgo(user.createdAt),
            accountType: user.isGuest ? "Guest" : "Signup",
        }));

        return res.status(200).json({
            success: true,
            message: "Recent users successfully fetched",
            data: usersWithExtras,
        });
    } catch (error) {
        console.error("Recent User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent users",
        });
    }
};

exports.getUseById = async (req, res) => {


    const { id } = req.params

    try {

        const user = await User.findById(id)



        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "User not by this Id"
            })
        }


        return res.status(200).json({

            sucess: true,
            message: "User fatched successfully",
            user


        })



    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent users",
        });

    }
}

