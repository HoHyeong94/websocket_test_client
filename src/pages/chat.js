import React from "react";
import { Route, Switch } from "react-router-dom";
import ChatList from "../components/chatList";
import ChatRoom from "../components/chatRoom";

export default function Main({ chatService }) {
  return (
    <Switch>
      <Route exact path="/chats">
        <ChatList chatService={chatService} />
      </Route>
      <Route exact path="/chats/:roomname">
        <ChatRoom chatService={chatService} />
      </Route>
    </Switch>
  );
}