import { List, Box, ListItemText, ListItemButton, Button, Input } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getUserID, getUsername } from "../Utils/auth";
import { sendMessage } from "../network/websocket";

export let setRoomLists = () => {};

export default function RoomList() {
  const formRef = useRef();
  const [rooms, setRooms] = useState([]);


  function createRoom() {
    const data = Object.fromEntries(new FormData(formRef.current));
    sendMessage(JSON.stringify({
      type: "createroom",
      id: getUserID(),
      username: getUsername(),
      roomname: data.roomname,
    }))
    document.getElementById("createRoomName").value = null;
  }

  useEffect(() => {
    sendMessage(JSON.stringify({
      type: "roomlist",
      // userid: getUserID(),
      // username: getUsername(),
    }))

    setRoomLists = (data) => {
      setRooms(data);
    }
  }, []);

  return (
    <React.Fragment>
      <Box>
        <List>
          {rooms.map((data, index) => {
            return (
              <ListItemButton
                key={index}
                component={Link}
                to={(location) => ({
                  pathname: `${location.pathname}/${data.roomname}`,
                })}
              >
                <ListItemText primary={data.roomname} />
              </ListItemButton>
            );
          })}
        </List>
        <form ref={formRef}>
        <Input id="createRoomName" name="roomname"/>
        <Button onClick={createRoom}>Create</Button>
        </form>
      </Box>
    </React.Fragment>
  );
}
