import express, { json, urlencoded, Router } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';

const app = express();
const router = Router();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/v1', indexRouter);

router.get('/*', (req, res) => {
  res.render('index', { title: 'Express' });
});
router.post('/*', (req, res) => {
  res.render('index', { title: 'Express' });
});

export default app;
