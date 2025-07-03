const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const env = require('dotenv').config();

const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
console.log(API_KEY);

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/sendNotification', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
        return res.status(401).send('Unauthorized');
    }

    const { token, title, body } = req.body;
    if (!token || !title || !body) {
        return res.status(400).send('Missing token, title, or body');
    }

    admin.messaging()
        .send({
            token,
            notification: { title, body },
        })
        .then(() => res.status(200).send('Notification sent successfully'))
        .catch((error) => res.status(500).send(`Error sending notification: ${error}`));
});