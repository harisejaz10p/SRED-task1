import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());


app.use('/api/github', githubRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});