import { useState } from "react";
import PropTypes from "prop-types";

const Report = ({ chatMembers }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getChannelsDetailsByDate = () => {
    const channelsDetails = [];
  
    chatMembers.forEach((channel) => {
      const membersOnDate = selectedDate
        ? channel.members.filter(
            (member) =>
              new Date(member.joinedAt).toDateString() ===
              new Date(selectedDate).toDateString()
          )
        : channel.members;
  
      if (membersOnDate.length > 0) {
        const linkDetails = membersOnDate.reduce((acc, member) => {
          const link = member.chatLink || "None";
  
          if (!acc[link]) {
            acc[link] = {
              chatLink: link,
              memberCount: 0,
              leftMemberCount: 0, // Initialize leftMemberCount
            };
          }
  
          if (member.leftAt) {
            acc[link].leftMemberCount++;
          } else {
            acc[link].memberCount++;
          }
  
          return acc;
        }, {});
  
        channelsDetails.push({
          channelName: channel.channelName,
          linkDetails: Object.values(linkDetails),
        });
      }
    });
  
    return channelsDetails;
  };  

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Channels Details on {selectedDate}:</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <label htmlFor="dateInput">Select Date: </label>
          <div className="input-group rounded">
            <input
              type="date"
              id="dateInput"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Channel Name</th>
            <th>Chat Link</th>
            <th>Member Count</th>
            <th>Left Member Count</th>
          </tr>
        </thead>
        <tbody>
          {getChannelsDetailsByDate().map((channel, index) => (
            <tr key={index}>
              <td>{channel.channelName}</td>
              <td>
                <ul>
                  {channel.linkDetails.map((link, linkIndex) => (
                    <li key={linkIndex}>{link.chatLink}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {channel.linkDetails.map((link, linkIndex) => (
                    <li key={linkIndex}>{link.memberCount}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {channel.linkDetails.map((link, linkIndex) => (
                    <li key={linkIndex}>{link.leftMemberCount}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

Report.propTypes = {
  chatMembers: PropTypes.array.isRequired,
};

export default Report;
