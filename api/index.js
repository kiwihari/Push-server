const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

console.log("Initializing....");

const serviceAccount = JSON.parse(
    Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('utf8')
);

console.log("Service account created...");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(express.json());
app.use(cors());

const API_KEY = "test1234@K";

console.log("API key assigned....");

app.get('/', (req, res) => {
  console.log('Received GET request');
  res.status(200).send('Welcome to the Push Server API.');
});

app.post("/sendNotification", (req, res) => {
  const authHeader = req.headers["authorization"];

  console.log("Sent POST request");

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).send("Unauthorized");
  }

  const {token, title, body} = req.body;

  if (!token || !title || !body) {
    return res.status(400).send("Missing token, title, or body");
  }

  console.log("Receiving the response of POST request....");

  admin.messaging()
      .send({token, notification: {title, body}} )
      .then(() => res.status(200).send("Notification sent successfully"))
      .catch((error) => res.status(500)
          .send(`Error sending notification: ${error}`));
});

console.log("Received the response.....");

module.exports=app;