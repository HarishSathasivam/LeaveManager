import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "../../utilities/constans"; // Adjust import path as needed
import SendEmail from "./SendMail";
import "../../css/SendLeaveRequest.css"; // Assuming you have a CSS file for styling

const SendLeaveRequest = (props) => {
  const { sendMessage, currentUser, closeModal ,refreshCurrentUser} = props;
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emailSend, setEmailSend] = useState(false);
  const [data, setData] = useState(null);
  const [emailInfo, setEmailInfo] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let text = `I kindly request your approval for my leave from ${startDate} to ${endDate}. Thank you for your consideration.`;
    setMessage(text);
  }, [startDate, endDate]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    let url = Constants.serverIp + "getAllUsers";

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const filteredUsers = response.data.filter((user) => user.email !== currentUser.email);
        setAllUsers(filteredUsers);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleMsgSend = () => {
    if (startDate && endDate && selectedUsers.length > 0 && message) {
      const selectedEmails = selectedUsers.map((user) => user.email);
      const dataToSend = {
        requestId: "",
        requestdate: new Date(),
        responsedate: "",
        sender: currentUser.email,
        command: message,
        receiver: JSON.stringify(selectedEmails),
        status: false,
        leaveDates: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
        }),
      };

      closeModal();
      saveRequest(dataToSend);
      if (emailSend) {
        emailTOSend();
      }
    } else {
      alert("Please provide all the necessary information");
    }
  };

  const saveRequest = async (requestDetails) => {
    const token = localStorage.getItem("token");
    let url = Constants.serverIp + "saveRequest";

    try {
      const response = await axios.post(url, requestDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {

        sendMessage("text", requestDetails);
        refreshCurrentUser(currentUser.email)
      }
    } catch (error) {
      console.log("Error saving request:", error);
    }
  };

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => ({
      email: option.value,
      name: option.text,
    }));
    setSelectedUsers(selectedOptions);
  };

  const handleEmailTOSend = (emailDetails) => {
    setEmailInfo(emailDetails);
  };

  const emailTOSend = async () => {
    const token = localStorage.getItem("token");
    let url = Constants.serverIp + "apply";

    try {
      const response = await axios.post(url, emailInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Email send response =", response);

      if (response.status === 200) {
        console.log("Email sent successfully");
      }
    } catch (error) {
      console.log("Error sending email:", error);
    }
  };

  const handleSendEmail = () => {
    if (startDate && endDate && selectedUsers.length > 0 && message) {
      const selectedEmails = selectedUsers.map((user) => user.email);
      const dataToSend = {
        requestId: "",
        requestdate: new Date(),
        responsedate: "",
        sender: currentUser.email,
        command: message,
        receiver: JSON.stringify(selectedEmails),
        status: false,
        leaveDates: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
        }),
      };
      setEmailSend(!emailSend);
      setData(dataToSend);
    } else {
      alert("Please provide all the necessary information");
      setEmailSend(false);
    }
  };

  return (
    <div className="send-leave-request-container">
      <h3>CREATE LEAVE REQUEST</h3>

      <div className="form-group">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        ></textarea>
      </div>

      <div className="form-group">
        <label>Sent To:</label>
        <br />
        <select className="selectBox" multiple onChange={handleUserSelect}>
          {allUsers.map((user) => (
            <option key={user.email} value={user.email}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div>
        Send leave request by Email too?:{" "}
        <input
          checked={emailSend}
          onChange={handleSendEmail}
          type="checkbox"
        ></input>
        {data && emailSend && (
          <SendEmail data={data} handleEmailTOSend={handleEmailTOSend} />
        )}
      </div>

      <button className="btn-send" onClick={handleMsgSend}>
        Send Leave Request
      </button>
    </div>
  );
};

export default SendLeaveRequest;
