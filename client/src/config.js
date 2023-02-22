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
  vapid: {
    public:
      'BOmSAeUN7SWrJYUQOX3ofeDWVLIIuXF6DAqimqdr0yx7rKmIXGcqhDS9ISgIAbdbnmtXFLLW3m2pJ1B965Yr-fM',
  },
  server: {
    baseURL: process.env.REACT_APP_SERVER_BASEURL,
  },
  tracker: {
    phoneNumber: process.env.REACT_APP_PHONE_NUMBER,
  },
};
