import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { sendMessage } from "../network/websocket";
import { getUsername, getUserID } from "../Utils/auth";

function App({ roomname }) {
  const inputRef = useRef();

  function sendMsg() {
    sendMessage(
      {
        type: "message",
        userid: getUserID(),
        username: getUsername(),
        roomname: roomname,
        text: inputRef.current.value,
      }
    );
  }

  return (
    <React.Fragment>
      <TextField fullWidth inputRef={inputRef} />
      <Button color="primary" onClick={sendMsg}>
        send
      </Button>
    </React.Fragment>
  );
}

export default App;
