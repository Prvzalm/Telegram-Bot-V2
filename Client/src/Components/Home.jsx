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
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div
  style={{ display: "flex", justifyContent: "space-around" }}
  className="row container"
>
  <div className="col-md-6">
    <h3>Channel Name</h3>
    {chatMembers.map((chat) => (
      <div key={chat._id}>{chat.channelName}</div>
    ))}
  </div>
  <div className="col-md-6">
    <h3>Chat Invite</h3>
    {chatMembers.map((chat) => (
      <div key={chat._id}>
        {chat.members.map((member) => (
          <span key={member.memberId}>{member.chatLink}</span>
          ))}
      </div>
    ))}
  </div>
</div>

      {/* <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        </div> */}
    </main>
  );
}

export default Home;
