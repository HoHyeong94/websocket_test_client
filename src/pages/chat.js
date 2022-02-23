import React from "react";
import { Route, Switch } from "react-router-dom";
import RoomList from "../components/roomList";
import ChatRoom from "../components/chatRoom";

export default function Main() {
  return (
    <Switch>
      <Route exact path="/chats">
        <RoomList />
      </Route>
      <Route exact path="/chats/:roomname">
        <ChatRoom />
      </Route>
    </Switch>
  );
}