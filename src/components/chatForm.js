import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { sendMessage } from "../network/websocket";

function App({ roomname }) {
  const inputRef = useRef();

  function sendMsg() {
    sendMessage(
      JSON.stringify({
        type: "Message",
        id: Math.floor(Math.random() * 10),
        roomname: roomname,
        text: inputRef.current.value,
      })
    );
  }

  return (
    <React.Fragment>
      <TextField fullWidth inputRef={inputRef} />
      <Button fullWidth color="primary" onClick={sendMsg}>
        send
      </Button>
    </React.Fragment>
  );
}

export default App;
