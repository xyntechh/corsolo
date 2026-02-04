const Partner = require("../../models/Partner.model")



const getTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day ago`;
};

exports.partnerStats = async (req, res) => {
  try {

    const totalPartner = await Partner.countDocuments();
    const activePartner = await Partner.countDocuments({ isActive: true });


    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);


    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);


    const thisMonthJoined = await Partner.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Partner stats fetched successfully",
      data: {
        totalPartner,
        activePartner,
        thisMonthJoined,
      },
    });
  } catch (error) {
    console.error("Partner Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch partner statistics",
    });
  }
};

exports.RecentJoinPartner = async (req, res) => {
  try {
    const partners = await Partner.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const partnersWithTimeAgo = partners.map((partner) => ({
      ...partner,
      timeAgo: getTimeAgo(partner.createdAt),
    }));

    return res.status(200).json({
      success: true,
      message: "Recent joined partners fetched successfully",
      data: partnersWithTimeAgo,
    });
  } catch (error) {
    console.error("Recent Join Partner Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent joined partners",
    });
  }
};

exports.getPartnerById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      success: false,
      message: "Id is required",
    });

  }

  try {
    const partner = await Partner.findById(id).lean();

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Partner fetched successfully",
      data: partner,
    });

  } catch (error) {
    console.error("Get Partner By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch partner",
    });
  }
};


