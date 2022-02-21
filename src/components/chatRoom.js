import { List, ListItem, ListItemText, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { sendMessage } from "../network/websocket";
import { getUserID, getUsername } from "../Utils/auth";
import ChatForm from "./chatForm";

export let myPeerConnection;
export let peers = [];
export let setChats = () => {};

export default function Main() {
  const [chatlists, setChatlists] = useState([]);
  const { roomname } = useParams();
  const history = useHistory()

  function sendExit() {
    sendMessage(
      {
        type: "exit",
        userid: getUserID(),
        username: getUsername(),
        roomname: roomname,
      }
    );
    history.goBack();
  }

  function handleIce(data) {
    console.log("handleIce called");
    // console.log("handleIce called", data);

    sendMessage({
      type: "ice",
      candidate: data.candidate,
      roomname: roomname,
      userid: getUserID(),
      username: getUsername(),
    })
  }

  useEffect(() => {
    if (!myPeerConnection) {
      myPeerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              // "stun:stun1.l.google.com:19302",
              // "stun:stun2.l.google.com:19302",
              // "stun:stun3.l.google.com:19302",
              // "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });
    }
    myPeerConnection.addEventListener("icecandidate", handleIce);
    peers.push({
      username: getUsername(),
      userid: getUserID(),
      peer: myPeerConnection
    })

    sendMessage(
      {
        type: "join_room",
        userid: getUserID(),
        username: getUsername(),
        roomname: roomname,
      }
    );
    setChats = (data) => {
      setChatlists(prev => [...prev, data]);
    }
  }, []);

  return (
    <>
      <List>
        {chatlists.map((data, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={data} />
            </ListItem>
          );
        })}
      </List>
      <ChatForm roomname={roomname} />
      <Button color="primary" onClick={sendExit}>exit</Button>
    </>
  );
}
