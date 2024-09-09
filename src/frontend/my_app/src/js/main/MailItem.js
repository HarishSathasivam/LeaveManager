import React, { useEffect } from "react";
import { format } from "date-fns";
import MailDetails from "./MailDetails";

const MailItem = (props) => {
  const {
    ele,
    newCurrentUser,
    selectedRequest,
    setSelectedRequest,
    updateUserRequestStatus,
    handleCurretPage
  } = props;

  useEffect(() => {
    if (selectedRequest && newCurrentUser.role !== "employee") {
      const statusId = selectedRequest.requestStatus[0].id;
      updateUserRequestStatus(statusId, true, true, false);
    }
  }, [selectedRequest]);

  const handleRowClick = (request) => {
    if (selectedRequest && selectedRequest.id === request.id) {
      setSelectedRequest(null);
    } else {
      setSelectedRequest(request);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPPpp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleEmailSender = (requestDetails) => {
    return requestDetails.senderRequestStatus.map((receiver) => receiver.receiverName);
  };

  return (
    <div className="mail-item">
      <div onClick={() => handleRowClick(ele)} className="mail-header">
        <span className="mail-sender">{newCurrentUser.role === "employee" ? "TO: " + handleEmailSender(ele).join(', ') : "FROM: " + ele.sender}</span>
        <span className="mail-date">{formatDate(ele.requestdate)}</span>
      </div>
      {selectedRequest && selectedRequest.id === ele.id && (
        <MailDetails
          ele={ele}
          newCurrentUser={newCurrentUser}
          updateUserRequestStatus={updateUserRequestStatus}
          handleCurretPage={handleCurretPage}
        />
      )}
    </div>
  );
};

export default MailItem;
