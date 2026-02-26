import express from "express";
import notesRouter from "./routes/notes.js";
import mongoose from 'mongoose';
import { Post } from './models/index.js';

const app = express()
const mongoURI = 'mongodb+srv://rizzfatah_db_user:dbMonggo@cluster0.wb0yarb.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(async () => { 
    console.log('✅ Berhasil terhubung ke MongoDB');

    //Create Post MongoDB
    // const checkData = await Post.findOne({ title: 'first title' });
    // if (!checkData) { 
    //    await Post.create({
    //      title: 'first title',
    //      content: 'second title',
    //    });
    //    console.log('🚀 Data awal berhasil dibuat otomatis!');
    // }
  })
  .catch((err) => {
    console.error('❌ Gagal koneksi ke MongoDB:', err);
  });

app.use((req, res, next) => {

  if (false) {
    next(new Error('Not Authorized'));
    return;
  }
  next();
});

 app.get('/', (req, res) =>{
res.send('Fatah Rizqi | Lionel Messi Champion Of The World!');
});

app.get('/messi', (req, res) =>{
res.send('Argentina Champion Of The World!');
});

app.get('/bilang/:hoga', (req, res) => {
    const { hoga } = req.params;
    res.send(hoga + "Amazing");
});

app.get('/say/:greeting', (req, res) => {
    const { greeting } = req.params;
    res.send(greeting);
});

app.get('/gabisa', (req, res) => {
  res.status(401).send('gabisa nih');
});


app.use((req, res, next) => {
  console.log(`Request ${req.path} - harus lewat sini`);
  next();
});

app.use(express.json());

app.use("/notes", notesRouter);

app.use((err, req, res, next) =>{
  res.send('Error Occurred');
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

export default app;