import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import { dataChannels, pcs, sendMessage } from "../network/websocket";
import { setChats } from "./chatRoom";
import { getUserID, getUsername } from "../Utils/auth";


function App({ roomname }) {
  const inputRef = useRef();
  const history = useHistory()

  function sendMsg() {
    setChats(inputRef.current.value)
    dataChannels.forEach(pc => {
      if (pc.readyState === "open") {
        pc.send(inputRef.current.value)
      }
    })
    inputRef.current.value = "";
  }

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
      <Button color="primary" onClick={sendExit}>
        exit
      </Button>
    </React.Fragment>
  );
}

export default App;
