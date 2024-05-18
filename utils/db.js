import { connect as _connect } from 'mongoose';
import { dbUri } from '../config/config.js';

const connect = () => {
  _connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error: ', err));
};

export default { connect };
