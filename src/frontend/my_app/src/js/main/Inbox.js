import React, { useEffect, useState } from "react";
import "../../css/Inbox.css";
import MailItem from "./MailItem";
import Constants from "../../utilities/constans"
import axios from "axios";

const Inbox = (props) => {
  const { newCurrentUser, refreshCurrentUser, handleCurretPage,sendMessage } = props;
  const [selectedRequest, setSelectedRequest] = useState(null);

  console.log("newCurrentUser = ",newCurrentUser)

  useEffect(()=>{
    refreshCurrentUser(newCurrentUser.email);
  },[])

  if (!newCurrentUser || !newCurrentUser.requestDetails) {
    return <div>Loading...</div>;
  }



  const filteredRequestDetails = newCurrentUser.requestDetails.filter((ele) => {
    const receivers = JSON.parse(ele.receiver);
    return ele.sender === newCurrentUser.email || receivers.includes(newCurrentUser.email);
  });



  const updateUserRequestStatus = async (requestId, received, seen, status) => {
    const token = localStorage.getItem("token");
    const url = `${Constants.serverIp}updateRequestStatus?id=${requestId}&date=${new Date()}&received=${received}&seen=${seen}&status=${status}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
       // refreshCurrentUser(newCurrentUser.email);
       
        sendMessage("command", "refreshCurrentUser");
      }
    } catch (error) {
      console.log("Error updating request status:", error);
    }
  };

  return (
    <div className="inbox-container">
      <h1>Inbox</h1>
      <div className="mail-list">
        {filteredRequestDetails.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          filteredRequestDetails.map((ele, index) => (
            <MailItem
              key={index}
              ele={ele}
              newCurrentUser={newCurrentUser}
              selectedRequest={selectedRequest}
              setSelectedRequest={setSelectedRequest}
              updateUserRequestStatus={updateUserRequestStatus}
              handleCurretPage={handleCurretPage}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
