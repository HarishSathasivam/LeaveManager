import React, { useState, useRef, useEffect } from 'react';
import SendLeaveRequest from './SendLeaveRequest'


const ConnectUsers = (props) => {

  let{currentUser,refreshCurrentUser} = props;

  const [localStream, setLocalStream] = useState(null);
  const [pc1, setPc1] = useState(null);
  const [pc2, setPc2] = useState(null);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatRef = useRef(null);
  const [videoChat, setVideoChat] = useState(false)

  useEffect(() => {
    const websocket = new WebSocket("ws://192.168.1.69:8080/startWsSession");

    websocket.onopen = () => {
      setWs(websocket);
      console.log("WebSocket connection opened");
     // alert("Session started successfully");
    };

    websocket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === 'offer') {
        handleOffer(data.offer);
      } else if (data.type === 'answer') {
        handleAnswer(data.answer);
      } else if (data.type === 'candidate') {
        handleCandidate(data.candidate);
      } else if (data.type === 'text') {
        displayMessage(data.text, data.text.sender);
        refreshCurrentUser(currentUser.email)
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

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      const peer1 = new RTCPeerConnection();
      const peer2 = new RTCPeerConnection();

      peer1.addEventListener('icecandidate', (event) => {
        if (event.candidate && ws) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      });

      peer2.addEventListener('icecandidate', (event) => {
        if (event.candidate && ws) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      });

      peer2.addEventListener('track', (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      });

      stream.getTracks().forEach((track) => peer1.addTrack(track, stream));

      setPc1(peer1);
      setPc2(peer2);

      const offer = await peer1.createOffer();
      await peer1.setLocalDescription(offer);
      if (ws) {
        ws.send(JSON.stringify({ type: 'offer', offer: offer }));
      }
    } catch (e) {
      alert(`getUserMedia() error: ${e.name}`);
    }
  };

  const call = async () => {
    if (!localStream) {
      await start();
    }

    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: 'offer', offer: offer }));
  };

  const handleOffer = async (offer) => {
    if (!pc2) {
      const newPc2 = new RTCPeerConnection();
      newPc2.addEventListener('icecandidate', (event) => {
        if (event.candidate && ws) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      });
      newPc2.addEventListener('track', (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      });
      setPc2(newPc2);

      await newPc2.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await newPc2.createAnswer();
      await newPc2.setLocalDescription(answer);
      if (ws) {
        ws.send(JSON.stringify({ type: 'answer', answer: answer }));
      }
    } else {
      await pc2.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc2.createAnswer();
      await pc2.setLocalDescription(answer);
      if (ws) {
        ws.send(JSON.stringify({ type: 'answer', answer: answer }));
      }
    }
  };

  const handleAnswer = async (answer) => {
    if (pc1) {
      await pc1.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = (candidate) => {
    const rtcCandidate = new RTCIceCandidate(candidate);
    if (pc1 && pc1.remoteDescription) {
      pc1.addIceCandidate(rtcCandidate);
    } else if (pc2 && pc2.remoteDescription) {
      pc2.addIceCandidate(rtcCandidate);
    }
  };

  const hangup = () => {
    if (pc1) {
      pc1.close();
      setPc1(null);
    }
    if (pc2) {
      pc2.close();
      setPc2(null);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  const sendMessage = (message) => {
    const text = message;

    displayMessage(text, text.receiver);
    if (ws) {
      ws.send(JSON.stringify({ type: 'text', text: text }));
    }
    refreshCurrentUser(currentUser.email)
    setMessage('');
  };

  const displayMessage = (text, sender) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${text.command}`;
    chatRef.current.appendChild(messageElement);
  };

  return (
    <div>
      {videoChat && <div>
        <video ref={localVideoRef} autoPlay playsInline></video>
        <video ref={remoteVideoRef} autoPlay playsInline></video>
        <br />
        <button onClick={start}>Start</button>
        <button onClick={call}>Call</button>
        <button onClick={hangup}>Hang Up</button>
      </div>}
      <br />
      
      <div ref={chatRef}></div>


    </div>
  );
};

export default ConnectUsers;
