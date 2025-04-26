const express = require('express');
require('dotenv').config();
const { Client, Users } = require('node-appwrite');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('diet-assist')
  .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);

app.get('/api/users', async (req, res) => {
  try {
    const result = await users.list();
    res.json(result.users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});