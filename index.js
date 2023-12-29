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
  chatInvite: { type: String },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date },
  joinedMembersCount: { type: Number, default: 0 },
  leftMembersCount: { type: Number, default: 0 },
});

// Create a model from the schema
const ChatMember = mongoose.model('ChatMember', chatMemberSchema);

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TOKEN);

// Middleware to handle chat member events
bot.on('chat_member', async (ctx) => {
  const channelName = ctx.chat.title;
  const chatInvite = ctx.chatMember.invite_link;
  console.log(chatInvite)

  if (ctx.chatMember.new_chat_member.status === 'member') {
    // Handle new chat members
    const userIds = ctx.chatMember.new_chat_member

    try {
      // Save chat member information to MongoDB
      await ChatMember.create({ channelName, chatInvite });
      console.log(`New member(s) joined! Channel Name: ${channelName}, Invite Link: ${chatInvite}`);

      // Update and log the updated join members count
      const joinMembersCount = await ChatMember.countDocuments({ channelName, leftAt: { $exists: false } });
      console.log(`Updated Join Members Count: ${joinMembersCount}`);
    } catch (error) {
      console.error('Error saving chat member to MongoDB:', error);
    }
  } else if (ctx.chatMember.new_chat_member.status === 'left' || ctx.chatMember.new_chat_member.status === 'kicked' || ctx.chatMember.new_chat_member.status === 'banned') {
    // Handle left chat members
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
  }
});

// Start the bot
bot.launch({
  allowedUpdates: ['chat_member']
}).then(() => console.log('Bot is running...'));
