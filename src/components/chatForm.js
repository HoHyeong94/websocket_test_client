import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { sendMessage, dataChannel } from "../network/websocket";
import { getUsername, getUserID } from "../Utils/auth";

function App({ roomname }) {
  const inputRef = useRef();

  function sendMsg() {
    console.log("Datasend")
    dataChannel.send(inputRef.current.value)
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
