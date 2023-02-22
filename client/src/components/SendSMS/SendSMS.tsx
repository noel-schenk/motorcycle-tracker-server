import { Button } from '@mui/material';
import React, { FC } from 'react';
import config from '../../config';
import styles from './SendSMS.module.scss';

interface SendSMSProps {
  message: string;
  children: string | JSX.Element | JSX.Element[];
}

const SendSMS: FC<SendSMSProps> = ({ message, children }) => (
  <Button
    className={styles.SendSMS}
    href={`sms:${config.tracker.phoneNumber}?&body=${encodeURIComponent(
      message
    )}`}
  >
    {children}
  </Button>
);

export default SendSMS;
