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
  const [showForm, setShowForm] = useState(false);

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
    <div className="flex flex-col gap-4 justify-between p-4 w-full h-full">
      <div className="flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-bold">Comments</h1>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="cursor-pointer hover:text-gray-800 border border-gray-200 px-2 py-1 rounded-md transition-colors"
        >
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto h-full">
        {commentTree.map((comment) => (
          <CommentThread comments={[comment]} key={comment.id} prId={prId} />
        ))}
        {commentTree.length === 0 && <p>No comments yet</p>}
      </div>

      {showForm ? (
        <form
          action={(formData) => {
            createCommentWithPrId(formData);
            setShowForm(false);
          }}
          className="flex flex-col gap-2 pt-2 border-t border-gray-200"
        >
          <div className="flex flex-row gap-2">
            <input
              type="text"
              name="filePath"
              className="border border-gray-300 rounded-md bg-white text-black px-2 py-1 flex-1 text-sm"
              placeholder="File Path"
            />
            <input
              type="text"
              name="lineNumber"
              className="border border-gray-300 rounded-md bg-white text-black px-2 py-1 flex-1 text-sm"
              placeholder="Line Number"
            />
          </div>
          <textarea
            name="comment"
            className="border border-gray-300 rounded-md bg-white text-black px-2 py-2 min-h-[60px] text-sm"
            placeholder="Write a comment..."
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-sm font-semibold px-2"
            >
              Cancel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-1.5 rounded-md text-sm font-semibold">
              Submit Comment
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-md transition-colors border border-blue-200 shadow-sm"
        >
          + New Comment
        </button>
      )}
    </div>
  );
}
