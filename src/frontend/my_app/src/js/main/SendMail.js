import React, { useState, useEffect } from "react";

const SendMail = (props) => {
  const { data, handleEmailTOSend } = props;
  const receivers = JSON.parse(data.receiver);
  const [ccReceivers, setCcReceivers] = useState([]);
  const [showccReceivers, setShowccReceivers] = useState(true);

  useEffect(() => {
    if (receivers.length < 1) {
      setShowccReceivers(true);
      handleSendEmailWithoutCC();
    }
  }, []);

  const handleCcChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setCcReceivers(selectedOptions);
    handleSendEmail();
  };

  const handleSendEmailWithoutCC = () => {
    let emailInfo = {
      to: receivers[0],
      cc: [],
      subject: `Request for leave ${data.sender}`,
      text: data.command,
      from: data.sender,
    };

    handleEmailTOSend(emailInfo);
  };

  const handleSendEmail = () => {
    const toReceivers = receivers.filter((receiver) => !ccReceivers.includes(receiver));

    let emailInfo = {
      to: toReceivers[0],
      cc: ccReceivers,
      subject: `Request for leave ${data.sender}`,
      text: data.command,
      from: data.sender,
    };

    handleEmailTOSend(emailInfo);
  };

  return (
    <div className="send-email-container"><br/>
      {showccReceivers && (
        <div className="send-email-form">
          <div className="form-group">
            <label htmlFor="cc-receivers">Select CC Recipients:</label><br/>
            <br />
            <select id="cc-receivers" multiple onChange={handleCcChange}>
              {receivers.map((receiver, index) => (
                <option key={index} value={receiver}>
                  {receiver}
                </option>
              ))}
            </select>
          </div>
          <div className="button-container"></div>
        </div>
      )}
    </div>
  );
};

export default SendMail;
