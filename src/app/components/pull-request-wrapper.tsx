"use client";
import { useEffect } from "react";
import { Comment } from "../types";
import { PRComments } from "./pr-comments";
import { PRRoom } from "./pr-room";
import { socket } from "../lib/socket";

export const PullRequestWrapper = ({
  prId,
  prComments,
}: {
  prId: string;
  prComments: Comment[];
}) => {
  useEffect(() => {
    socket.emit("join-pr-room", { pullRequestId: prId });

    return () => {
      socket.emit("leave-pr-room", { pullRequestId: prId });
    };
  }, [prId]);
  console.log(prComments);
  return (
    <div className="flex gap-4 justify-center items-center flex-col h-screen max-w-4xl mx-auto">
      <PRComments prId={prId} prComments={prComments} />
      <PRRoom prId={prId} />
    </div>
  );
};
