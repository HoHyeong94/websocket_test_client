import { List, ListItem, ListItemText, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { sendMessage } from "../network/websocket";
import { getUserID, getUsername } from "../Utils/auth";
import ChatForm from "./chatForm";

export let myPeerConnection;
export let setChats = () => {};
export let myStream;

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

  async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        })
        console.log(myStream)
        console.log(myStream.getAudioTracks())
    } catch (e) {
        console.log(e)
    }

}
  useEffect(() => {
    getMedia().then(() => {
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
