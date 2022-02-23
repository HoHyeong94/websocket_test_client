import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { sendMessage, dataChannels, pcs } from "../network/websocket";
import { getUsername, getUserID } from "../Utils/auth";

function App({ roomname }) {
  const inputRef = useRef();

  function sendMsg() {
    console.log("Datasend")
    // dataChannel.send(inputRef.current.value) // multi datachannel 지원하도록 수정예정
    console.log(dataChannels);
    dataChannels.forEach(pc => {
      if (pc.readyState === "open") {
        pc.send(inputRef.current.value)
      }
    })
  }

  function checkPcs() {
    console.log(pcs);
  }

  return (
    <React.Fragment>
      <TextField fullWidth inputRef={inputRef} />
      <Button color="primary" onClick={sendMsg}>
        send
      </Button>
      <Button color="primary" onClick={checkPcs}>
        check
      </Button>
    </React.Fragment>
  );
}

export default App;
