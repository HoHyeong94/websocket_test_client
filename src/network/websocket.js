import { w3cwebsocket as W3CWebSocket } from "websocket";
import { setChats, myPeerConnection } from "../components/chatRoom";
import { setRoomLists } from "../components/roomList"
import { getUsername, getUserID } from "../Utils/auth"


export let dataChannels = [];
export let allUsers;
export let pcs = new Map();

let _socket;
const pc_config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};
  

function createPeerConnection(userid, username, roomname) {
    const pc = new RTCPeerConnection(pc_config)

    pc.onicecandidate = (e) => {
      console.log('onicecandidate');
      sendMessage({
        type: "ice",
        candidate: e.candidate,
        roomname: roomname,
        userid: userid,
        username: username,
        sendUsername: getUsername(),
        sendUserid: getUserID()
        // receiveID: userid,
        // receiveusername: username
      })
    }
    return pc;
  }


export async function InitSocket() {
    _socket = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

    _socket.onerror = function() {
        console.log('Connection Error');
    };
    
    _socket.onopen = function() {
        console.log('WebSocket Client Connected');
        sendMessage({
            type: "init",
            username: getUsername(),
            userid: getUserID()
        })
    };
    
    _socket.onclose = function() {
        sendMessage({
            type: "exit",
            username: getUsername(),
            userid: getUserID()
        })
        console.log('WebSocket Client Closed');
    };
    
    _socket.onmessage = async function (e) {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "all_users":
          allUsers = data.data.filter((e) => e.userid !== getUserID());
          console.log("users:", allUsers);

          allUsers.forEach(async (user) => {
            const pc = createPeerConnection(
              user.userid,
              user.username,
              user.roomname
            );
            console.log(user.userid);

            pcs.set(user.userid, {
              userid: user.userid,
              username: user.username,
              roomname: user.roomname,
              peerconnection: pc,
            });

            let dataChannel = pc.createDataChannel(user.username);
            dataChannel.addEventListener("message", (e) => {
              console.log("hostDataChannel");
              setChats(e.data);
            });
            dataChannels.push(dataChannel);
            const localSdp = await pc.createOffer();
            console.log("create offer", localSdp);
            await pc.setLocalDescription(localSdp);
            sendMessage({
              type: "offer",
              roomname: user.roomname,
              sendUsername: getUsername(),
              sendUserid: getUserID(),
              username: user.username,
              userid: user.userid,
              offer: localSdp,
            });
          });
          break;
        case "roomlist":
          setRoomLists(data.data);
          break;
        case "offer":
          // let pc = pcs.get(data.userid).peerconnection
          console.log("clientOffer called");
          const pc2 = createPeerConnection(
            data.offerUserid,
            data.offerUsername,
            data.roomname
          );
         
          pcs.set(data.offerUserid, {
            userid: data.offerUserid,
            username: data.offerUsername,
            roomname: data.roomname,
            peerconnection: pc2,
          });

          let dataChannel2 = pc2.createDataChannel(data.offerUsername);
          dataChannel2.addEventListener("message", (e) => {
            console.log("hostDataChannel");
            setChats(e.data);
          });
          console.log(dataChannel2);
          dataChannels.push(dataChannel2);
          pc2.addEventListener("datachannel", (event) => {
            let dataChannel = event.channel;
            // dataChannels.push(dataChannel);
            dataChannel.addEventListener("message", (e) => {
              console.log("remoteChannel");
              setChats(e.data);
            });
          });
          console.log("get remote Peer Offer", data.offer);

          pc2.setRemoteDescription(data.offer);
          const answer = await pc2.createAnswer();
          pc2.setLocalDescription(answer);

          console.log("create answer", answer);

          sendMessage({
            type: "answer",
            answer: answer,
            roomname: data.roomname,
            sendUsername: data.offerUsername,
            sendUserid: data.offerUserid,
            username: data.username,
            userid: data.userid,
          });
          break;
        case "answer":
          console.log("get remote Peer Answer", data.answer);
          console.log(pcs);
          pcs.get(data.userid).peerconnection.addEventListener("datachannel", (event) => {
            let dataChannel = event.channel;
            dataChannel.addEventListener("message", (e) => {
              console.log("remoteChannel");
              setChats(e.data);
            });
          });
          pcs.get(data.userid).peerconnection.setRemoteDescription(data.answer);
          break;
        case "ice":
          console.log("received candidate");
          //   if (data.userid === getUserID()) return;
          pcs
            .get(data.sendUserid)
            .peerconnection.addIceCandidate(data.candidate);
          break;
        default:
          console.log("Can't match Data type");
          break;
      }
    };
}

export function getSocket() {
    return _socket;
}

export function sendMessage(data) {
    if (_socket.readyState === _socket.OPEN) {
        if (typeof data === String) {
            _socket.send(data);
        } else {
            _socket.send(JSON.stringify(data));
        }
    }
}