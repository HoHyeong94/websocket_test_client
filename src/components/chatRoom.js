import { List, ListItem, ListItemText, Button } from "@mui/material";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { sendMessage, pcs } from "../network/websocket";
import { getUserID, getUsername } from "../Utils/auth";
import ChatForm from "./chatForm";

export let myPeerConnection;
export let setChats = () => {};
export let setPeers = () => {};
export let myStream;
export const peerAudioRef = createRef();


export default function Main() {
  const [chatlists, setChatlists] = useState([]);
  const [audioChannel, setAudioChannel] = useState([]);
  const myaudioRef = useRef()
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

  async function getMedia() {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      myaudioRef.current.srcObject = myStream;
    } catch (e) {
      console.log(e);
    }
  }

  function connectedPeers() {

  }

  useEffect(() => {
    getMedia().then(() => {
      // getAudios()
      sendMessage({
        type: "all_users",
        username: getUsername(),
        userid: getUserID(),
        roomname: roomname
      })
    })
    setChats = (data) => {
      setChatlists(prev => [...prev, data]);
    }
    setPeers = (data) => {
      console.log("setAudioChannels")
      console.log(data.currentTarget.localDescription);
      for (const [key, value] of pcs) {
        console.log(value.peerconnection.currentLocalDescription)
      }
      console.log(pcs);
     
      setAudioChannel(prev => [...prev, {username: "peer audio", id: data.stream.id}])
      document.getElementById(data.stream.id).srcObject = data.stream
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
      <figcaption>My audio</figcaption>
      <audio ref={myaudioRef} controls />
      <List>
        {audioChannel.map((data, index) => {
          return (
            <ListItem key={index}>
              <figcaption>{data.username}</figcaption>
              <audio id={data.id} controls></audio>
            </ListItem>
          );
        })}
      </List>
      <ChatForm roomname={roomname} />
      <Button color="primary" onClick={sendExit}>
        exit
      </Button>
    </>
  );
}
