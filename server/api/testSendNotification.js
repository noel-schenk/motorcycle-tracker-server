import express from "express";

import { getDatabase, ref, onValue, set, push, get } from "firebase/database";

import { initDatabase } from "./index.js";

import webpush from "web-push";

const exServer = express();

const db = await initDatabase();

const endpointsRef = ref(db, "endpoints");

get(endpointsRef).then((endpoints) => {
  Object.values(endpoints.val()).forEach((subscription) => {
    const payload = JSON.stringify({ title: "test" });

    webpush.sendNotification(subscription, payload).catch((error) => {
      console.error(error.stack);
    });
  });
});
