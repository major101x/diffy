"use client";

import { socket } from "../lib/socket";
import { useEffect, useState } from "react";

export function PRRoom({ prId }: { prId: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { message: string; userId: string }[]
  >([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [userCount, setUserCount] = useState(0);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
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

    socket.emit("join-pr-room", { pullRequestId: prId });

    socket.on("joined", (data) => {
      setAlerts((prev) => [...prev, data]);
      console.log(data);
    });

    socket.on("pr-room-message", (data) => {
      setMessages((prev) => [
        ...prev,
        { message: data.message, userId: data.userId },
      ]);
    });

    socket.on("user-count", (data) => {
      setUserCount(data.userCount);
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
      socket.emit("leave-pr-room", { pullRequestId: prId });
      socket.off("user-count", (data) => {
        console.log(data);
      });
    };
  }, [prId]);

  return (
    <div className="p-5">
      <h1>PR Room {prId}</h1>
      <p>Connected: {isConnected.toString()}</p>
      <p>User Count: {userCount}</p>

      {alerts.map((alert, index) => (
        <p key={index}>{alert}</p>
      ))}

      {messages.map((message, index) => (
        <p key={index}>
          {message.userId}: {message.message}
        </p>
      ))}

      <div className="flex gap-2 mt-5">
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
            })
          }
        >
          Send
        </button>
      </div>
    </div>
  );
}
