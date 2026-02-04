const Partner = require("../models/Partner.model")


exports.catchRefferalClicks = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Referral code not provided",
    });
  }

  try {
   
    const partner = await Partner.findOne({ referralCode: code });

    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Invalid referral code",
      });
    }

    
    partner.totalVisits = (partner.totalVisits || 0) + 1;

    await partner.save();

    return res.status(200).json({
      success: true,
      message: "Referral click counted",
    });
  } catch (error) {
    console.error("Referral Click Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
