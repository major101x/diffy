"use client";

import { socket } from "../lib/socket";
import { useEffect, useState, useRef } from "react";
import { User } from "../types";

export function PRRoom({ prId, user }: { prId: string; user: User }) {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { message: string; username: string }[]
  >([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      pullRequestId: prId,
      username: user.username,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        pullRequestId: prId,
        username: user.username,
      });
      typingTimeoutRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("joined", (data) => {
      setAlerts((prev) => [...prev, data]);
      console.log(data);
    });

    socket.on(
      "pr-room-message",
      (data: { message: string; username: string }) => {
        setMessages((prev) => [
          ...prev,
          { message: data.message, username: data.username },
        ]);
      },
    );

    socket.on("user-count", (data) => {
      setUserCount(data.userCount);
    });

    socket.on("typing", (data) => {
      setTypingUsers((prev) => Array.from(new Set([...prev, data.username])));
    });

    socket.on("stop-typing", (data) => {
      setTypingUsers((prev) =>
        prev.filter((username) => username !== data.username),
      );
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joined", (data) => {
        console.log(data);
      });
      socket.off("pr-room-message", (data) => {
        console.log(data);
      });
      socket.off("user-count", (data) => {
        console.log(data);
      });
    };
  }, [prId]);

  return (
    <div className="p-5 border border-gray-200 rounded-lg w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">PR Room {prId}</h1>
        <p>Connected: {isConnected.toString()}</p>
        <p>User Count: {userCount}</p>
      </div>

      {alerts.map((alert, index) => (
        <p key={index}>{alert}</p>
      ))}

      {messages.map((message, index) => (
        <p key={index}>
          {message.username}: {message.message}
        </p>
      ))}

      <div className="flex gap-2 mt-5">
        {typingUsers.length > 0 && (
          <p className="text-sm text-gray-500">
            {typingUsers.join(", ")} is typing...
          </p>
        )}
        <input
          type="text"
          className="border border-gray-300 rounded-md bg-white text-black"
          value={message}
          onChange={handleMessageChange}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-md"
          onClick={() =>
            socket.emit("send-message-to-pr-room", {
              pullRequestId: prId,
              message: message,
              username: user.username,
            })
          }
        >
          Send
        </button>
      </div>
    </div>
  );
}
