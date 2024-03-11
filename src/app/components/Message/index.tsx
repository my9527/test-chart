"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { recoilGlobalMessage } from "@/app/models";

const MessageWrapper = styled(motion.div)`
  position: fixed;
  background: transparent;
  display: flex;
  justify-content: center;
  color: white;
  flex-direction: column;
  z-index: 99999;
`;

const motionConfig: Record<string, object> = {
  top: {
    initial: { opacity: 0, top: 0, left: "50%", x: "-50%" },
    animate: { opacity: 1, top: 100, left: "50%", x: "-50%" },
    exit: { opacity: 0, top: 0, left: "50%", x: "-50%" },
  },
  top_left: {
    initial: { opacity: 0, top: 10, left: 0 },
    animate: { opacity: 1, top: 10, left: 100 },
    exit: { opacity: 0, top: 10, left: 0 },
  },
  top_right: {
    initial: { opacity: 0, top: 10, right: 0 },
    animate: { opacity: 1, top: 10, right: 100 },
    exit: { opacity: 0, top: 10, right: 0 },
  },
  bottom: {
    initial: { opacity: 0, bottom: 0, left: "50%", x: "-50%" },
    animate: { opacity: 1, bottom: 100, left: "50%", x: "-50%" },
    exit: { opacity: 0, bottom: 0, left: "50%", x: "-50%" },
  },
  bottom_left: {
    initial: { opacity: 0, bottom: 10, left: 0 },
    animate: { opacity: 1, bottom: 10, left: 100 },
    exit: { opacity: 0, bottom: 10, left: 0 },
  },
  bottom_right: {
    initial: { opacity: 0, bottom: 10, right: 0 },
    animate: { opacity: 1, bottom: 10, right: 100 },
    exit: { opacity: 0, bottom: 10, right: 0 },
  },
  left: {
    initial: { opacity: 0, left: 0, top: "50%", y: "-50%" },
    animate: { opacity: 1, left: 100, top: "50%", y: "-50%" },
    exit: { opacity: 0, left: 0, top: "50%", y: "-50%" },
  },
  right: {
    initial: { opacity: 0, right: 0, top: "50%", y: "-50%" },
    animate: { opacity: 1, right: 100, top: "50%", y: "-50%" },
    exit: { opacity: 0, right: 0, top: "50%", y: "-50%" },
  },
};
const motionConfigInner: Record<string, object> = {
  top: {
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: "0%" },
    exit: { opacity: 0, y: "-100%" },
  },
  top_left: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "-100%" },
  },
  top_right: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "100%" },
  },
  bottom: {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: "0%" },
    exit: { opacity: 0, y: "100%" },
  },
  bottom_left: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "-100%" },
  },
  bottom_right: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "100%" },
  },
  left: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "-100%" },
  },
  right: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "100%" },
  },
};
interface BaseModalProps {
  visible: boolean;
  onClose: () => any;
  children: React.ReactElement;
}

interface PotralProps {
  children: React.ReactElement | string;
  type?: "info" | "success" | "error" | "warning";
  position:
    | "top"
    | "top_left"
    | "top_right"
    | "bottom"
    | "bottom_left"
    | "bottom_right"
    | "left"
    | "right";
}

const MsgItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: gray;
  border-radius: 14px;
`;

const IconImg = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 4px;
`;

const MsgPotral = (props: PotralProps) => {
  const { type, position } = props;
  return (
    <MsgItem
      style={{ marginBottom: "10px" }}
      {...motionConfigInner[position || "top"]}
      transition={{
        duration: 1,
      }}
    >
      {/* {
            type === 'error' ? <IconImg src={getImageUrl('@/assets/CmptMessage/error.png')} /> : null
          } 
          {
            type === 'info' ? <IconImg src={getImageUrl('@/assets/CmptMessage/info.png')} /> : null
          }   */}

      {props.children}
    </MsgItem>
  );
};
type Position =
  | "top"
  | "top_left"
  | "top_right"
  | "bottom"
  | "bottom_left"
  | "bottom_right"
  | "left"
  | "right";
type Msg = {
  content: React.ReactElement | string;
  delay?: number;
  start?: number;
  position?:
    | "top"
    | "top_left"
    | "top_right"
    | "bottom"
    | "bottom_left"
    | "bottom_right"
    | "left"
    | "right";
  type?: "info" | "success" | "warning" | "error";
};

export const useMessage = () => {
  const [, updateMsgState] = useRecoilState(recoilGlobalMessage);

  const func = useMemo(() => {
    return (msg: Msg) => {
      let _msg = {
        delay: 2000,
        start: Date.now(),
        type: "info",
        ...msg,
      };

      updateMsgState((_state: any) => {
        const position = msg?.position || "top";
        let list: any = [];
        if (position === "top") {
          list = [_msg, ...(_state[position] || [])];
        } else {
          list = [...(_state[position] || []), _msg];
        }
        return { ..._state, [position]: list };
      });
    };
  }, []);
  return func;
};

const GlobalMessage = () => {
  const [msgs, updateMsgState] = useRecoilState(recoilGlobalMessage);

  const msgsRef = useRef(msgs);
  const [showMsg, setShowMsg] = useState(false);
  useEffect(() => {
    msgsRef.current = msgs;
    const keys = Object.keys(msgs);
    const arr = keys.filter((key) => {
      return msgs[key].length > 0;
    });

    setShowMsg(arr.length > 0);
  }, [msgs]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      if (msgsRef.current) {
        const keys = Object.keys(msgsRef.current);
        let newMsgs: Record<string, object> = {};
        keys.map((key) => {
          let _msgs = msgsRef.current[key].filter((v: any) => {
            return v.start + v.delay > Date.now();
          });
          newMsgs[key] = _msgs;
        });
        updateMsgState(newMsgs);
      }
    }, 1000);

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      {showMsg &&
        createPortal(
          <>
            {(Object.keys(msgs) as PotralProps["position"][]).map((key) => {
              return (
                <MessageWrapper
                  key={key}
                  {...motionConfig[key]}
                  transition={{
                    duration: 1,
                  }}
                >
                  {msgs[key].map((msg: any, index: number) => {
                    return (
                      <MsgPotral key={index} type={msg.type} position={key}>
                        <div>{msg.content}</div>
                      </MsgPotral>
                    );
                  })}
                </MessageWrapper>
              );
            })}
          </>,

          window.document.body
        )}
    </div>
  );
};

export default GlobalMessage;
