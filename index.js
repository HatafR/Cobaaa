import express from "express";
import notesRouter from "./routes/notes.js";
import mongoose from 'mongoose';
import { Post } from './models/index.js';
import cors from "cors";
// Import untuk Passport dan Session
import passport from 'passport';
import session from 'express-session';
import authRouter from './routes/auth.js'; 
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/schemas/user.js'; 
import crypto from 'crypto';

const app = express();
const mongoURI = 'mongodb+srv://rizzfatah_db_user:dbMonggo@cluster0.wb0yarb.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0';

// 1. MIDDLEWARE Dasar
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({ origin: "*" }));

// 2. KONFIGURASI SESSION
app.use(session({
    secret: 'secret_cobaaa', 
    resave: false,
    saveUninitialized: false
}));

// 3. PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

// 4. PASSPORT LOCAL STRATEGY
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'The member could not be found.' });

        // Verifikasi SHA256 murni
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        
        if (hash === user.password) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'The password does not match.' });
        }
    } catch (err) { 
        return done(err); 
    }
}));

passport.serializeUser((user, callback) => callback(null, user));
passport.deserializeUser((obj, callback) => callback(null, obj));

// 5. KONEKSI MONGODB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Berhasil terhubung ke MongoDB'))
  .catch((err) => console.error('❌ Gagal koneksi ke MongoDB:', err));

// 6. ROUTES
app.use('/auth', authRouter); 

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send("Login Berhasil! Selamat datang " + req.user.name);
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Middleware Pengecek Login
function loginRequired(req, res, next) {
    if (!req.user) {
        return res.status(401).send('Login required');
    }
    next();
}

app.use("/notes", loginRequired, notesRouter);

app.get('/', (req, res) => res.send('Fatah Rizqi | Lionel Messi Champion Of The World!'));

// 7. ERROR HANDLING (DIREVISI)
// Middleware untuk menangani 404 (Halaman tidak ditemukan)
app.use((req, res, next) => {
    res.status(404).send('Maaf, halaman tidak ditemukan!');
});

// Middleware Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log eror di console untuk debugging
    res.status(500).send('Terjadi Kesalahan Server: ' + err.message);
});

// 8. LISTEN
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});

export default app;