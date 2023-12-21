const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
require("dotenv").config();

const app = express();

const TOKEN = process.env.TOKEN
const bot = new TelegramBot(TOKEN, { polling: true });

app.get('/', (req, res) => {
  res.send('Hello Get!');
});

bot.on('message', (msg) => {

  var hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
  bot.sendMessage(msg.chat.id,"Hello dear user");
  }
  
  var bye = "bye";
  if (msg.text.toString().toLowerCase().includes(bye)) {
  bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
  }
  
});

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome");
  
});




app.listen(3000, () => {
  console.log(`Server running at Port 3000`);
});