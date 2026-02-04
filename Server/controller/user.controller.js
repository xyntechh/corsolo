const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Partner = require("../models/Partner.model.js")

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "yoursupersecretkey";

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, age, gender, lookingFor } = req.body;

    const ip = req.clientIP;

    // Validation
    if (!ip || !name || !age || !gender) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }


    // Create new user
    const newUser = await User.create({
      ip,
      name,
      age,
      gender,
      lookingFor,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, lookingFor: lookingFor },
      JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          age: newUser.age,
          gender: newUser.gender,
          lookingFor: newUser.lookingFor,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, age, gender, lookingFor, phone, email, password, refferdBy } = req.body;

    const ip = req.clientIP;

    // Validation
    let missingFiled = []

    if (!name) missingFiled.push("name")
    if (!age) missingFiled.push("age")
    if (!gender) missingFiled.push("gender")
    if (!phone) missingFiled.push("phone")
    if (!email) missingFiled.push("email")
    if (!password) missingFiled.push("password")

    if (!missingFiled.length == 0) {
      return res.status(400).json({
        missingFiled
      })
    }

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);


    const existingEmail = await User.findOne({ email })


    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already exists"
      })
    }



    // Create new user
    const newUser = await User.create({
      ip,
      name,
      age,
      gender,
      lookingFor,
      email,
      phone,
      isGuest: false,
      password: hashedPassword,
      refferdBy
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, lookingFor: lookingFor },
      JWT_SECRET,
      { expiresIn: "7d" }
    );


    //ADD SINGUP COUNT IN PARTNER

    const partner = await Partner.findOne({ referralCode: refferdBy })


    if (partner) {
      partner.totalSignups = (partner.totalSignups || 0) + 1;
      await partner.save();
    }




    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          age: newUser.age,
          gender: newUser.gender,
          lookingFor: newUser.lookingFor,
          email: newUser.email,
          phone: newUser.phone

        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    const allowedFields = [
      "ip",
      "name",
      "age",
      "gender",
      "lookingFor",
      "password",
      "email",
      "isGuest"
    ];

    const updateData = {};

    // pick only allowed fields
    for (let field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }

    // Case: No fields provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    // If password comes → Hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUserInfo = async (req, res) => {

  try {
    const userId = req.user.userId;


    //FINDNG USER 
    const user = await User.findById(userId)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not Found in data base ",
      });

    }

    return res.status(200).json({
      success: true,
      message: "User Info fatched successfully!",
      user: user,
    });



  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
}

exports.debitUserCoin = async (req, res) => {
  try {
    const userId = req.user?.userId; // coming from auth middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // accept amount either via params or body (prefer body for non-idempotent ops)
    const amountParam = req.params.coin ?? req.body.coin;
    const amount = Number(amountParam);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid coin amount. Provide a positive number.' });
    }

    // Atomic update: decrement only if user has enough coins
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, coin: { $gte: amount } },    // condition ensures sufficient balance
      { $inc: { coin: -amount } },               // atomic decrement
      { new: true, runValidators: true }         // return updated document
    ).select('-password'); // hide sensitive fields if any

    if (!updatedUser) {
      // Could be user not found OR insufficient coins
      // Check which for clearer message
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(400).json({ success: false, message: 'Insufficient coin balance' });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully debited ${amount} coin(s).`,
      user: updatedUser,
    });
  } catch (err) {
    console.error('debitUserCoin error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Create token with SAME DATA as register
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        lookingFor: user.lookingFor,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



