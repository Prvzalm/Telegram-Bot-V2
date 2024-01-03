// src/App.js

import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [chatMembers, setChatMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chatMembers');
        setChatMembers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Chat Members</h1>
      <ul>
        {chatMembers.map((chat) => (
          <li key={chat._id}>
            <strong>Channel Name:</strong> {chat.channelName}<br />
            <strong>Joined Members Count:</strong> {chat.joinedMembersCount}<br />
            <strong>Left Members Count:</strong> {chat.leftMembersCount}<br />
            <strong>Members:</strong>
            <ul>
              {chat.members.map((member) => (
                <li key={member.memberId}>
                  Member ID: {member.memberId}, Joined At: {member.joinedAt ? new Date(member.joinedAt).toLocaleString() : 'N/A'}, Left At: {member.leftAt ? new Date(member.leftAt).toLocaleString() : 'N/A'}, Invite Link: {member.chatLink}
                </li>
              ))}
            </ul>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
