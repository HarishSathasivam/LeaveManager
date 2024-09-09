import React, { useState, useEffect } from 'react';
import Inbox from "./Inbox";
import axios from "axios";
import Constants from "../../utilities/constans";
import SendLeaveRequest from './SendLeaveRequest';
import ChatBox from './ChatBox';

const LandingPage = (props) => {
  const { currentUser } = props;
  const [newCurrentUser, setNewCurrentUser] = useState(currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurretPage] = useState("inbox");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [newChatText, setNewChatText] = useState("");
  const [ws, setWs] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);

  useEffect(() => {
    refreshCurrentUser(currentUser.email);
    const websocket = new WebSocket(Constants.serverIp + "startWsSession");

    websocket.onopen = () => {
      setWs(websocket);
      console.log("WebSocket connection opened");
    };

    websocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'text') {
        refreshCurrentUser(currentUser.email);
      } else if (data.type === "command" && data.contend === "refreshCurrentUser") {
        refreshCurrentUser(currentUser.email);
      } else if (data.type === "chat") {
		refreshCurrentUser(currentUser.email)

        displayMessage(data.contend);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    websocket.onclose = () => {
      setWs(null);
      console.log('WebSocket connection closed');
    };

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const refreshCurrentUser = async (email) => {
    const token = localStorage.getItem("token");
    const url = `${Constants.serverIp}getUserById?email=${email}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setNewCurrentUser(response.data);
      }
    } catch (error) {
      console.log("error = ", error);
    }
  };

  const sendMessage = (type, contend) => {
	console.log("type = ",type ," contend ",contend)
    if (ws) {
      ws.send(JSON.stringify({ type, contend }));
    }
    if (type === "chat") {
      displayMessage(contend);
    }
  };

  const handleLastMessageId = (id) => {
    setLastMessageId(id);
  };

  const displayMessage = (chatDetail) => {
    const filterChat = chatDetail.chatInfo.receiver.find(receiveUser => currentUser.email === receiveUser || currentUser.email === chatDetail.chatInfo.sender);
    if (filterChat) {
      setNewChatText(chatDetail);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCurretPage = (page, data) => {
    if (page === "chatBox") {
      setSelectedRequest(data);
    }
    setCurretPage(page);
  };

  return (
    <div>
      <div className='landingPage'>
        

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close" onClick={closeModal}>X</button>
                <SendLeaveRequest
                  sendMessage={sendMessage}
                  currentUser={currentUser}
                  closeModal={closeModal}
				  refreshCurrentUser = {refreshCurrentUser}
                />
              </div>
            </div>
          )}
		
		  <div className='navBar'>
		      {currentUser.role === "employee" && <button className='newLeaveRequestBtn' onClick={openModal}>New Leave Request</button>}
		  </div>

        <div className='landingRightSide'>

          {currentPage === "inbox" &&
            <Inbox
              refreshCurrentUser={refreshCurrentUser}
              newCurrentUser={newCurrentUser}
              sendMessage={sendMessage}
              handleCurretPage={handleCurretPage}
            />
          }

          {currentPage === "chatBox" &&
            <ChatBox
              selectedRequest={selectedRequest}
              handleCurretPage={handleCurretPage}
              currentUser={currentUser}
              sendMessage={sendMessage}
              newChatText={newChatText}
              lastMessageId={lastMessageId}
              handleLastMessageId={handleLastMessageId}
              refreshCurrentUser={refreshCurrentUser}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
