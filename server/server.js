import express from 'express';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import config from './config.js';

console.log(config);

const firebaseConfig = config.firebaseConfig;

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

await signInWithEmailAndPassword(auth, config.auth.email, config.auth.password);

const db = getDatabase(app);

const exServer = express();

exServer.get('/', function (req, res) {
  if (req.query.set !== undefined) {
    if (req.query.hash !== config.hash.write) {
      res.sendStatus(403);
      return;
    }

    set(ref(db, req.query.key), req.query.value);
    res.send();
    return;
  }

  if (req.query.get !== undefined) {
    if (req.query.hash !== config.hash.read) {
      res.sendStatus(403);
      return;
    }

    const refValue = ref(db, req.query.key);
    onValue(refValue, (data) => {
      res.send(data.val());
    });
    return;
  }

  res.sendStatus(404);
});

exServer.listen(4200);
