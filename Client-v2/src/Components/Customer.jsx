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

  const getMembersCountByLink = (members) => {
    const membersCountByLink = {};

    members.forEach((member) => {
      const link = member.chatLink || "None";

      if (membersCountByLink[link]) {
        membersCountByLink[link]++;
      } else {
        membersCountByLink[link] = 1;
      }
    });

    return membersCountByLink;
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
        <table className="table">
          <thead>
            <tr>
              <th>Channel Name</th>
              <th>Invite Links</th>
            </tr>
          </thead>
          <tbody>
            {filteredChatMembers.map((channel) => (
              <tr key={channel._id}>
                <td>{channel.channelName}</td>
                <td>
                  <ul>
                    {Object.entries(getMembersCountByLink(channel.members)).map(
                      ([link, count]) => (
                        <li key={link}>
                          {link === "None" ? "No Link" : link}: {count}
                        </li>
                      )
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

Customer.propTypes = {
  chatMembers: PropTypes.array.isRequired,
};

export default Customer;
