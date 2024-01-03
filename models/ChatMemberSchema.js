const mongoose = require('mongoose')

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

  module.exports = ChatMember;