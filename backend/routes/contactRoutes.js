import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

router.post('/contact', (req, res) => {
    const { subject, message } = req.body;
    if (!subject || !message) {
        return res.status(400).send('Subject and message are required');
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'your-receiving-email@example.com',
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

export default router;
