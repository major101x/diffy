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

  return (
    <div className="flex flex-row gap-4 justify-center items-start min-h-screen w-full p-4">
      <div className="w-7/10 h-full">
        <PRDetails pullRequest={pullRequest} />
        <DiffView diff={diff} />
      </div>
      <div className="flex flex-col gap-4 h-screen w-3/10 sticky top-4 pb-8">
        <PRComments prId={prId} prComments={prComments} />
        <PRRoom prId={prId} user={user} />
      </div>
    </div>
  );
};
