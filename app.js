import express from "express";
import authRouter from './routes/auth.js'

const app = express()

app.get('/api/v1', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.use('/api/v1',authRouter)

const start = () => {
  try {
    app.listen(5000, () => {
      console.log('Server is listening on port 5000');
    });
  } catch (err) {
    console.log('Server failed to start', err);
  }
};

start();
