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
  joinedMembers: { type: Number, default: 0 },
  leftMembers: { type: Number, default: 0 },
  inviteLink: { type: String },
});

// Create a model from the schema
const ChatMemberCount = mongoose.model('ChatMemberCount', chatMemberCountSchema);

// Create a bot instance
const bot = new TelegramBot(botToken, { polling: true });

// Function to get the invite link and update the chat member count
async function updateMemberCount(chatId, isJoin) {
  const inviteLink = await bot.exportChatInviteLink(chatId);

  // Update or create the chat member count in the database
  const update = isJoin ? { $inc: { joinedMembers: 1 }, inviteLink } : { $inc: { leftMembers: 1 }, inviteLink };
  await ChatMemberCount.findOneAndUpdate({ chatId }, update, { upsert: true });

  // Log the updated count with the invite link
  const count = await ChatMemberCount.findOne({ chatId });
  const action = isJoin ? 'joined' : 'left';
  console.log(`Member ${action} the chat ${chatId}. ${action.charAt(0).toUpperCase() + action.slice(1)} Members: ${count[`${action}Members`]}. Invite Link: ${count.inviteLink}`);
}

// Listen for new chat members
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  updateMemberCount(chatId, true);
});

// Listen for left chat members
bot.on('left_chat_member', async (msg) => {
  const chatId = msg.chat.id;
  updateMemberCount(chatId, false);
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');