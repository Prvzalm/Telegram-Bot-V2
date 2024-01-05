import PropTypes from "prop-types";

const Customer = ({ chatMembers }) => {
    
  const getUniqueLinks = (members) => {
    const uniqueLinks = Array.from(new Set(members.map((member) => member.chatLink)));
    return uniqueLinks.join(", ");
  };

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Customers</h1>
        </div>
        <div className="channel-table">
      <table>
        <thead>
          <tr>
            <th>Channel Name</th>
            <th>Invite Links</th>
          </tr>
        </thead>
        <tbody>
          {chatMembers.map((channel) => (
            <tr key={channel._id}>
              <td>{channel.channelName}</td>
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
