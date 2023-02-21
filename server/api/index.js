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
  if (req.query.hash === config.hash.write) {
    return true;
  }
  return false;
};

export const listenForURL = (exServer, db) => {
  const _listenForAPI = listenForAPI(exServer, db);
  const _listenForNotifications = listenForNotificationRegistration(
    exServer,
    db
  );
  exServer.all("/api", (req, res) => {
    _listenForAPI(req, res);
    _listenForNotifications(req, res);
  });
};

export const listenForAPI = (exServer, db) => {
  console.log("init listenForAPI");
  return (req, res) => {
    console.log("checkAuth", checkAuth(req), req, config.hash.write);
    if (!checkAuth(req)) return;

    console.log("auth check OK", req.query);

    if (req.query.notify !== undefined) {
      sendNotification(
        db,
        {
          title: "NEW ALERT ⚠️",
          body: req.query.body,
          icon: "/motorcycle.png",
        },
        res
      );
      return;
    }

    if (req.query.set !== undefined) {
      console.log("req query set", req.query.key, req.query.value);
      set(ref(db, req.query.key), req.query.value)
        .then(() => {
          console.log("req send status 200 - OK");
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error(error);
        });

      return;
    }

    if (req.query.get !== undefined) {
      const refValue = ref(db, req.query.key);

      get(refValue)
        .then((data) => {
          res.send(data.val());
          return;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
};

const listenForNotificationRegistration = (exServer, db) => {
  webpush.setVapidDetails(
    "mailto:noreply@idhren.com",
    config.vapid.public,
    config.vapid.private
  );

  exServer.use(bodyParser.json());

  return (req, res) => {
    if (req.query.subscribe === undefined) {
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", config.client.baseURL);
    res.header("Access-Control-Allow-Headers", "*");

    const subscription = req.body;

    if (!subscription.endpoint) {
      res.status(201).json({});
      return;
    }

    // oneliner was unreadable
    const endpointBuffer = Buffer.from(subscription.endpoint);
    const subscriptionKey = endpointBuffer.toString("base64");
    const subscriptionPath = `endpoints/${subscriptionKey}`;
    const subscriptionRef = ref(db, subscriptionPath);
    set(subscriptionRef, subscription)
      .then(() => {
        res.status(201).json({});
      })
      .catch((error) => {
        res.sendStatus(500);
        console.log("database error", error);
      });
  };
};

const sendNotification = (db, payloadData, res) => {
  const endpointsRef = ref(db, "endpoints");

  get(endpointsRef).then((endpoints) => {
    Object.values(endpoints.val()).forEach((subscription) => {
      const payload = JSON.stringify(payloadData);

      console.log(payload, "payload");

      webpush
        .sendNotification(subscription, payload)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
};

// START SERVER

const exServer = express();

const db = await initDatabase();

listenForURL(exServer, db);

export default exServer;
