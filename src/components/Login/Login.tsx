import { Button, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import React, { FC, useState } from 'react';
import styles from './Login.module.scss';

import { initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import config from '../../config.js';
import { useDatabase } from '../../useDatabase';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    const app = initializeApp(config.firebaseConfig);

    const appAuth = getAuth(app);

    signInWithEmailAndPassword(appAuth, email, password).then(() => {
      useDatabase.setState({ db: getDatabase(app) });
    });
  };

  return (
    <Paper className={styles.Login}>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <TextField
        label="Username"
        type="text"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <Button variant="contained" onClick={signIn}>
        Login
      </Button>
    </Paper>
  );
};

export default Login;
