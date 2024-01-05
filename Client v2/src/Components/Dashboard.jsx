import { useState } from "react";
import PropTypes from "prop-types";

const Dashboard = ({ chatMembers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChatMembers, setFilteredChatMembers] = useState(chatMembers);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredChannels = chatMembers.filter((channel) =>
      channel.channelName.toLowerCase().includes(query)
    );

    setFilteredChatMembers(filteredChannels);
  };

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Dashboard</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="input-group rounded">
              <input
                type="search"
                className="form-control rounded"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <ul>
          {filteredChatMembers.map((chat) => (
            <li key={chat._id}>
              <strong>Channel Name:</strong> {chat.channelName}
              <br />
              <strong>Joined Members Count:</strong> {chat.joinedMembersCount}
              <br />
              <strong>Left Members Count:</strong> {chat.leftMembersCount}
              <br />
              <strong>Members:</strong>
              <ul>
                {chat.members.map((member) => (
                  <li key={member.memberId}>
                    Member ID: {member.memberId}, Joined At:{" "}
                    {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleString()
                      : "N/A"}
                    , Left At:{" "}
                    {member.leftAt
                      ? new Date(member.leftAt).toLocaleString()
                      : "N/A"}
                    , Invite Link: {member.chatLink}
                  </li>
                ))}
              </ul>
              <hr />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

Dashboard.propTypes = {
  chatMembers: PropTypes.array.isRequired,
};

export default Dashboard;
