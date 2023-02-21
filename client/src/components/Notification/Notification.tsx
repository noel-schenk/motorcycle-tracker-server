import React, { FC, useEffect } from 'react';
import styles from './Notification.module.scss';
import config from '../../config';
import { urlBase64ToUint8Array } from '../../Utility';

interface NotificationProps {}

const Notification: FC<NotificationProps> = () => {
  useEffect(() => {
    const publicVapidKey = config.vapid.public;

    if ('serviceWorker' in navigator) {
      console.log('Registering service worker');

      run().catch((error) => console.error(error));
    }

    async function run() {
      console.log('Registering service worker');
      navigator.serviceWorker.register('/worker.js', {
        scope: '/',
      });

      await navigator.serviceWorker.ready.then(async (registration) => {
        console.log('Registered service worker');

        console.log('Registering push');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        console.log('Registered push');

        console.log('Register subscription');
        await fetch(`${config.server.baseURL}/api?subscribe`, {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'content-type': 'application/json',
          },
        });
        console.log('Registered subscription');
      });
    }
  }, []);

  return <div className={styles.Notification}>Notification Component</div>;
};

export default Notification;
