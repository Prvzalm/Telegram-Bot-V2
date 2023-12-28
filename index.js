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
  userId: { type: Number, required: true },
  channelName: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date },
});

// Create a model from the schema
const ChatMember = mongoose.model('ChatMember', chatMemberSchema);

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TOKEN);

// Middleware to handle new chat members
bot.on('new_chat_members', async (ctx) => {
  const channelName = ctx.chat.title;
  const userIds = ctx.message.new_chat_members.map(member => member.id);

  userIds.forEach(async (userId) => {
    try {
      // Save chat member information to MongoDB
      const chatMember = new ChatMember({ userId, channelName });
      await chatMember.save();

      console.log(`New member joined! Channel Name: ${channelName}, Member ID: ${userId}`);

      // Get and log the updated join members count
      const joinMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: false } });
      console.log(`Updated Join Members Count: ${joinMembersCount}`);
    } catch (error) {
      console.error('Error saving chat member to MongoDB:', error);
    }
  });
});

// Middleware to handle left chat members
bot.on('left_chat_member', async (ctx) => {
  const channelName = ctx.chat.title;
  const userId = ctx.message.left_chat_member.id;

  try {
    // Update leftAt for the member in MongoDB
    await ChatMember.findOneAndUpdate(
      { userId, channelName, leftAt: { $exists: false } },
      { $set: { leftAt: new Date() } }
    );

    console.log(`Member left! Channel Name: ${channelName}, Member ID: ${userId}`);

    // Get and log the updated join members count
    const joinMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: false } });
    console.log(`Updated Join Members Count: ${joinMembersCount}`);

    // Get and log the updated left members count
    const leftMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: true } });
    console.log(`Updated Left Members Count: ${leftMembersCount}`);
  } catch (error) {
    console.error('Error updating leftAt in MongoDB:', error);
  }
});

// Start the bot
bot.launch({
  allowedUpdates: ['chat_member', 'message']
}).then(() => console.log('Bot is running...'));
