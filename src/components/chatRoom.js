import { List, ListItem, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatForm from "./chatForm";

export let testFunc = () => {};

export default function Main({ chatService }) {
  const [chats, setChats] = useState([]);
  const { roomname } = useParams();

  useEffect(() => {
    testFunc = (e) => {
      setChats(prev => [...prev, JSON.parse(e)]);
    }
  }, []);

  return (
    <>
      <List>
        {chats.map((data, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={data.text} secondary={data.id} />
            </ListItem>
          );
        })}
      </List>
      <ChatForm roomname={roomname} />
    </>
  );
}
