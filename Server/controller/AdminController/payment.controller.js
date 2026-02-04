const Payment = require("../../models/transaction.model")


exports.getPaymentDashboardStats = async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: "$transactionType",
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        let initiatedAmount = 0;
        let successAmount = 0;
        let initiatedCount = 0;
        let successCount = 0;

        stats.forEach(item => {
            if (item._id === "PENDING") {
                initiatedAmount = item.totalAmount;
                initiatedCount = item.totalCount;
            }
            if (item._id === "SUCCESS") {
                successAmount = item.totalAmount;
                successCount = item.totalCount;
            }
        });

        return res.status(200).json({
            success: true,
            message: "Payment dashboard stats fetched successfully",
            data: {
                initiatedAmount,
                successAmount,
                totalAmount: initiatedAmount + successAmount

            }


        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


exports.recentPayment = async (req, res) => {
    try {
        const payments = await Payment.find().populate("userId")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const now = new Date();

        const recentPayments = payments.map(payment => {
            const diffMs = now - new Date(payment.createdAt);
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            let timeAgo = "";

            if (diffMinutes < 1) {
                timeAgo = "Just now";
            } else if (diffMinutes < 60) {
                timeAgo = `${diffMinutes} minutes ago`;
            } else if (diffHours < 24) {
                timeAgo = `${diffHours} hours ago`;
            } else {
                timeAgo = `${diffDays} days ago`;
            }

            return {
                ...payment,
                timeAgo
            };
        });

        return res.status(200).json({
            success: true,
            message: "Recent payments fetched successfully",
            data: recentPayments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


exports.last7daysPaymetGraph = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const payments = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: today },
          transactionType: { $in: ["PENDING", "SUCCESS"] }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata"
              }
            },
            type: "$transactionType"
          },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Build last 7 days array (IST)
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dayName = d.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "Asia/Kolkata"
      });

      const dateKey = d.toISOString().split("T")[0];

      weeklyData.push({
        date: dateKey,
        day: dayName,
        initiated: 0,
        success: 0
      });
    }

    payments.forEach(p => {
      const dayEntry = weeklyData.find(d => d.date === p._id.date);
      if (!dayEntry) return;

      if (p._id.type === "PENDING") {
        dayEntry.initiated += p.totalAmount;
      }

      if (p._id.type === "SUCCESS") {
        dayEntry.success += p.totalAmount;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Last 7 days payment graph fetched",
      data: weeklyData.map(({ date, ...rest }) => rest)
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

