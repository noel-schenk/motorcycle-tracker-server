import { Button, Typography } from '@mui/material';
import { ref, onValue, Database } from '@firebase/database';
import React, { FC, useEffect, useState } from 'react';
import { useDatabase } from '../../useDatabase';
import styles from './Data.module.scss';
import config from '../../config';
import SendSMS from '../SendSMS/SendSMS';

interface DataProps {}

const Data: FC<DataProps> = () => {
  const [data, setData] = useState({} as any);
  const [picture, setPicture] = useState('');

  const [mapURL, setMapURL] = useState('');

  const db = useDatabase.getState().db as Database;

  useEffect(() => {
    const on = (item: string, cb: any) =>
      onValue(ref(db, item), (data) => {
        console.log(data, 'data');
        cb(data.val());
      });

    on('data', (val: any) => setData(JSON.parse(val)));
    on('picture', setPicture);
  }, [setData, setPicture]);

  useEffect(() => {
    setMapURL(getMapURL({ lat: data.lat, long: data.long }));
  }, [data]);

  return (
    <div className={styles.Data}>
      <Typography component="h1" variant="h5">
        Find my Motorcycle Data:
      </Typography>

      <div className={styles.Actions}>
        <SendSMS message={'#OFF'}>Deactivate Data and GPS</SendSMS>
        <SendSMS message={'#LOCATION'}>Get current Location</SendSMS>
        <SendSMS message={'#ARM'}>Arm Bike</SendSMS>
        <SendSMS message={'#UNARM'}>UnArm Bike</SendSMS>
        <SendSMS message={'#FOTO'}>Take a Picture</SendSMS>
      </div>

      <img
        src={`data:image/jpeg;charset=utf-8;base64, ${decodeURI(picture)}`}
      />

      <iframe className={styles.DataIframe} src={mapURL}></iframe>

      <Typography component="p" className={styles.DataText}>
        Accuracy: [🎯 {JSON.stringify(data?.accuracy)} m]
        <br />
        Speed: [⚡ {JSON.stringify(data?.speed)} km/h]
        <br />
        Battery: [🔋 {data.battery}%]
        <br />
        Armed: [🪖 {data.armed}]<br />
        Data: [📊 {JSON.stringify(data)}]<br />
      </Typography>
    </div>
  );
};

export default Data;

const getMapURL = (location: any) => {
  return `https://maps.google.com/maps?q=${location?.lat},${location?.long}&output=embed`;
};
