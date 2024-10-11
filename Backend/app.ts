import dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './helpers/connect-db';
import express from 'express';
import bodyParser from 'body-parser';
import { EXTERNAL_AUTH_BASE_URL } from './constants/constants';
import routes from './routes/external-auth.route';
import cors from 'cors';

(async () => {
  await connectDb(); 
})();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(EXTERNAL_AUTH_BASE_URL, routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});