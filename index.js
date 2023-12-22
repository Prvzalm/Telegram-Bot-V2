const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const express = require("express")
require("dotenv").config()

const app = express();

app.use(express.json());

// Replace with your Telegram bot token
const botToken = process.env.TOKEN;
const chatId = process.env.CHATID;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/telegram_tracking');

// Create a schema for tracking information
const trackingSchema = new mongoose.Schema({
  inviteLink: {
    type: String,
    required: true,
    unique: true,
  },
  joinedCount: {
    type: Number,
    default: 0,
  },
  leftCount: {
    type: Number,
    default: 0,
  },
});

// Create a model for tracking information
const Tracking = mongoose.model('Tracking', trackingSchema);

// Create a new Telegram bot
const bot = new TelegramBot(botToken, { polling: true });

// Event handler for updates in chat members
bot.on('chatMemberUpdated', async (update) => {
  console.log(update)
  const chatId = update.chat.id;
  const inviteLink = getInviteLinkFromChat(update.chat);
  const status = update.new_chat_member.status; // 'member' or 'left' or 'kicked'

  try {
    let trackingInfo = await Tracking.findOne({ inviteLink });

    if (!trackingInfo) {
      trackingInfo = new Tracking({ inviteLink });
    }

    if (status === 'member') {
      // User joined the chat
      trackingInfo.joinedCount += 1;
    } else if (status === 'left' || status === 'kicked') {
      // User left or was kicked from the chat
      trackingInfo.leftCount += 1;
    }

    await trackingInfo.save();
  } catch (error) {
    console.error('Error updating tracking information:', error.message);
  }
});

// Helper function to extract the invite link from the chat
function getInviteLinkFromChat(chat) {
  return chat.description || '';
}

