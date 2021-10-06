const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./db/connect');

require('dotenv').config();
require('express-async-errors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://wizardly-nightingale-2253f3.netlify.app',
    ],
  })
);
app.use(helmet());

const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/verifyAuth');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/boards');
const cardRouter = require('./routes/card');
const listRouter = require('./routes/list');
const commentRouter = require('./routes/comment');

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to trello clone!' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authMiddleware, userRouter);
app.use('/api/v1/boards', authMiddleware, boardRouter);
app.use('/api/v1/lists', authMiddleware, listRouter);
app.use('/api/v1/cards', authMiddleware, cardRouter);
app.use('/api/v1/comments', authMiddleware, commentRouter);

app.use('*', notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
