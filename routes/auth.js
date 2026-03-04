import express from 'express';
import crypto from 'crypto';
import User from '../models/schemas/user.js';
import { sendEmail } from '../services/mailServices.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    const pwHash = crypto.createHash('sha256').update(password).digest('hex');

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).send('Email sudah terdaftar');
        }

        await User.create({ email, name, password: pwHash });
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send(err.message);
    }
});

function generateRandomPassword() {
  return Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
}

router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Email tidak ditemukan');
        }

        const newPassword = generateRandomPassword();
        const pwHash = crypto.createHash('sha256').update(newPassword).digest('hex');

        await User.updateOne({ email }, { password: pwHash });

        await sendEmail(email, "Password Baru", `Password baru Anda adalah: ${newPassword}`);

        res.json({ message: "Password baru telah dikirim ke email Anda" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
