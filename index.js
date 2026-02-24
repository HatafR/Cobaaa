import express from "express";

const app = express()

app.use((req, res, next) => {
//   console.log(`Request ${req.path} - harus lewat sini`);
  if (false) {
    next(new Error('Not Authorized'));
    return;
  }
  next();
});

 app.get('/', (req, res) =>{
res.send('Fatah Rizqi | Lionel Messi Champion Of The World!');
});

// app.get('/', (req, res) => {
//     res.send("OK");
// });

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


app.use((req, res, next) => {
  console.log(`Request ${req.path} - harus lewat sini`);
  next();
});

app.use((err, req, res, next) =>{
res.send('Error Occurred');
});

app.listen(3000)