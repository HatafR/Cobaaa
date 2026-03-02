import express from 'express';
import crypto from 'crypto';
import User from '../models/schemas/user.js';

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

export default router;
