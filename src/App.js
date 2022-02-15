import { Switch, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { InitSocket, getSocket } from "./network/websocket";
import ChatRoom from "./pages/chat";
import HttpClient from "./network/http";
import ChatService from "./service/chat";

const baseURL = "http://localhost:8080";
const httpClient = new HttpClient(baseURL);
let chatService;

function App() {
  const [isLoad, setLoaded] = useState(false);
  useEffect(() => {
    InitSocket().then(() => {
      chatService = new ChatService(httpClient, getSocket());
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
            <ChatRoom chatService={chatService} />
          </Route>
        </Switch>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
}

export default App;
