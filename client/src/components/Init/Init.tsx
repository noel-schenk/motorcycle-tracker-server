import React, { FC } from 'react';
import { useDatabase } from '../../useDatabase';

import Data from '../Data/Data';
import Login from '../Login/Login';
import Notification from '../Notification/Notification';

import styles from './Init.module.scss';

interface InitProps {}

const Init: FC<InitProps> = () => {
  return (
    <div className={styles.Init}>
      {useDatabase((db) => db.db) ? (
        <>
          <Data />
          <Notification />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Init;
