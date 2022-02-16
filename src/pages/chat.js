import React from "react";
import { Route, Switch } from "react-router-dom";
import RoomList from "../components/roomList";
import ChatRoom from "../components/chatRoom";

export default function Main({ chatService }) {
  return (
    <Switch>
      <Route exact path="/chats">
        <RoomList chatService={chatService} />
      </Route>
      <Route exact path="/chats/:roomname">
        <ChatRoom chatService={chatService} />
      </Route>
    </Switch>
  );
}