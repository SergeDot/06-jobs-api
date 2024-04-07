import { config } from 'dotenv';
config();
import 'express-async-errors';
import express from 'express';
const app = express();

// extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

//connectDB
import connectDB from './db/connect.js';
import authenticateUser from './middleware/authentication.js';

//routers
import authRouter from './routes/auth.js';
import foodItemsRouter from './routes/food-items.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.set('trust proxy', 1);
app.use(rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 100
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/food-items', authenticateUser, foodItemsRouter);
app.get('/', (req, res) => {
  res.send('Calorie Tracker API');
});

app.get('/api/v1/auth/login', (req, res) => {
  res.send('API V1 Auth Test');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI, console.log('Connected to the DB'));
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
})();
