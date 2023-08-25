import { useEffect, useRef } from "react";
import { Typography, Zoom } from "@mui/material";
import styled from "@emotion/styled";
const Chat = styled(Typography)<any>`
  height: auto;

  background: #4b8ac9;
  margin: 4px;
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
  min-width: 40%;
  text-wrap: wrap;
  word-break: break-word;
  align-self: ${(props: any) =>
    props.origin == "ai" ? "flex-start" : "flex-end"};
`;
export default function ChatItem({ message, origin, last }: any) {
  const ref = useRef<any>();
  useEffect(() => {
    if (last) ref.current?.scrollIntoView();
  }, []);
  return (
    <Chat origin={origin} ref={ref}>
      <Zoom in={true}>
        <div>{message}</div>
      </Zoom>
    </Chat>
  );
}
