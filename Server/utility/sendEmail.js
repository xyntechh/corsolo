const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, 
            },
        });

        const mailOptions = {
            from: `"Corsolo" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
        return true;

    } catch (error) {
        console.log("Email error:", error);
        throw new Error("Email not sent");
    }
};

module.exports = sendEmail;