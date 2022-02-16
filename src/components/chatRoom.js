import { List, ListItem, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendMessage } from "../network/websocket";
import { userInfo } from "../Utils/auth";

import ChatForm from "./chatForm";

export let testFunc = () => {};

export default function Main({ chatService }) {
  const [chats, setChats] = useState([]);
  const { roomname } = useParams();

  useEffect(() => {
    testFunc = (data) => {
      setChats(prev => [...prev, data]);
    }
    sendMessage(JSON.stringify({
      type: "Username",
      roomname: roomname,
      username: userInfo.username,
    }))
  }, []);

  return (
    <>
      <List>
        {chats.map((data, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={data} />
            </ListItem>
          );
        })}
      </List>
      <ChatForm roomname={roomname} />
    </>
  );
}
