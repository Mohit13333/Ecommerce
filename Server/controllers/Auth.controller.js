import { User } from "../model/User.js";
import { sanitizeUser, sendMail } from "../services/common.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.EXPIRY_ACCESS_TOKEN,
    });

    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.status(200).json({ id: user._id, role: user.role, token: token });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.EXPIRY_ACCESS_TOKEN,
    });

    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.status(200).json({ id: user._id, role: user.role, token: token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a secure token using bcrypt
    const token = bcrypt.genSaltSync(10); // Adjust rounds for simplicity if needed
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiry = Date.now() + 3600000; // Set expiry for 1 hour
    await user.save();

    // Create the reset password URL
    const resetPageLink = `https://click-shop-ecom.netlify.app/reset-password?token=${encodeURIComponent(
      token
    )}&email=${encodeURIComponent(email)}`;

    // Email details
    const subject = "Reset Password for E-commerce";
    const html = `<p style="font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
  Click the button below to reset your password. This link is valid for 1 hour.
</p>
<div style="text-align: center; margin-top: 20px;">
  <a href='${resetPageLink}' style="
    display: inline-block;
    padding: 15px 30px;
    font-size: 16px;
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    color: #ffffff;
    background-color: #1a82e2;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  ">
    Reset Password
  </a>
</div>
`;

    // Send email
    const mailInfo = await sendMail({ to: email, subject, html });

    // Respond to the client
    res.json({ message: "Password reset email sent", mailInfo });
  } catch (err) {
    console.error("Error in resetPasswordRequest:", err.message);

    res.status(500).json({
      error: "Error sending reset password email",
      details: err.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    if (!email || !password || !token) {
      return res
        .status(400)
        .json({ message: "Email, password, and token are required" });
    }

    const user = await User.findOne({ email, resetPasswordToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    const newToken = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.EXPIRY_ACCESS_TOKEN,
    });

    res
      .cookie("jwt", newToken, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .json({ message: "Password reset successful, new token issued." });
  } catch (err) {
    console.error("Error in resetPassword:", err.message);
    return res.status(500).json({
      error: "Error resetting password",
      details: err.message,
    });
  }
};
