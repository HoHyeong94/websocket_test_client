import { w3cwebsocket as W3CWebSocket } from "websocket";
import { testFunc } from "../components/chatRoom";


let _socket;

export async function InitSocket() {
    _socket = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

    _socket.onerror = function() {
        console.log('Connection Error');
    };
    
    _socket.onopen = function() {
        console.log('WebSocket Client Connected');
    };
    
    _socket.onclose = function() {
        console.log('echo-protocol Client Closed');
    };
    
    _socket.onmessage = function(e) {
        // console.log(e.data)
        testFunc(e.data);
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


