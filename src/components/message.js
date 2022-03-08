import React from "react";
import { styled } from "@mui/styles";

const MessageRightWrapper = styled('div')(() => ({
    display: "flex",
    justifyContent: "flex-end",

    [`& .messageRight`]: {
        position: "relative",
        marginRight: "20px",
        marginBottom: "10px",
        padding: "4px",
        backgroundColor: "#f8e896",
        width: "auto",
        maxWidth: "50%",
        textAlign: "right",
        font: "400 .9em 'Open Sans', sans-serif",
        border: "1px solid #dfd087",
        borderRadius: "10px",
        "&:after": {
          content: "''",
          position: "absolute",
          width: "0",
          height: "0",
          borderTop: "15px solid #f8e896",
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          top: "0",
          right: "-15px"
        },
        "&:before": {
          content: "''",
          position: "absolute",
          width: "0",
          height: "0",
          borderTop: "17px solid #dfd087",
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          top: "-1px",
          right: "-17px"
        },
        [`& > div`]: {
            fontSize: ".70em",
            fontWeight: "300",
            marginTop: "10px",
            textAlign: "right",
        },
        [`& > p`]: {
            wordBreak: "break-all",
            whiteSpace: "normal",
            padding: 0,
            margin: 0
        }
    },


}))

const MessageLeftWrapper = styled('div')(() => ({
    display: "flex",
    [`& .displayName`]: {
        marginLeft: "20px",
        fontSize: ".85em",
    },
    [`& .messageLeft`]: {
        position: "relative",
        marginLeft: "20px",
        marginBottom: "10px",
        padding: "4px",
        backgroundColor: "#D3D3D3",
        width: "auto",
        maxWidth: "50%",
        textAlign: "left",
        font: "400 .9em 'Open Sans', sans-serif",
        border: "1px solid #D3D3D3",
        borderRadius: "10px",
        "&:after": {
          content: "''",
          position: "absolute",
          width: "0",
          height: "0",
          borderTop: "15px solid #D3D3D3",
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          top: "0",
          left: "-15px"
        },
        "&:before": {
          content: "''",
          position: "absolute",
          width: "0",
          height: "0",
          borderTop: "17px solid #D3D3D3",
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          top: "-1px",
          left: "-17px"
        },
        [`& > div`]: {
            fontSize: ".70em",
            fontWeight: "300",
            marginTop: "10px",
            textAlign: "right",
        },
        [`& > p`]: {
            wordBreak: "break-all",
            whiteSpace: "normal",
            padding: 0,
            margin: 0
        }
    }

}))

export const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const displayName = props.displayName ? props.displayName : "unknown";
  return (
    <MessageLeftWrapper>
      <div>
        <div className="displayName">{displayName}</div>
        <div className="messageLeft">
          <p>{message}</p>
          <div>{timestamp}</div>
        </div>
      </div>
    </MessageLeftWrapper>
  );
};

export const MessageRight = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <MessageRightWrapper>
      <div className="messageRight">
        <p>{message}</p>
        <div>{timestamp}</div>
      </div>
    </MessageRightWrapper>
  );
};
