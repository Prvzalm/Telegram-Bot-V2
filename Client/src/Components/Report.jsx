import { useState } from "react";
import PropTypes from "prop-types";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Modal, Button } from "react-bootstrap";
import { DateRangePicker } from "react-date-range";

const Report = ({ chatMembers }) => {

  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getChannelsDetailsByDateRange = () => {
    const channelsDetails = [];
  
    chatMembers.forEach((channel) => {
      const membersInDateRange = dateRange[0].startDate && dateRange[0].endDate
        ? channel.members.filter(
            (member) => {
              const joinedDate = new Date(member.joinedAt);
              return (
                (!dateRange[0].startDate || joinedDate >= dateRange[0].startDate) &&
                (!dateRange[0].endDate || joinedDate <= dateRange[0].endDate)
              );
            }
          )
        : channel.members;
  
      if (membersInDateRange.length > 0) {
        const linkDetails = membersInDateRange.reduce((acc, member) => {
          const link = member.chatLink || "None";
  
          if (!acc[link]) {
            acc[link] = {
              chatLink: link,
              memberCount: 0,
              leftMemberCount: 0,
              uniqueMembers: new Set(), // Track unique members using a Set
            };
          }
  
          if (member.leftAt) {
            acc[link].leftMemberCount++;
          }
  
          if (member.joinedAt && !acc[link].uniqueMembers.has(member.memberId)) {
            // Increase member count only if the member hasn't been counted before
            acc[link].memberCount++;
            acc[link].uniqueMembers.add(member.memberId);
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
        <h1 className="h2">Channels Details on {}:</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="input-group rounded">
            <Button variant="primary" onClick={openModal}>
              Select Date
            </Button>
            <Modal show={showModal} onHide={closeModal} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Date Range</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <DateRangePicker
                  onChange={handleDateChange}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  ranges={dateRange}
                  direction="horizontal"
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={closeModal}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
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
          {getChannelsDetailsByDateRange().map((channel, index) => (
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
