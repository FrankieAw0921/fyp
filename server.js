import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// SMS Endpoint
app.post('/send-sms', async (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: "Missing phoneNumber or message" });
    }

    try {
        const response = await twilioClient.messages.create({
            body: message,
            from: twilioNumber,
            to: phoneNumber
        });
        res.json({ success: true, sid: response.sid });
    } catch (error) {
        console.error("Twilio Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
