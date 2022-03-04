import { w3cwebsocket as W3CWebSocket } from "websocket";
import { myStream, setChats, setEnterPeerList, deleteDisconnectedPeer } from "../components/chatRoom";
import { setRoomLists } from "../components/roomList"
import { getUsername, getUserID } from "../Utils/auth"


export let dataChannels = [];
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
      sendMessage({
        type: "ice",
        candidate: e.candidate,
        roomname: roomname,
        remoteUserid: userid,
        remoteUsername: username,
        localUsername: getUsername(),
        localUserid: getUserID()
      })
    }
    pc.addEventListener("addstream", handleAddStream);
    
    if (!!myStream) {
        myStream.getTracks().forEach((track) => {
            pc.addTrack(track, myStream)
        })
    }
    return pc;
}

function handleAddStream(data) {
    setTimeout(() => {
      setEnterPeerList(data, "audio").then(() => {
        document.getElementById(data.stream.id).srcObject = data.stream;
      });
    }, 100);
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
        case "connected_users":
          let allUsers = data.connectedUsers.filter((e) => e.userid !== getUserID());
          console.log("users:", allUsers);

          allUsers.forEach(async (user) => {
            const pc = createPeerConnection(
              user.userid,
              user.username,
              user.roomname
            );

            pcs.set(user.userid, {
              userid: user.userid,
              username: user.username,
              roomname: user.roomname,
              peerconnection: pc,
            });

            setEnterPeerList({
              userid: user.userid,
              username: user.username,
              roomname: user.roomname,
              volume: 0.5
            });

            let dataChannel = pc.createDataChannel(user.username);
            dataChannel.addEventListener("message", (e) => {
              console.log("hostDataChannel");
              setChats(e.data);
            });
            dataChannels.push(dataChannel);
            const localSdp = await pc.createOffer();
            console.log("create offer");
            await pc.setLocalDescription(localSdp);
            sendMessage({
              type: "offer",
              roomname: user.roomname,
              localUsername: getUsername(),
              localUserid: getUserID(),
              remoteUsername: user.username,
              remoteUserid: user.userid,
              offer: localSdp,
            });
          });
          break;
        case "roomlist":
          setRoomLists(data.data);
          break;
        case "offer":
          console.log("clientOffer called");
          const pc2 = createPeerConnection(
            data.remoteUserid,
            data.remoteUsername,
            data.roomname
          );
          
          pcs.set(data.remoteUserid, {
            userid: data.remoteUserid,
            username: data.remoteUsername,
            roomname: data.roomname,
            peerconnection: pc2,
          });

          setEnterPeerList({
            userid: data.remoteUserid,
            username: data.remoteUsername,
            roomname: data.roomname,
            volume: 0.5
          });

          let dataChannel2 = pc2.createDataChannel(data.remoteUsername);
          dataChannel2.addEventListener("message", (e) => {
            console.log("hostDataChannel");
            setChats(e.data);
          });
          
          dataChannels.push(dataChannel2);
          pc2.addEventListener("datachannel", (event) => {
            let dataChannel = event.channel;
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
            remoteUsername: data.remoteUsername,
            remoteUserid: data.remoteUserid,
            localUsername: getUsername(),
            localUserid: getUserID(),
          });
          break;
        case "answer":
          console.log("get remote Peer Answer");
          pcs
            .get(data.remoteUserid)
            .peerconnection.addEventListener("datachannel", (event) => {
              let dataChannel = event.channel;
              dataChannel.addEventListener("message", (e) => {
                console.log("remoteChannel");
                setChats(e.data);
              });
            });
          pcs.get(data.remoteUserid).peerconnection.setRemoteDescription(data.answer);
          break;
        case "ice":
          console.log("received candidate");
          pcs
            .get(data.remoteUserid)
            .peerconnection.addIceCandidate(data.candidate);
          break;
        case "exit":
          if (data.userid === getUserID()) {
            for (const [key, value] of pcs) {
              value.peerconnection.close();
              pcs.delete(key);
              deleteDisconnectedPeer(key);
            }
          } else {
            pcs.get(data.userid).peerconnection.close();
            pcs.delete(data.userid);
            deleteDisconnectedPeer(data.userid);
          }
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