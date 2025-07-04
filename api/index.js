const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

console.log("initializing");
const serviceAccount = JSON.parse(
    Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('utf8')
);
console.log("service account", serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(express.json());
app.use(cors());

const API_KEY = "test1234@K";
console.log("API key");
app.post("/sendNotification", (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).send("Unauthorized");
  }

  const {token, title, body} = req.body;
  console.log(body);
  console.log(token);
  console.log(title);

  if (!token || !title || !body) {
    return res.status(400).send("Missing token, title, or body");
  }

  console.log("messaging")
  admin.messaging()
      .send({token, notification: {title, body}} )
      .then(() => res.status(200).send("Notification sent successfully"))
      .catch((error) => res.status(500)
          .send(`Error sending notification: ${error}`));
});

module.exports=app;