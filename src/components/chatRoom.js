import { Button, ButtonGroup, List, ListItem, ListItemText, Chip } from "@mui/material";
import { Box } from "@mui/system";
import MicOffIcon from '@mui/icons-material/MicOff';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendMessage, pcs } from "../network/websocket";
import { getUserID, getUsername } from "../Utils/auth";
import ChatForm from "./chatForm";

export let myPeerConnection;
export let setChats = () => {};
export let setEnterPeerList = () => {};
export let deleteDisconnectedPeer = () => {};
export let myStream;


export default function Main() {
  const [chatlists, setChatlists] = useState([]);
  const [audioChannel, setAudioChannel] = useState([]);
  const { roomname } = useParams();

  async function getMedia() {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      console.log("myStream")
      console.log(myStream);
    } catch (e) {
      console.log(e);
    }
  }

  function handleAudioPlay(id, isPlayed) {
    if (isPlayed) {
      document.getElementById(id).pause();
      setAudioChannel((prev) => {
        prev.map(e => {
          if (e.audioid === id) {
            e.isPlayed = !e.isPlayed
          }
          return e;
        })
        return prev; 
      })
    } else {
      document.getElementById(id).play();
      setAudioChannel((prev) => {
        prev.map(e => {
          if (e.audioid === id) {
            console.log("called")
            e.isPlayed = !e.isPlayed
          }
          return e;
        })
        return prev; 
      })
    }
  }

  function handleAudioPause(id) {
    document.getElementById(id).pause();
  }

  function handleAudioVolumeUp(id) {
    document.getElementById(id).volume += 0.1;
  }

  function handleAudioVolumeDown(id) {
    document.getElementById(id).volume -= 0.1;
  }

  useEffect(() => {
    getMedia()
      .then(() => {
        sendMessage({
          type: "all_users",
          username: getUsername(),
          userid: getUserID(),
          roomname: roomname,
        });
        setAudioChannel((prev) => [
          ...prev,
          {
            username: getUsername(),
            userid: getUserID(),
            audioid: myStream.id,
            isPlayed: false
          },
        ]);
      })
      .then(() => {
        document.getElementById(myStream.id).srcObject = myStream;
      });

    setChats = (data) => {
      setChatlists((prev) => [...prev, data]);
    };

    setEnterPeerList = async (data) => {
      console.log("setConnectedPeer");
      for (const [key, value] of pcs) {
        if (
          data.currentTarget.localDescription ===
          value.peerconnection.currentLocalDescription
        ) {
          setAudioChannel((prev) => [
            ...prev,
            {
              username: value.username,
              userid: value.userid,
              audioid: data.stream.id,
              isPlayed: false
            },
          ]);
          return;
        }
      }
      return data;
    };

    deleteDisconnectedPeer = (id) => {
      setAudioChannel((prev) => {
        return prev.filter((e) => e.userid !== id);
      });
    };
  }, []);

  return (
    <>
      <Box sx={{ position: "fixed", width: "80%", left: "30%", height: "80%" }}>
        <List>
          {chatlists.map((data, index) => {
            return (
              <ListItem key={index}>
                <ListItemText primary={data} />
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box
        sx={{ position: "fixed", width: "20%", height: "100%", borderRight: 1 }}
      >
        <List>
          {audioChannel.map((data, index) => {
            return (
              <ListItem key={index}>
                <Chip
                  label={data.username}
                  onClick={() => handleAudioPlay(data.audioid, data.isPlayed)}
                />
                {data.isPlayed ? <React.Fragment /> : <MicOffIcon />}
                <audio id={data.audioid}></audio>
                <ButtonGroup variant="outlined">
                  {/* <Button onClick={() => handleAudioPlay(data.audioid)}>
                    Play
                  </Button>
                  <Button onClick={() => handleAudioPause(data.audioid)}>
                    Pause
                  </Button> */}
                  <Button onClick={() => handleAudioVolumeUp(data.audioid)}>
                    Vol +
                  </Button>
                  <Button onClick={() => handleAudioVolumeDown(data.audioid)}>
                    Vol -
                  </Button>
                </ButtonGroup>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: "20%",
          width: "80%",
        }}
      >
        <ChatForm roomname={roomname} />
      </Box>
    </>
  );
}
