// import { Post } from './models/index.js';
// import session from 'express-session';

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import User from "./models/schemas/user.js";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";

const app = express();
const JWT_SECRET = "SECRET_JWT_KEY";
const mongoURI =
  "mongodb+srv://rizzfatah_db_user:dbMonggo@cluster0.wb0yarb.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

// 1. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

// 2. SESSION CONFIG
// app.use(session({
//     secret: 'secret_cobaaa', 
//     resave: false,
//     saveUninitialized: false
// }));

// 3. PASSPORT INIT
app.use(passport.initialize());
// app.use(passport.session()); // Tidak dipakai karena tidak pakai session

// 4. LOCAL STRATEGY (LOGIN)
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user)
          return done(null, false, { message: "User not found" });

        const hash = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");

        if (hash !== user.password)
          return done(null, false, { message: "Wrong password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 5. JWT STRATEGY (Versi Cookie)
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
      return done(null, payload);
    }
  )
);

// 6. GLOBAL JWT AUTO LOGIN 
app.use((req, res, next) => {
  if (!req.cookies.token) {
    return next();
  }
  passport.authenticate("jwt", { session: false })(req, res, next);
});

// 7. CONNECT MONGODB
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// 8. ROUTES
app.use("/auth", authRouter);
// LOGIN → SAVE JWT IN COOKIE
app.post("/login",  passport.authenticate("local", { session: false }),  (req, res) => {
    const payload = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login successful (JWT saved in cookie)" });
  }
);

// LOGOUT JWT VERSION
app.get("/logout", (req, res) => {
  res.cookie("token", null, { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});


// SESSION LOGOUT VERSION (TIDAK DIPAKAI - REFERENSI)

// app.get('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) return next(err);
//         res.redirect('/');
//     });
// });

// PROTECT NOTES ROUTE (JWT REQUIRED)
function jwtRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Login required" });
  }
  next();
}

// Versi Header
// function jwtRequired(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: "Token tidak ada" });
//   }
//
//   const token = authHeader.split(" ")[1];
//
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Token tidak valid" });
//   }
// }


// Protect Notes
app.use("/notes", jwtRequired, notesRouter);

// app.use("/notes", notesRouter); // versi tanpa proteksi (referensi)
// app.use("/notes", loginRequired, notesRouter); // session version (referensi)

// ROUTE Awal
app.get("/", (req, res) =>
  res.send("Fatah Rizqi | Lionel Messi Champion Of The World!")
);

// ERROR HANDLING
app.use((req, res) => {
  res.status(404).send("Maaf, halaman tidak ditemukan!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Terjadi Kesalahan Server: " + err.message);
});

// LISTEN
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

export default app;