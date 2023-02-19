import dotenv from 'dotenv';
dotenv.config();

export default {
  firebaseConfig: {
    apiKey: 'AIzaSyB51fRc9MFhg3feZI80tairVX3JpCb4GQM',
    authDomain: 'motorcycle-tracker-server.firebaseapp.com',
    databaseURL:
      'https://motorcycle-tracker-server-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'motorcycle-tracker-server',
    storageBucket: 'motorcycle-tracker-server.appspot.com',
    messagingSenderId: '196036965037',
    appId: '1:196036965037:web:6ebf577dfb08c86d230c24',
  },
  auth: {
    email: 'noel.schenk@outlook.com',
    password: process.env.AUTH_PASSWORD,
  },
  hash: {
    read: 'openForAnyone',
    write: process.env.HASH_WRITE,
  },
};
