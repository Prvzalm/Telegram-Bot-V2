// routes/chatMembers.js

const express = require('express');
const router = express.Router();
const ChatMember = require('../models/ChatMemberSchema');

router.get('/', async (req, res) => {
  try {
    const chatMembers = await ChatMember.find();
    res.json(chatMembers);
  } catch (error) {
    console.error('Error fetching chat members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
