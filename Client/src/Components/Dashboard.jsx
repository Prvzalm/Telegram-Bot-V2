import { useState } from "react";
import PropTypes from "prop-types";

const Dashboard = ({ chatMembers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [filteredChatMembers, setFilteredChatMembers] = useState(chatMembers);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredChannels = chatMembers.filter((channel) =>
      channel.channelName.toLowerCase().includes(query)
    );

    if (filterDate) {
      const filteredByDate = filteredChannels.filter((channel) =>
        channel.members.some(
          (member) =>
            member.joinedAt &&
            new Date(member.joinedAt).toLocaleDateString() ===
              filterDate.toLocaleDateString()
        )
      );
      setFilteredChatMembers(filteredByDate);
    } else {
      setFilteredChatMembers(filteredChannels);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate ? new Date(selectedDate) : null);
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
            <div className="input-group rounded">
              <input
                type="date"
                value={filterDate ? filterDate.toISOString().split("T")[0] : ""}
                onChange={handleDateChange}
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
