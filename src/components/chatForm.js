import { Button, TextField } from "@mui/material";
import React, { useRef } from "react";
import { sendMessage } from "../network/websocket";

function App({ roomname }) {
  const inputRef = useRef();

  function sendMsg() {
    sendMessage(
      JSON.stringify({
        id: 1,
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
