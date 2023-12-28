const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Replace with your Telegram bot token
const botToken = process.env.TOKEN;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chatmembers');

const chatMemberCountSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
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

// Create a Telegraf bot instance
const bot = new Telegraf(botToken);

// Function to update the member count when a member joins through an admin-invited link
async function updateAdminMemberCount(ctx, userId, channelName, inviteLink) {
  // Find the document that matches the query criteria
  const existingRecord = await ChatMemberCount.findOne({
    'adminInviteLinks.link': inviteLink,
  });

  // If the document exists, update the specific array element
  if (existingRecord) {
    const index = existingRecord.adminInviteLinks.findIndex(link => link.link === inviteLink);
    if (index !== -1) {
      // Update the chat member count in the database
      existingRecord.adminInviteLinks[index].joinedMembers.push({
        userId,
        joinedAt: new Date(),
      });

      existingRecord.channelName = channelName;

      await existingRecord.save();
    } else {
      // Handle the case where the link is not found
      console.error(`Link not found: ${inviteLink}`);
    }
  } else {
    // Handle the case where the document is not found
    console.error(`Document not found for link: ${inviteLink}`);
  }

  console.log(`Member joined through admin-invited link in channel ${channelName}: ${inviteLink}. Member ID: ${userId}`);
}

// Middleware to handle new chat members
bot.on('new_chat_members', async (ctx) => {
  const userIds = ctx.message.new_chat_members.map(member => member.id);

  // Get channelName from ctx.chatMember.chat.title
  const channelName = ctx.message.chat.title;

  // Use exportChatInviteLink to obtain the invite link
  const inviteLink = await ctx.telegram.exportChatInviteLink(ctx.chat.id);

  for (const userId of userIds) {
    await updateAdminMemberCount(ctx, userId, channelName, inviteLink);
  }
});

// Middleware to handle left chat members
bot.on('left_chat_member', async (ctx) => {
  const userId = ctx.message.left_chat_member.id;

  // Update the member count when a member leaves
  await ChatMemberCount.updateOne(
    { 'leftMembers.userId': userId },
    { $set: { 'leftMembers.$.leftAt': new Date() } }
  );

  console.log(`Member left channel. Member ID: ${userId}`);
});

// Start the bot
bot.launch().then(() => {
  console.log('Bot is running...');
});
