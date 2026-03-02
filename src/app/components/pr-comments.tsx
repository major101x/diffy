"use client";

import { useEffect, useState } from "react";
import { Comment } from "../types";
import { createComment, fetchData } from "../lib/actions";
import { socket } from "../lib/socket";
import Image from "next/image";
import { buildCommentTree, filterCommentsByResolved } from "../lib/utils";
import { CommentThread } from "./comment-thread";

export function PRComments({
  prId,
  prComments,
}: {
  prId: string;
  prComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(prComments);
  const [showResolved, setShowResolved] = useState(false);

  const createCommentWithPrId = createComment.bind(null, prId, null);

  useEffect(() => {
    const handleNewComment = (data: Comment) => {
      setComments((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev;
        return [...prev, data];
      });
    };

    const handleUpdateComment = (data: Comment) => {
      setComments((prev) =>
        prev.map((comment) => (comment.id === data.id ? data : comment)),
      );
    };

    socket.on("newComment", handleNewComment);
    socket.on("updateComment", handleUpdateComment);

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("updateComment", handleUpdateComment);
    };
  }, [prId]);

  // console.log(comments);
  const commentTree = showResolved
    ? buildCommentTree(comments)
    : filterCommentsByResolved(buildCommentTree(comments));

  return (
    <div className="flex flex-col gap-4 justify-between border border-gray-200 p-4 rounded-lg w-full h-1/2">
      <div className="flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-bold">Comments</h1>
        <button onClick={() => setShowResolved(!showResolved)}>
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto h-full">
        {commentTree.map((comment) => (
          <CommentThread comments={[comment]} key={comment.id} prId={prId} />
        ))}
        {commentTree.length === 0 && <p>No comments yet</p>}
      </div>

      <form
        action={createCommentWithPrId}
        className="flex flex-row flex-wrap gap-2"
      >
        <input
          type="text"
          name="filePath"
          className="border border-gray-300 rounded-md bg-white text-black mr-2 px-2"
          placeholder="File Path"
        />
        <input
          type="text"
          name="lineNumber"
          className="border border-gray-300 rounded-md bg-white text-black mr-2 px-2"
          placeholder="Line Number"
        />
        <input
          type="text"
          name="comment"
          className="border border-gray-300 rounded-md bg-white text-black grow mr-2 px-2"
          placeholder="Comment"
        />
        <button className="bg-blue-500 text-white px-4 rounded-md">Send</button>
      </form>
    </div>
  );
}
