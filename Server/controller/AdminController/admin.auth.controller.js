const Admin = require("../../models/admin.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")



const JWT_SECRET = process.env.JWT_SECRET || "yoursupersecretkey";


exports.signUpAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin already exists with this email",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                userId: newAdmin._id,
                name: newAdmin.name,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            token,
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
            },
        });
    } catch (error) {
        console.error("Admin Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating admin",
        });
    }
};


exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        userId: admin._id,
        name: admin.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const adminData = admin.toObject();
    delete adminData.password;

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

