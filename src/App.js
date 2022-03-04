import { Switch, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { InitSocket } from "./network/websocket";
import ChatPage from "./pages/chat";
import { userInfoStore } from "./Utils/auth";

function App() {
  const [isLoad, setLoaded] = useState(false);

  useEffect(() => {
    userInfoStore.getState().setUsername(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
    userInfoStore.getState().setUserID(Date.now());
    InitSocket().then(() => {

      setLoaded(true);
    });
  }, []);

  return (
    <div>
      {isLoad ? (
        <Switch>
          <Route exact path="/">
            <h1>Home</h1>
            <Link to="/chats">chat</Link>
          </Route>
          <Route path="/chats">
            <ChatPage />
          </Route>
        </Switch>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
}

export default App;
