import React, { useEffect } from "react";
import { Socket } from "./pages/websocket/index"
function App() {

  useEffect(() => {
    Socket()
  }, [])

  return (
   <div>
     <input>
     </input>
     </div>
  );
}

export default App;
