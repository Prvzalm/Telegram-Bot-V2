const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/telegramBot');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Create a schema for chat members
const chatMemberSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  joinedMembersCount: { type: Number, default: 0 },
  leftMembersCount: { type: Number, default: 0 },
  members: [{
    memberId: { type: Number, required: true },
    chatLink: { type: String },
    joinedAt: { type: Date },
    leftAt: { type: Date },
  }],
});

// Create a model from the schema
const ChatMember = mongoose.model('ChatMember', chatMemberSchema);

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TOKEN);

// Middleware to handle new chat members
bot.on('chat_member', async (ctx) => {
  const chatName = ctx.chatMember.chat.title;
  const memberId = ctx.chatMember.new_chat_member.user.id;
  const chatLink = ctx.chatMember.invite_link;
  const status = ctx.chatMember.new_chat_member.status
  console.log(chatLink)

  if (status === 'member') {
    try {
      const existingChatMember = await ChatMember.findOne({
        channelName: chatName,
      });
    
      if (!existingChatMember) {
        // Create a new document if it doesn't exist
        await ChatMember.create({
          channelName: chatName,
          joinedMembersCount: 1, // Increment joinedMembersCount for the channel
          members: [{
            memberId,
            chatLink: chatLink || '',
            joinedAt: new Date(),
          }],
        });
    
        console.log(`New member joined! Channel ID: ${chatName}, Member ID: ${memberId}, Chat Link: ${chatLink}`);
      } else {
        // Update array element if it's an array
        await ChatMember.updateOne(
          {
            channelName: chatName,
          },
          {
            $inc: { joinedMembersCount: 1, }, /*Increment joinedMembersCount for the channel*/
            $push: {
              members: {  // Use $push to add a new member to the array
                memberId,
                chatLink: chatLink || '',
                joinedAt: new Date(),
              },
            }
          }
        );
    
        console.log(`Member updated! Channel ID: ${chatName}, Member ID: ${memberId}, Chat Link: ${chatLink}`);
      }
    } catch (error) {
      console.error('Error updating chat member in MongoDB:', error);
    }    
    
  } else if (status === 'kicked' || status === 'left' || status === 'banned') {
    try {
      // Update leftAt for the member in MongoDB
      const updateResult = await ChatMember.findOneAndUpdate(
        { channelName: chatName, 'members.memberId': memberId },
        {
          $inc: { leftMembersCount: 1 },
          $set: { 'members.$.leftAt': new Date() }
        }
      );
    
      if (updateResult) {
        console.log(`Member left! Channel ID: ${chatName}, Member ID: ${memberId}`);
      } else {
        console.log('Member not found or not updated.');
      }
    } catch (error) {
      console.error('Error updating leftAt in MongoDB:', error);
    }    
  }
});

// Start the bot
bot.launch({
  allowedUpdates: ['chat_member']
}).then(() => console.log('Bot is running...'));