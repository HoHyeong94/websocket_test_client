import { w3cwebsocket as W3CWebSocket } from "websocket";
import { setChats, myPeerConnection } from "../components/chatRoom";
import { setRoomLists } from "../components/roomList"
import { getUsername, getUserID } from "../Utils/auth"


let _socket;

export async function InitSocket() {
    _socket = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

    _socket.onerror = function() {
        console.log('Connection Error');
    };
    
    _socket.onopen = function() {
        console.log('WebSocket Client Connected');
        sendMessage(JSON.stringify({
            type: "init",
            username: getUsername(),
            userid: getUserID()
          }))
    };
    
    _socket.onclose = function() {
        console.log('WebSocket Client Closed');
    };
    
    _socket.onmessage = async function(e) {
        const data = JSON.parse(e.data)
        console.log(data);
        switch (data.type) {
          case "roomlist":
            setRoomLists(data.data);
            break;
          case "welcome":
            const offer = await myPeerConnection.createOffer();
            console.log(offer);
            myPeerConnection.setLocalDescription(offer);
            sendMessage(
              JSON.stringify({
                type: "offer",
                roomname: data.roomname,
                username: getUsername(),
                userid: getUserID(),
                offer: offer,
              })
            );
            break;
            case "offer":
                myPeerConnection.setRemoteDescription(data.offer);
                const answer = await myPeerConnection.createAnswer();
                myPeerConnection.setLocalDescription(answer);
                sendMessage(JSON.stringify({
                    type:"answer",
                    answer: answer,
                    roomname: data.roomname
                }))
                break;
            case "answer":
                console.log("clientAnswer")
                console.log(data.answer);
                myPeerConnection.setRemoteDescription(data.answer);
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
        _socket.send(data);
    }
}


