
const User = require("../../models/user.model")


exports.userStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const guestUsers = await User.countDocuments({ isGuest: true });
    const signupUsers = await User.countDocuments({ isGuest: false });


    const ipStats = await User.aggregate([
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 },
        },
      },
    ]);


    const uniqueUsers = ipStats.length;
    const duplicateUsers = totalUsers - uniqueUsers;

    return res.status(200).json({
      success: true,
      message: "Dashboard stats successfully fetched",
      data: {
        totalUsers,
        uniqueUsers,
        duplicateUsers,
        guestUsers,
        signupUsers,
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

exports.last7DaysComparisson = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const stats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            ip: "$ip",
            isGuest: "$isGuest",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          uniqueUsers: { $sum: 1 },
          signupUsers: {
            $sum: {
              $cond: [{ $eq: ["$_id.isGuest", false] }, "$count", 0],
            },
          },
          guestUsers: {
            $sum: {
              $cond: [{ $eq: ["$_id.isGuest", true] }, "$count", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);


    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];

      const found = stats.find((s) => s._id === key);

      result.push({
        date: d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        uniqueUsers: found?.uniqueUsers || 0,
        signupUsers: found?.signupUsers || 0,
        guestUsers: found?.guestUsers || 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Last 7 days comparison fetched",
      data: result,
    });
  } catch (error) {
    console.error("Last 7 Days Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch last 7 days stats",
    });
  }
};

exports.avarageUserPerday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const dailyStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            ip: "$ip",
            isGuest: "$isGuest",
          },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          uniqueUsers: { $sum: 1 },
          signupUsers: {
            $sum: {
              $cond: [{ $eq: ["$_id.isGuest", false] }, 1, 0],
            },
          },
          guestUsers: {
            $sum: {
              $cond: [{ $eq: ["$_id.isGuest", true] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Sum totals
    let totalUnique = 0;
    let totalSignup = 0;
    let totalGuest = 0;

    dailyStats.forEach((d) => {
      totalUnique += d.uniqueUsers;
      totalSignup += d.signupUsers;
      totalGuest += d.guestUsers;
    });

    const days = 7;

    return res.status(200).json({
      success: true,
      message: "Average users per day calculated",
      data: {
        averageUniqueUsers: Math.round(totalUnique / days),
        averageSignupUsers: Math.round(totalSignup / days),
        averageGuestUsers: Math.round(totalGuest / days),
      },
    });
  } catch (error) {
    console.error("Average User Per Day Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate average users per day",
    });
  }
};

exports.getAllsignUpUser = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    
    const totalUsers = await User.countDocuments({ isGuest: false });

    
    const signupUsers = await User.find({ isGuest: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Signup users fetched successfully",
      data: signupUsers,
      pagination: {
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },
    });

  } catch (error) {
    console.error("Get Signup Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch signup users",
    });
  }
};
