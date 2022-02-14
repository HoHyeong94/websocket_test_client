import { w3cwebsocket as W3CWebSocket } from "websocket";

export let socket;

export function Socket() {
    socket = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

    socket.onerror = function() {
        console.log('Connection Error');
    };
    
    socket.onopen = function() {
        console.log('WebSocket Client Connected');
        sendMessage("test")
    };
    
    socket.onclose = function() {
        console.log('echo-protocol Client Closed');
    };
    
    socket.onmessage = function(e) {
        if (typeof e.data === 'string') {
            console.log("Received: '" + e.data + "'");
        }
    };
}

function sendMessage(data) {
 
    if (socket.readyState === socket.OPEN) {
        socket.send(data);
    }
}


