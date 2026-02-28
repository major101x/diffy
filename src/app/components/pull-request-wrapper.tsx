"use client";
import { useEffect } from "react";
import { Comment, PullRequest, User } from "../types";
import { PRComments } from "./pr-comments";
import { PRRoom } from "./pr-room";
import { socket } from "../lib/socket";
import { PRDetails } from "./pr-details";
import { DiffView } from "./diff-view";

export const PullRequestWrapper = ({
  pullRequest,
  diff,
  prId,
  prComments,
  user,
}: {
  pullRequest: PullRequest;
  diff: string;
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
  console.log(pullRequest);
  console.log(diff);
  return (
    <div className="flex flex-row gap-4 justify-center items-center h-screen w-full">
      <div className="w-1/2 h-full">
        <PRDetails pullRequest={pullRequest} />
        <DiffView diff={diff} />
      </div>
      <div className="flex flex-col gap-4 h-full w-1/2">
        <PRComments prId={prId} prComments={prComments} />
        <PRRoom prId={prId} user={user} />
      </div>
    </div>
  );
};
