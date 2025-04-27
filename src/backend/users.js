const express = require('express');
require('dotenv').config();
const { Client, Users } = require('node-appwrite');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

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

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await users.get(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    const currentUser = await users.get(userId);

    if (name && name !== currentUser.name) {
      await users.updateName(userId, name);
    }

    if (email && email !== currentUser.email) {
      await users.updateEmail(userId, email);
    }

    res.json({ $id: userId, name, email });
  } catch (err) {
    if (err.message && err.message.includes('A target with the same ID already exists')) {
      return res.status(400).json({ error: 'This email is already in use.' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});