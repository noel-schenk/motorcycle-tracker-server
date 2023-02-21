import express from "express";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import config from "./config.js";

import webpush from "web-push";
import bodyParser from "body-parser";

export const initDatabase = async () => {
  const app = initializeApp(config.firebaseConfig);

  const auth = getAuth(app);

  await signInWithEmailAndPassword(
    auth,
    config.auth.email,
    config.auth.password
  );

  return getDatabase(app);
};

export const checkAuth = (req) => {
  if (req.query.hash !== config.hash.write) {
    return false;
  }
  return true;
};

export const listenForURL = (exServer, db) => {
  const _listenForAPI = listenForAPI(exServer, db);
  const _listenForNotifications = listenForNotifications(exServer, db);
  exServer.all("/api", (req, res) => {
    _listenForAPI(req, res);
    _listenForNotifications(req, res);
  });
};

export const listenForAPI = (exServer, db) => {
  return (req, res) => {
    if (!checkAuth(req, res)) return;

    if (req.query.notify !== undefined) {
      sendNotification(db, {
        title: "NEW ALERT ⚠️",
        body: req.query.body,
        icon: "/motorcycle.png",
      });
      res.sendStatus(200);
      return;
    }

    if (req.query.set !== undefined) {
      set(ref(db, req.query.key), req.query.value);
      res.sendStatus(200);
      return;
    }

    if (req.query.get !== undefined) {
      const refValue = ref(db, req.query.key);

      get(refValue).then((data) => {
        res.send(data.val());
        return;
      });
    }
  };
};

const listenForNotifications = (exServer, db) => {
  webpush.setVapidDetails(
    "mailto:noreply@idhren.com",
    config.vapid.public,
    config.vapid.private
  );

  exServer.use(bodyParser.json());

  return (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", config.client.baseURL);
    res.header("Access-Control-Allow-Headers", "*");

    const subscription = req.body;
    res.status(201).json({});

    if (!subscription.endpoint) {
      return;
    }

    // oneliner was unreadable
    const endpointBuffer = Buffer.from(subscription.endpoint);
    const subscriptionKey = endpointBuffer.toString("base64");
    const subscriptionPath = `endpoints/${subscriptionKey}`;
    const subscriptionRef = ref(db, subscriptionPath);
    set(subscriptionRef, subscription);
  };
};

const sendNotification = (db, payloadData) => {
  const endpointsRef = ref(db, "endpoints");

  get(endpointsRef).then((endpoints) => {
    Object.values(endpoints.val()).forEach((subscription) => {
      const payload = JSON.stringify(payloadData);

      console.log(payload, "payload");

      webpush.sendNotification(subscription, payload).catch((error) => {
        console.error(error.stack);
      });
    });
  });
};

// START SERVER

const exServer = express();

const db = await initDatabase();

listenForURL(exServer, db);

export default exServer;
