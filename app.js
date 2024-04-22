import { config } from 'dotenv';
config();
import 'express-async-errors';
import express from 'express';
const app = express();

//connectDB
import connectDB from './db/connect.js';
import authenticateUser from './middleware/authentication.js';

//routers
import authRouter from './routes/auth.js';
import foodItemsRouter from './routes/food-items.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.use(express.json());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/food-items', authenticateUser, foodItemsRouter);
app.get('/', (req, res) => {
  res.send('food-items api');
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
