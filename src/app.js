import 'express-async-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debug from 'debug';

import indexRouter from './routes/index';

const log = debug('tql:server');

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '..', 'public')));
app.set('views', join(__dirname, '..', 'public/views'));
app.set('view engine', 'hbs');

app.use('/v1', indexRouter);

app.all('/*', (req, res) =>
  res.status(404).json({ status: false, message: 'This route does not exist' })
);

// global async handler
app.use((error, req, res, next) => {
  log(error);
  res
    .status(500)
    .json({ error: 'Oops! An error occurred on our server. Please retry.' });
});

export default app;
