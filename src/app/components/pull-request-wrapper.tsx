"use client";
import { useEffect } from "react";
import { Comment, User } from "../types";
import { PRComments } from "./pr-comments";
import { PRRoom } from "./pr-room";
import { socket } from "../lib/socket";

export const PullRequestWrapper = ({
  prId,
  prComments,
  user,
}: {
  prId: string;
  prComments: Comment[];
  user: User;
}) => {
  useEffect(() => {
    socket.emit("join-pr-room", {
      pullRequestId: prId,
      username: user.username,
    });

    return () => {
      socket.emit("leave-pr-room", {
        pullRequestId: prId,
        username: user.username,
      });
    };
  }, [prId, user.username]);
  console.log(user);
  return (
    <div className="flex gap-4 justify-center items-center flex-col h-screen max-w-4xl mx-auto">
      <PRComments prId={prId} prComments={prComments} />
      <PRRoom prId={prId} user={user} />
    </div>
  );
};
