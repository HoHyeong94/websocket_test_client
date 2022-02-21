import { w3cwebsocket as W3CWebSocket } from "websocket";
import { setChats, myPeerConnection } from "../components/chatRoom";
import { setRoomLists } from "../components/roomList"
import { getUsername, getUserID } from "../Utils/auth"


let _socket;
export let dataChannel;


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
        console.log('WebSocket Client Closed');
    };
    
    _socket.onmessage = async function(e) {
        const data = JSON.parse(e.data)
        switch (data.type) {
          case "roomlist":
            setRoomLists(data.data);
            break;
          case "welcome":
            dataChannel = myPeerConnection.createDataChannel("chat");
            dataChannel.addEventListener("message", (e) => {
                console.log("hostDataChannel")
                setChats(e.data);
            });
            const offer = await myPeerConnection.createOffer();
            console.log("create offer", offer);
            myPeerConnection.setLocalDescription(offer);
            sendMessage(
              {
                type: "offer",
                roomname: data.roomname,
                username: getUsername(),
                userid: getUserID(),
                offer: offer,
              }
            );
            break;
            case "offer":
                
                myPeerConnection.addEventListener("datachannel", (event) => {
                    dataChannel = event.channel;
                    dataChannel.addEventListener("message", (e) =>{
                        console.log("remoteChannel")
                        setChats(e.data)
                    }
                    );
                  });
                console.log("get remote Peer Offer", data.offer);
                myPeerConnection.setRemoteDescription(data.offer);
                const answer = await myPeerConnection.createAnswer();
                console.log("create answer", answer);
                myPeerConnection.setLocalDescription(answer);
                sendMessage({
                    type:"answer",
                    answer: answer,
                    roomname: data.roomname,
                    username: getUsername(),
                    userid: getUserID(),
                })
                break;
            case "answer":
                console.log("get remote Peer Answer", data.answer);
                myPeerConnection.setRemoteDescription(data.answer);
                break;
            case "ice":
                console.log("received candidate", data.candidate);
                myPeerConnection.addIceCandidate(data.candidate);
                break;
          // case 'message':
          //     console.log(data)
          //     setChats(data.text)
          //     break;
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


