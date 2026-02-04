const Partner = require("../models/Partner.model.js")
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



//JWT SECRET
const JWT_SECRET = process.env.JWT_SECRET || "yoursupersecretkey";



//RANDOM CODE GENRRATER FOR EVERY NEW PARTNER 
function generateReferralCode(name) {
    return (
        name.slice(0, 3).toUpperCase() +
        crypto.randomBytes(2).toString("hex").toUpperCase()
    );
}


//CREATE PARTNER 
exports.createPartner = async (req, res) => {
    try {
        const {
            name,
            handle,
            handleUserName,
            handleLink,
            email,
            upiId,
            phone,
            password
        } = req.body;

        let missingField = [];

        if (!name) missingField.push("name");
        if (!handle) missingField.push("handle");
        if (!handleUserName) missingField.push("handleUserName");
        if (!handleLink) missingField.push("handleLink");
        if (!email) missingField.push("email");
        if (!phone) missingField.push("phone");
        if (!password) missingField.push("password");

        if (missingField.length > 0) {
            return res.status(400).json({
                success: false,
                message: missingField
            });
        }


        const existingEmail = await Partner.findOne({ email })

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "This is Email in already In Used"
            });
        }



        const existingPhone = await Partner.findOne({ phone })

        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "This is Phone in already In Used"
            });
        }

        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);




        const referralCode = generateReferralCode(name);
        const referralLink = `https://corsolo.com/?ref=${referralCode}`;

        const newPartner = await Partner.create({
            name,
            handle,
            handleUserName,
            handleLink,
            email,
            upiId,
            phone,
            password: hashedPassword,
            referralCode,
            referralLink
        });

        const token = jwt.sign(
            { userId: newPartner._id, name: newPartner.name },
            JWT_SECRET,
            { expiresIn: "7d" } // token valid for 7 days
        );

        return res.status(201).json({
            success: true,
            message: "Partner successfully created",
            newPartner,
            token


        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
};


//LOGIN PARNTER
exports.loginPartner = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const partner = await Partner.findOne({ email });

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found",
            });
        }

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                userId: partner._id,
                role: "partner",
                name: partner.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const partnerData = partner.toObject();
        delete partnerData.password;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: partnerData,
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


//GET LOGIN PARTNER INFORMATION 
exports.getInformation = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const partner = await Partner.findById(userId);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const partnerData = partner.toObject();
    delete partnerData.password;

    return res.status(200).json({
      success: true,
      message: "Partner information fetched successfully",
      partner: partnerData,
    });

  } catch (error) {
    console.error("Get partner info error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





