import { Typography } from '@mui/material';
import { ref, onValue, Database } from '@firebase/database';
import React, { FC, useEffect, useState } from 'react';
import { useDatabase } from '../../useDatabase';
import styles from './Data.module.scss';

interface DataProps {}

const Data: FC<DataProps> = () => {
  const [location, setLocation] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [speed, setSpeed] = useState('');
  const [picture, setPicture] = useState('');
  const [battery, setBattery] = useState('');
  const [armed, setArmed] = useState('');

  const db = useDatabase.getState().db as Database;

  useEffect(() => {
    const on = (item: string, cb: any) =>
      onValue(ref(db, item), (data) => {
        cb(data.val());
      });

    on('location', setLocation);
    on('accuracy', setAccuracy);
    on('speed', setSpeed);
    on('picture', setPicture);
    on('battery', setBattery);
    on('armed', setArmed);
  }, []);

  return (
    <div className={styles.Data}>
      <Typography component="h1" variant="h5">
        Find my Motorcycle Data:
      </Typography>
      <Typography component="p">
        Location: [{location}]<br />
        Accuracy: [{accuracy}]<br />
        Speed: [{speed}]<br />
        Picture: [{picture}]<br />
        Battery: [{battery}]<br />
        Armed: [{armed}]
      </Typography>
    </div>
  );
};

export default Data;
