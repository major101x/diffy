"use client";
import { useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"comments" | "room">("comments");
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
    <div className="flex flex-row gap-4 justify-center items-start w-full p-4">
      <div className="w-7/10">
        <PRDetails pullRequest={pullRequest} />
        <DiffView diff={diff} />
      </div>
      <div className="flex flex-col h-[calc(100vh-2rem)] w-3/10 sticky top-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="flex flex-row border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "comments" ? "border-b-2 border-blue-500 text-blue-600 bg-white" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => setActiveTab("comments")}
          >
            Review Comments
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "room" ? "border-b-2 border-blue-500 text-blue-600 bg-white" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => setActiveTab("room")}
          >
            Live Chat
          </button>
        </div>

        <div className="flex-1 overflow-hidden h-full flex flex-col relative w-full">
          <div
            className={`w-full h-full ${activeTab === "comments" ? "block" : "hidden"}`}
          >
            <PRComments prId={prId} prComments={prComments} />
          </div>
          <div
            className={`w-full h-full ${activeTab === "room" ? "block" : "hidden"}`}
          >
            <PRRoom prId={prId} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};
