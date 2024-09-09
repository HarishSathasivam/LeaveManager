import React, { useState } from "react";
import { format } from "date-fns";

const MailDetails = (props) => {
  const {
    ele,
    newCurrentUser,
    updateUserRequestStatus,
    handleCurretPage
  } = props;

  const [trackRequestStatus, setTrackRequestStatus] = useState(false);

  const handleAccept = async () => {
    const statusId = ele.requestStatus[0].id;
    updateUserRequestStatus(statusId, true, true, true);
  };

  const handleReject = () => {
    const statusId = ele.requestStatus[0].id;
    updateUserRequestStatus(statusId, true, true, false);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPPpp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const FormatCommand = (cmdJson) => (
    <span>
      <br />
      Start Date: {cmdJson.startDate} <br /> End Date: {cmdJson.endDate}
    </span>
  );

  const handleEmailSender = (requestDetails) => {
    return requestDetails.senderRequestStatus.map((receiver) => receiver.receiverName);
  };

  const handleTrackRequestStatus = () => {
    setTrackRequestStatus(!trackRequestStatus);
  };

  const showChatBox = () => {
    handleCurretPage("chatBox", ele);
  };

  return (
    <div className="mail-details">
      <div className="mail-body">
        <span className="mail-command">{ele.command}</span><br /><br />
        <span className="mail-leaveDates">Leave Date: {FormatCommand(JSON.parse(ele.leaveDates))}</span>
      </div>
      {newCurrentUser.role === "employee" ? (
        <div>
          <div className="trackRequestStatus" onClick={handleTrackRequestStatus}>TRACK MY REQUEST</div>
          <div className="mail-actions">
            {trackRequestStatus && ele.senderRequestStatus.map((user, index) => (
              <div className="application-status-container" key={index}>
                <div className="application-status-item">
                  <span>Receiver Name: {user.receiverName}</span>
                </div>
                <div className="application-status-item">
                  <span>Received:</span>
                  <span className={`indicator ${user.requestReceived ? 'green' : 'yellow'}`}></span>
                </div>
                <div className="application-status-item">
                  <span>Seen:</span>
                  <span className={`indicator ${user.seen ? 'green' : 'red'}`}></span>
                </div>
                <div className="application-status-item">
                  <span>Approved:</span>
                  <span className={`indicator ${user.status ? 'green' : 'red'}`}></span>
                </div>
                {user.responsedate && (
                  <div className="application-status-item">
                    <span>Last action: {formatDate(user.responsedate)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mail-actions">
          <button className="acceptBtn" onClick={handleAccept}>Approve</button>
          <button className="rejectBtn" onClick={handleReject}>Reject</button>
        </div>
      )}
      <button onClick={showChatBox}>Discuss With: {newCurrentUser.role === "employee" ? handleEmailSender(ele).join(', ') : ele.sender}</button>
    </div>
  );
};

export default MailDetails;
