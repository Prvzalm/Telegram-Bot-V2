import PropTypes from "prop-types";
import { useState } from "react";

const Customer = ({ chatMembers }) => {
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

  const getUniqueLinks = (members) => {
    const uniqueLinks = Array.from(
      new Set(members.map((member) => member.chatLink))
    );
    return uniqueLinks.join(", ");
  };

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Customers</h1>
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
        <div className="channel-table">
          <table>
            <thead>
              <tr>
                <th style={{ padding: "0 9rem 0 0" }}>Channel Name</th>
                <th style={{ width: "7rem" }}>Invite Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredChatMembers.map((channel) => (
                <tr key={channel._id}>
                  <td>
                    {channel.channelName}
                  </td>
                  <td>{getUniqueLinks(channel.members)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

Customer.propTypes = {
  chatMembers: PropTypes.array.isRequired,
};

export default Customer;
