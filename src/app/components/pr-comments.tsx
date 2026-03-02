"use client";

import { useEffect, useState } from "react";
import { Comment } from "../types";
import { createComment, fetchData } from "../lib/actions";
import { socket } from "../lib/socket";
import Image from "next/image";
import { buildCommentTree } from "../lib/utils";
import { CommentThread } from "./comment-thread";

export function PRComments({
  prId,
  prComments,
}: {
  prId: string;
  prComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(prComments);

  const createCommentWithPrId = createComment.bind(null, prId);

  useEffect(() => {
    socket.on("newComment", (data) => {
      setComments((prev) => [...prev, data]);
    });

    return () => {
      socket.off("newComment", (data) => {
        console.log(data);
      });
    };
  }, [prId]);

  // console.log(comments);
  const commentTree = buildCommentTree(comments);

  return (
    <div className="flex flex-col gap-4 justify-between border border-gray-200 p-4 rounded-lg w-full h-3/10">
      <h1 className="text-2xl font-bold">Comments</h1>

      {commentTree.map((comment) => (
        <CommentThread comments={[comment]} key={comment.id} />
      ))}

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
