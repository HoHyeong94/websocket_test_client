import { List, ListItem, Chip, Slider, Stack, Paper } from "@mui/material";
import { Box } from "@mui/system";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendMessage, pcs } from "../network/websocket";
import { getUserID, getUsername } from "../Utils/auth";
import ChatForm from "./chatForm";
import { styled } from "@mui/styles";
import { MessageLeft, MessageRight } from "./message";

export let setChats = () => {};
export let setEnterPeerList = () => {};
export let deleteDisconnectedPeer = () => {};
export let myStream;

const MessageBody = styled(Paper)({
    width: "calc( 100% - 20px )",
    margin: 4,
    overflowY: "auto",
    height: "100%"
})


export default function Main() {
  const [chatlists, setChatlists] = useState([]);
  const [channel, setChannel] = useState([]);
  const { roomname } = useParams();

  async function getMedia() {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  function handleAudioPlay(id, isPlayed) {
    if (isPlayed) {
      document.getElementById(id).pause();
      setChannel((prev) => {
        prev.map(e => {
          if (e.audioid === id) {
            e.isPlayed = !e.isPlayed
          }
          return e;
        })
        return [...prev]; 
      })
    } else {
      document.getElementById(id).play();
      setChannel((prev) => {
        prev.map(e => {
          if (e.audioid === id) {
            e.isPlayed = !e.isPlayed
          }
          return e;
        })
        return [...prev]; 
      })
    }
  }

  function handleAudioVolume(event, newValue, id) { 
    setChannel((prev) => {
      prev.map(e => {
        if (e.audioid === id) {
          e.volume = newValue === 0 ? 0 : newValue / 100;
        }
        return e;
      }) 
      return [...prev];
    })
    document.getElementById(id).volume = newValue === 0 ? 0 : newValue / 100;
  }

  useEffect(() => {
    getMedia()
      .then(() => {
        sendMessage({
          type: "connected_users",
          username: getUsername(),
          userid: getUserID(),
          roomname: roomname,
        });
        setChannel((prev) => [
          ...prev,
          {
            username: getUsername(),
            userid: getUserID(),
            audioid: !!myStream ? myStream.id : null,
            volume: 0.5,
            isPlayed: false
          },
        ]);
      })
      .then(() => {
        if (!!myStream) {
          document.getElementById(myStream.id).srcObject = myStream;
        }
      });
      console.log("chats", chatlists);

    setChats = (data) => {
      setChatlists((prev) => [...prev, data]);
    };

    setEnterPeerList = async (data, mode = false) => {
      if (mode === "audio") {
        for (const [key, value] of pcs) {
          if (
            data.currentTarget.localDescription ===
            value.peerconnection.currentLocalDescription
          ) {
            setChannel((prev) => {
              prev.map((e) => {
                if (e.userid === key) {
                  e.audioid = data.stream.id;
                }
                return e;
              });
              return [...prev];
            });
          }
        }
      } else {
        setChannel((prev) => [
          ...prev,
          {
            username: data.username,
            userid: data.userid,
            volume: data.volume,
            audioid: null,
            isPlayed: false,
          }
        ])
      }
      return data;
    };

    deleteDisconnectedPeer = (id) => {
      setChannel((prev) => {
        return prev.filter((e) => e.userid !== id);
      });
    };
  }, []);

  return (
    <>
      <div
        style={{ position: "fixed", width: "80%", left: "20%", height: "80%" }}
      >
        <MessageBody>
          {chatlists.map((data, index) => {
            return data.sender !== getUsername() ? (
              <MessageLeft
                key={index}
                message={data.text}
                timestamp={`${data.hour} : ${data.minutes}`}
                displayName={data.sender}
              />
            ) : (
              <MessageRight
                key={index}
                message={data.text}
                timestamp={`${data.hour} : ${data.minutes}`}
              />
            );
          })}
        </MessageBody>
      </div>
      <Box
        sx={{ position: "fixed", width: "20%", height: "100%", borderRight: 1 }}
      >
        <List>
          {channel.map((data, index) => {
            return (
              <ListItem key={index}>
                {data.audioid ? (
                  <audio id={data.audioid} />
                ) : (
                  <React.Fragment />
                )}
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={data.username}
                    size="small"
                    disabled={!data.audioid ? true : false}
                    onClick={() => handleAudioPlay(data.audioid, data.isPlayed)}
                  />
                </Stack>
                {data.isPlayed ? <MicIcon /> : <MicOffIcon />}
                <VolumeDown />
                <Slider
                  size="small"
                  min={0}
                  max={100}
                  disabled={!data.isPlayed ? true : false}
                  value={data.volume * 100}
                  onChange={(event, value) =>
                    handleAudioVolume(event, value, data.audioid)
                  }
                />
                <VolumeUp />
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
