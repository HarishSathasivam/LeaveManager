import React, { useState, useEffect, useRef } from 'react';
import '../../css/ChatBox.css'; 
import axios from 'axios';
import Constants from "../../utilities/constans";

const ChatBox = (props) => {
  const { currentUser, selectedRequest, handleCurretPage, sendMessage, newChatText, lastMessageId, handleLastMessageId, refreshCurrentUser } = props;
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [showRecipientSelection, setShowRecipientSelection] = useState(false);
  const [chat, setChat] = useState('');
  const chatDisplayRef = useRef(null);

  const receivers = selectedRequest ? JSON.parse(selectedRequest.receiver) : [];

  console.log("selectedRequest = ",selectedRequest)
  useEffect(() => {
    if (currentUser.role === "employee") {
      if (receivers.length > 1) {
        setShowRecipientSelection(true);
      } else if (receivers.length === 1) {
        setSelectedRecipients([receivers[0]]);
      }
    } else {
      setSelectedRecipients([selectedRequest.sender]);
    }
  }, [selectedRequest]);

  useEffect(() => {
    if (newChatText && chatDisplayRef.current && selectedRequest.requestId === newChatText.requestId) {
      if (newChatText.id !== lastMessageId) {
        appendChatMessage(newChatText.chatInfo);
        handleLastMessageId(newChatText.id);
      }
    }
  }, [newChatText, lastMessageId, selectedRequest.requestId, currentUser.email]);

  const handleBack = () => {
    handleCurretPage("inbox", "");
  };

  const handleRecipientChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedRecipients(selectedOptions);
  };

  const handleChatStart = () => {
    setShowRecipientSelection(false);
  };

  const handleSendChat = async () => {
    if (!chat.trim()) return;

    const chatInfo = {
      sender: currentUser.email,
      receiver: selectedRecipients,
      text: chat,
      time: new Date().toISOString(),
      requestId: selectedRequest.requestId,
    };

    saveChatInfo(chatInfo);
    setChat('');
  };

  const saveChatInfo = async (chatDetails) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${Constants.serverIp}saveChat`, chatDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        refreshCurrentUser(currentUser.email);
        const sendMsgData = { id: `${Date.now()}-${Math.random()}`, requestId: selectedRequest.requestId, chatInfo: chatDetails };
        sendMessage("chat", sendMsgData);
      } else {
        console.log(`Save failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChat = (e) => {
    setChat(e.target.value);
  };

  const appendChatMessage = (chatInfo) => {
    const chatElement = document.createElement('div');
    chatElement.className = `chat-message ${chatInfo.sender === currentUser.email ? 'sent' : 'received'}`;
    const chatBubble = document.createElement('div');
    chatBubble.className = `chat-bubble ${chatInfo.sender === currentUser.email ? 'sent' : 'received'}`;
    chatBubble.innerHTML = `<strong>${chatInfo.sender.split('@')[0]}</strong><br><br><span>${chatInfo.text}</span><br><br><small>${new Date(chatInfo.time).toLocaleString()}</small>`;
    chatElement.appendChild(chatBubble);
    chatDisplayRef.current.appendChild(chatElement);
    chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
  };

  const handleChatToDisplay = (chat) => {
    return (
      <div
        className={`chat-message ${currentUser.email === chat.sender ? 'sent' : 'received'}`}
        key={chat.id}
      >
        <div className={`chat-bubble ${currentUser.email === chat.sender ? 'sent' : 'received'}`}>
          <strong>{chat.sender.split('@')[0]}</strong><br /><br />
          <span>{chat.text}</span><br /><br />
          <small>at : {new Date(chat.time).toLocaleString()}</small>
        </div>
      </div>
    );
  };

  const sortedChatDetails = selectedRequest.chatDetails ? [...selectedRequest.chatDetails].sort((a, b) => new Date(a.time) - new Date(b.time)) : [];

  return (
    <div className="chatbox-container">
      <h3>Chatbox loaded</h3>
      <button onClick={handleBack} className="back-button">Back</button>

      {showRecipientSelection && (
        <div className="modal">
          <div className="modal-content">
            <h4>Select recipients to chat with:</h4>
            <select id="recipients" multiple onChange={handleRecipientChange} className="recipients-select">
              {receivers.map((recipient, index) => (
                <option key={index} value={recipient}>
                  {recipient.split('@')[0]}
                </option>
              ))}
            </select>
            <button onClick={handleChatStart} className="chat-start-button">Start Chat</button>
          </div>
        </div>
      )}
      
      <div className='receiverName'>
        {selectedRecipients.map((recipient, index) => (
          <span key={index} value={recipient}>
            {recipient.split('@')[0]} {' '}
          </span>
        ))}
      </div>
      <div ref={chatDisplayRef} className="chat-display">
        {sortedChatDetails.map((chat) => handleChatToDisplay(chat))}
      </div>

      <div>
        <input value={chat} onChange={handleChat} type="text" placeholder="Let's talk ..." />
        <button onClick={handleSendChat}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
