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
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
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

    function onJoined(data: string) {
      setAlerts((prev) => [...prev, data]);
      console.log(data);
    }

    function onLeft(data: string) {
      setAlerts((prev) => [...prev, data]);
      console.log(data);
    }

    function onMessage(data: { message: string; username: string }) {
      setMessages((prev) => [
        ...prev,
        { message: data.message, username: data.username },
      ]);
    }

    function onActiveUsers(data: string[]) {
      setActiveUsers(data);
    }

    function onUserCount(data: { userCount: number }) {
      setUserCount(data.userCount);
    }

    function onTyping(data: { username: string }) {
      setTypingUsers((prev) => Array.from(new Set([...prev, data.username])));
    }

    function onStopTyping(data: { username: string }) {
      setTypingUsers((prev) =>
        prev.filter((username) => username !== data.username),
      );
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("joined", onJoined);

    socket.on("pr-room-message", onMessage);

    socket.on("active-users", onActiveUsers);

    socket.on("user-count", onUserCount);

    socket.on("typing", onTyping);

    socket.on("stop-typing", onStopTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joined", onJoined);
      socket.off("pr-room-message", onMessage);
      socket.off("user-count", onUserCount);
      socket.off("typing", onTyping);
      socket.off("stop-typing", onStopTyping);
      socket.off("active-users", onActiveUsers);
    };
  }, [prId]);

  return (
    <div className="p-5 border border-gray-200 rounded-lg w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">PR Room {prId}</h1>
        <p>Connected: {isConnected.toString()}</p>
        <p>User Count: {userCount}</p>
      </div>
      <div className="flex justify-between items-center">
        <p>
          {activeUsers.join(", ")} {activeUsers.length === 1 ? "is" : "are"}{" "}
          currently reviewing this PR
        </p>
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
