import { List, Box, ListItemText, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RoomList({chatService}) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        chatService.getChatRooms().then((rooms) => {
            setRooms([...rooms])
        })
     
    }, [])

    return (
        <React.Fragment>
            <Box>
                <List>
                    {rooms.map((data, index)  => {
                        return (
                          <ListItemButton
                            key={index}
                            component={Link}
                            to={(location) => ({
                              pathname: `${location.pathname}/${data.name}`,
                            })}
                          >
                            <ListItemText primary={data.name} />
                          </ListItemButton>
                        );
                    })}
                </List>
            </Box>
        </React.Fragment>
    )
}
