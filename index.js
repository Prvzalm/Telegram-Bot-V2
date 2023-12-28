const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chatmemberscount');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Create a schema for chat members
const chatMemberSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date },
  joinedMembersCount: { type: Number, default: 0 },
  leftMembersCount: { type: Number, default: 0 },
});

// Create a model from the schema
const ChatMember = mongoose.model('ChatMember', chatMemberSchema);

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TOKEN);

// Middleware to handle new chat members
bot.on('new_chat_members', async (ctx) => {
  const channelName = ctx.chat.title;

  try {
    // Save chat member information to MongoDB
    await ChatMember.create({ channelName });
    console.log(`New member joined! Channel Name: ${channelName}`);

    // Update and log the updated join members count
    const joinMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: false } });
    console.log(`Updated Join Members Count: ${joinMembersCount}`);
  } catch (error) {
    console.error('Error saving chat member to MongoDB:', error);
  }
});

// Middleware to handle left chat members
bot.on('left_chat_member', async (ctx) => {
  const channelName = ctx.chat.title;

  try {
    // Update leftAt for the member in MongoDB
    await ChatMember.findOneAndUpdate(
      { channelName, leftAt: { $exists: false } },
      { $set: { leftAt: new Date() }, $inc: { leftMembersCount: 1 } }
    );

    console.log(`Member left! Channel Name: ${channelName}`);

    // Update and log the updated join members count
    const joinMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: false } });
    console.log(`Updated Join Members Count: ${joinMembersCount}`);

    // Update and log the updated left members count
    const leftMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: true } });
    console.log(`Updated Left Members Count: ${leftMembersCount}`);
  } catch (error) {
    console.error('Error updating leftAt in MongoDB:', error);
  }
});

// Start the bot
bot.launch().then(() => console.log('Bot is running...'));
