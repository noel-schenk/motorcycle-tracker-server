import { Typography } from '@mui/material';
import { ref, onValue, Database } from '@firebase/database';
import React, { FC, useEffect, useState } from 'react';
import { useDatabase } from '../../useDatabase';
import styles from './Data.module.scss';

interface DataProps {}

const Data: FC<DataProps> = () => {
  const [location, setLocation] = useState({} as any);
  const [picture, setPicture] = useState('');
  const [battery, setBattery] = useState('');
  const [armed, setArmed] = useState('');

  const [mapURL, setMapURL] = useState('');

  const db = useDatabase.getState().db as Database;

  useEffect(() => {
    const on = (item: string, cb: any) =>
      onValue(ref(db, item), (data) => {
        console.log(data, 'data');
        cb(data.val());
      });

    on('location', (val: any) => setLocation(JSON.parse(val)));
    on('picture', setPicture);
    on('battery', setBattery);
    on('armed', setArmed);
  }, [setLocation, setPicture, setBattery, setArmed]);

  useEffect(() => {
    setMapURL(getMapURL(location));
  }, [location]);

  return (
    <div className={styles.Data}>
      <Typography component="h1" variant="h5">
        Find my Motorcycle Data:
      </Typography>

      <img
        src={`data:image/jpeg;charset=utf-8;base64, ${decodeURI(picture)}`}
      />

      <iframe className={styles.DataIframe} src={mapURL}></iframe>

      <Typography component="p">
        Location: [{JSON.stringify(location)}]<br />
        Accuracy: [{JSON.stringify(location?.accuracy)}]<br />
        Speed: [{JSON.stringify(location?.speed)}]<br />
        Battery: [{battery}]<br />
        Armed: [{armed}]
      </Typography>
    </div>
  );
};

export default Data;

const getMapURL = (location: any) => {
  return `https://maps.google.com/maps?q=${location?.lat},${location?.long}&output=embed`;
};
