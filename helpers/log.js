import { config } from 'dotenv';
import debug from 'debug';

config();

const log = debug('tql:logs');

export default log;
