const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Partner = require("../models/Partner.model.js")
const sendEmail = require("../utility/sendEmail.js")
const crypto = require("crypto");
const dotenv = require("dotenv");
const FriendRequest = require("../models/FriendRequest.js")
const { Server } = require("socket.io");

const {
  getIO,
  onlineUsers,
} = require("./../socket/socketManager.js");



dotenv.config();






// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "yoursupersecretkey";

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, dob, gender, lookingFor } = req.body;

    const ip = req.clientIP;

    // Validation
    if (!ip || !name || !dob || !gender) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }


    // Create new user
    const newUser = await User.create({
      ip,
      name,
      dob,
      gender,
      lookingFor,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, lookingFor: lookingFor, isGuest: true },
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
          dob: newUser.dob,
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


//SINGUP IS UPDATE FOR NEW THEME AND PROFILE PICTURE LOGIC ARE PENDIG HERE
exports.signUp = async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      email,
      phone,
      password,
      profilePicture,
      bio,
      country,
      state,
      city,
      lookingFor,
      interestsIn,
      yourInterests,
      refferdBy,
    } = req.body;

    const ip = req.clientIP;

    // Validation
    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!dob) missingFields.push("dob");
    if (!gender) missingFields.push("gender");
    if (!phone) missingFields.push("phone");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!bio) missingFields.push("bio");
    if (!country) missingFields.push("country");
    if (!state) missingFields.push("state");
    if (!city) missingFields.push("city");
    if (!lookingFor) missingFields.push("lookingFor");
    if (!interestsIn) missingFields.push("interestsIn");
    if (!yourInterests) missingFields.push("yourInterests");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Phone number already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      ip,
      name,
      dob,
      gender,
      email,
      phone,
      password: hashedPassword,
      profilePicture,
      bio,
      country,
      state,
      city,
      lookingFor,
      interestsIn,
      yourInterests,
      isGuest: false,
      refferdBy,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        name: newUser.name,
        lookingFor: newUser.lookingFor,
        isGuest: false
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Referral Signup Count
    if (refferdBy) {
      const partner = await Partner.findOne({
        referralCode: refferdBy,
      });

      if (partner) {
        partner.totalSignups = (partner.totalSignups || 0) + 1;
        await partner.save();
      }
    }


    return res.status(201).json({
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
          phone: newUser.phone,
          profilePicture: newUser.profilePicture,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
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

    console.log(password)

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(user)


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


// FORGET PASSWORD AND RESET PASSWORD EMAIL LOGIC
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //  RANDOM TOKEN (better than direct JWT)
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //  SAVE IN DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    //  LINK
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const emailBody = `
  <div style="font-family: Arial, sans-serif; background: #0f172a; padding: 20px;">
    
    <div style="max-width: 500px; margin: auto; background: linear-gradient(135deg, #6d28d9, #ec4899); padding: 2px; border-radius: 16px;">
      
      <div style="background: #1e293b; border-radius: 14px; padding: 30px; text-align: center;">
        
        <h2 style="color: #fff; margin-bottom: 10px;">
          Reset Your Password
        </h2>
        
        <p style="color: #cbd5f5; font-size: 14px;">
          Hi ${user.name},<br/>
          We received a request to reset your password.
        </p>

        <a href="${resetLink}" 
           style="
             display: inline-block;
             margin-top: 20px;
             padding: 12px 24px;
             background: linear-gradient(90deg, #ec4899, #a855f7);
             color: #000;
             font-weight: bold;
             text-decoration: none;
             border-radius: 10px;
           ">
          Reset Password
        </a>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
          This link will expire in 1 hour.
        </p>

        <p style="color: #64748b; font-size: 11px; margin-top: 10px;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>
    </div>

  </div>
`;

    await sendEmail(user.email, "Password Reset", emailBody);

    return res.status(200).json({
      success: true,
      message: "Reset link sent",
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// RESET PASSWORD AND VERIFY TOKEN LOGIC
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // URL se aayega
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    //  HASH TOKEN (same as saved)
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    //  FIND USER
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // expiry check
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    //  HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //  REMOVE TOKEN (single use)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.pendingFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get all pending friend requests
    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Pending Friend Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    console.log(requestId)


    // Validation
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }


    // Find request
    const request = await FriendRequest.findById(requestId);


    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }


    // Check current user is receiver
    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot accept this request",
      });
    }


    // Check status
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`,
      });
    }


    // Update status
    request.status = "accepted";

    await request.save();



    // Add friend both users

    await User.findByIdAndUpdate(
      request.sender,
      {
        $addToSet: {
          friends: request.receiver,
        },
      }
    );


    await User.findByIdAndUpdate(
      request.receiver,
      {
        $addToSet: {
          friends: request.sender,
        },
      }
    );


    const senderSocketId = onlineUsers.get(request.sender.toString());
    const io = getIO();

    if (senderSocketId) {
      io.to(senderSocketId).emit("friendRequestAccepted", {
        requestId: request._id,
        senderId: request.sender,
        receiverId: request.receiver,
        message: "Your friend request has been accepted",
      });
    }




    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
      request,
    });


  } catch (error) {

    console.error("acceptFriendRequest:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};


exports.rejectFriendRequest = async (req, res) => {
  try {

    const { requestId } = req.params;
    const userId = req.user.userId;



    // Validation
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }



    const request = await FriendRequest.findById(requestId);



    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }



    // Only receiver can reject

    if (request.receiver.toString() !== userId.toString()) {

      return res.status(403).json({
        success: false,
        message: "You cannot reject this request",
      });

    }



    if (request.status !== "pending") {

      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`,
      });

    }



    // Update status

    request.status = "rejected";

    await request.save();



    return res.status(200).json({

      success: true,
      message: "Friend request rejected",
      request

    });



  } catch (error) {

    console.error("rejectFriendRequest:", error);


    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};


exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .populate("friends", "name profilePicture");

    const friends = user.friends.map((friend) => ({
      ...friend.toObject(),
      online: onlineUsers.has(friend._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




