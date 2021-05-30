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
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '..', 'public')));
app.set('views', join(__dirname, '..', 'public/views'));
app.set('view engine', 'hbs');

app.use('/v1', indexRouter);

app.get('/*', (req, res) => res.json({ message: 'Welocome to Mock FB' }));

app.post('/*', (req, res) => res.json({ message: 'Welocome to Mock FB' }));

// global async handler
app.use((error, req, res, next) => {
  log(error);
  let code = 500;
  let message = 'Oops! An error occurred on our server. Please retry.';
  if (error.code === 'LIMIT_FILE_SIZE') {
    code = 400;
    message = 'File too large';
  }
  return res.status(code).json({ status: false, message });
});

export default app;
