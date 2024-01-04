// import
// { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
//  from 'react-icons/bs'
//  import
//  { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
//  from 'recharts';

import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
  const [chatMembers, setChatMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "http://localhost:5000/api/chatMembers"
            );
            setChatMembers(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
        // Set up interval for periodic data fetching
    const intervalId = setInterval(() => {
        fetchData();
      }, 1000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
      }, []);

  return (
    <main className="main-container">
      <div>
      {/* Render your search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Render your chatMembers data */}
      <ul>
        {chatMembers
          .filter((chat) =>
            chat.channelName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((chat) => (
            <li key={chat._id}>
              {/* Render individual chat member information */}
            </li>
          ))}
      </ul>
    </div>
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
    </main>
  );
}

export default Home;
