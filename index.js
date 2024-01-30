const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const chatMembersRouter = require('./routes/chatMembers');
const ChatMember = require('./models/ChatMemberSchema')

const app = express();
const port = 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin : "http://localhost:5173",
  credentials: true, 
}));

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.URL);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

// Call this function to connect to the database
connectToDatabase();

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TOKEN);

// Middleware to handle new chat members
bot.on('chat_member', async (ctx) => {
  const chatName = ctx.chatMember.chat.title;
  const chatId = ctx.chatMember.chat.id;
  const memberId = ctx.chatMember.new_chat_member.user.id;
  const chatLink = ctx.chatMember.invite_link ? ctx.chatMember.invite_link.invite_link : "None";
  const status = ctx.chatMember.new_chat_member.status

  async function addOrUpdate() {
    try {
      const updateResult = await ChatMember.findOneAndUpdate(
        { channelName: chatName }, // Check if memberId doesn't exist
        {
          $set: { chatId: chatId },
          $inc: { joinedMembersCount: 1 },
          $push: {
            members: {
              memberId,
              chatLink: chatLink,
              joinedAt: new Date(),
            },
          },
        },
        { upsert: true, new: true }
      );

      if (updateResult) {
          console.log(
            `Member joined/updated! Channel ID: ${chatName}, Member ID: ${memberId}, Chat Link: ${chatLink}`
          );
        } else {
          console.log(`Member unable to be found/updated in ${chatName}.`);
        }
    } catch (error) {
      console.error("Error updating chat member in MongoDB:", error);
    }
  }

  async function memberLeft(){
    try {
      // Update leftAt for the member in MongoDB
      const updateResult = await ChatMember.findOneAndUpdate(
        { channelName: chatName, "members.memberId": memberId },
        {
          $inc: { leftMembersCount: 1 },
          $set: { "members.$.leftAt": new Date() },
        }
      );

      if (updateResult) {
          console.log(
            `Member left! Channel ID: ${chatName}, Member ID: ${memberId}`
          );
        } else {
          console.log("Member not found or not updated.");
        }
    } catch (error) {
      console.error("Error updating leftAt in MongoDB:", error);
    }
  }

  if (status === "member") {
    addOrUpdate();
  } else if (status === "kicked" || status === "left" || status === "banned") {
    memberLeft();
  }
});

// Start the bot
bot.launch({
  allowedUpdates: ['chat_member']
}).then(() => console.log('Bot is running...'));

// Use the route
app.use("/api/chatMembers", chatMembersRouter);
app.use("/api", authRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});