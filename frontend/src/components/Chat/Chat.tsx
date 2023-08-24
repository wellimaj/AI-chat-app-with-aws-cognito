import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";
import ChatItem from "./ChatItem";
import { fetchApi } from "../../Utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
const ChatContainer = styled(Box)`
  height: 100%;
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  position: static;
`;
const ChatMessgageConatiner = styled(Box)`
  height: fit-content;
  min-height: 80%;
  width: 100%;
  max-width: 600px;
  background: grey;
  border-radius: 2px;
  padding: 20px;
  display: flex;
  overflow: hidden;
  overflow-y: auto;
  flex-direction: column;
`;
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 52.7px;
  width: 100%;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
const FormControl = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  top: 3px;
`;
const SendButton = styled(Button)`
  height: 58px;
  width: 50px;
  background: grey;
  box-shadow: rgb(250 246 246) 0px 0px 5px 3px !important;
`;
const Input = styled.textarea`
  color: #fff;
  font-size: 0.9rem;
  background-color: transparent;
  width: calc(100%);
  box-sizing: border-box;
  padding-inline: 12px;
  padding-block: 6px;
  border: none;
  border-radius: 4px;
  border-bottom: var(--border-height) solid var(--border-before-color);
  box-shadow: 0px 0px 8px 6px #1976d2 !important;
  &:focus {
    outline: none;
  }
  &:focus + .input-border {
    width: 100%;
  }
`;

const InputBorder = styled.span`
  position: absolute;
  background: var(--border-after-color);
  width: 0%;
  height: 2px;
  bottom: 5px;
  left: 0;
  transition: width 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
`;

const InputAlt = styled(Input)`
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputBorderAlt = styled(InputBorder)`
  height: 3px;
  background: linear-gradient(90deg, #ff6464 0%, #ffbf59 50%, #47c9ff 100%);
  transition: width 0.4s cubic-bezier(0.42, 0, 0.58, 1);
`;

interface Message {
  message: string;
  origin: "user" | "ai";
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { message: "Hi, How may i help you today?", origin: "ai" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchApi(
      "protected/allMessages",
      "POST",
      {},
      {
        Authorization:
          "Bearer " + localStorage.getItem("accesstoken")?.toString(),
      }
    )
      .then((res) => {
        console.log(res, "chat");
        setMessages(res.data.allMessages);
        setLoading(false);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 429) {
          console.log(error.response.data, "chat");
          setLoading(false);
          setMessages((prev) => [...prev, error.response.data]);
        } else {
          setLoading(false);
        }
        setNewMessage("");
      });

    return () => {};
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!newMessage) {
      setLoading(false);
      return;
    }
    setMessages((prev) => [...prev, { message: newMessage, origin: "user" }]);

    fetchApi(
      "protected/chat",
      "POST",
      {
        userInput: newMessage,
        history: { internal: [newMessage], visible: [] },
      },
      {
        Authorization:
          "Bearer " + localStorage.getItem("accesstoken")?.toString(),
      }
    )
      .then((res) => {
        console.log(res, "chat");
        setMessages((prev) => [...prev, res.data]);
        setLoading(false);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 429) {
          console.log(error.response.data, "chat");
          setLoading(false);
          setMessages((prev) => [...prev, error.response.data]);
        } else {
          setLoading(false);
        }
        setNewMessage("");
      });
  };

  return (
    <ChatContainer>
      <ChatMessgageConatiner>
        {messages.map((data, index) => {
          return (
            <ChatItem
              key={index}
              last={messages.length - 1 == index}
              {...data}
            ></ChatItem>
          );
        })}
      </ChatMessgageConatiner>
      <Container>
        <FormControl>
          <InputAlt
            onChange={(e: any) => {
              setNewMessage(e.target.value);
            }}
            value={newMessage}
            className="input input-alt"
            placeholder="Type something intelligent"
            required
          />
          <InputBorderAlt className="input-border input-border-alt" />
        </FormControl>
        <SendButton
          disabled={loading}
          onClick={handleSubmit}
          variant="contained"
        >
          {true ? (
            <CircularProgress
              sx={{ height: "24px", width: "24px", position:"absolute" }}
            ></CircularProgress>
          ) : (
            <SendIcon></SendIcon>
          )}
        </SendButton>
      </Container>
    </ChatContainer>
  );
};

export default ChatUI;
