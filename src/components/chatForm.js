import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { dataChannels, pcs } from "../network/websocket";
import { setChats } from "./chatRoom";


function App({ roomname }) {
  const inputRef = useRef();

  function sendMsg() {
    console.log("Datasend")
    console.log(dataChannels);
    setChats(inputRef.current.value)
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
