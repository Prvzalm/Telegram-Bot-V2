const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const express = require("express")
require("dotenv").config()

const app = express();
app.use(express.json())

// Replace with your Telegram bot token
const botToken = process.env.TOKEN;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chatmembers');

const chatMemberCountSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  adminId: { type: Number, required: true },
  adminInviteLinks: [
    {
      link: { type: String, required: true },
      joinedMembers: [
        {
          userId: { type: Number, required: true },
          joinedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  leftMembers: [
    {
      userId: { type: Number, required: true },
      leftAt: { type: Date, default: Date.now },
    },
  ],
});

// Create a model from the schema
const ChatMemberCount = mongoose.model('ChatMemberCount', chatMemberCountSchema);

// Create a bot instance
const bot = new TelegramBot(botToken, { polling: true });

// Function to update the member count when a member joins through an admin-invited link
async function updateAdminMemberCount(chatId, userId, adminId, inviteLink) {
  const timestamp = new Date();

  // Update the chat member count in the database
  await ChatMemberCount.findOneAndUpdate(
    { chatId, 'adminInviteLinks.link': inviteLink },
    { $push: { 'adminInviteLinks.$.joinedMembers': { userId, joinedAt: timestamp } } }
  );

  console.log(`Member joined through admin-invited link in chat ${chatId}: ${inviteLink}. Member ID: ${userId}`);
}

// Example usage: manually create invite links or use another mechanism
// Then, call updateAdminMemberCount when new members join through these links
// const inviteLink = 'your manually created or obtained invite link';
// await updateAdminMemberCount(CHAT_ID, USER_ID, ADMIN_ID, inviteLink);

// Listen for new chat members
bot.on('new_chat_members', async (msg) => {
  const chatId = msg.chat.id;
  const userIds = msg.new_chat_members.map(member => member.id);

  // Check if the member joined through an admin-invited link
  const entities = msg.entities || [];
  const adminInviteLinks = entities
    .filter(entity => entity.type === 'text_link')
    .map(linkEntity => linkEntity.url);

  adminInviteLinks.forEach(async (inviteLink) => {
    userIds.forEach(async (userId) => {
      await updateAdminMemberCount(chatId, userId, ADMIN_ID, inviteLink);
    });
  });
});

// Listen for left chat members
bot.on('left_chat_member', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.left_chat_member.id;

  // Update the member count when a member leaves
  await ChatMemberCount.findOneAndUpdate(
    { chatId, 'leftMembers.userId': userId },
    { $set: { 'leftMembers.$.leftAt': new Date() } }
  );

  console.log(`Member left chat ${chatId}. Member ID: ${userId}`);
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');