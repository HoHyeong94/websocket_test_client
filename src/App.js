import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Socket } from "./websocket/index";

function App() {
  const inputRef = useRef();

  function sendMsg() {}

  useEffect(() => {
    Socket();
  }, []);

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
