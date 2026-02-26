"use client";

import { useEffect, useState } from "react";
import { Comment } from "../types";
import { createComment, fetchData } from "../lib/actions";
import { socket } from "../lib/socket";
import Image from "next/image";

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

  console.log(comments);

  return (
    <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-lg w-full">
      <h1 className="text-2xl font-bold">Comments</h1>

      {comments.map((comment) => (
        <div
          className="flex flex-col gap-2 border-b border-gray-200 py-2 px-4"
          key={comment.id}
        >
          <div className="flex gap-2">
            <Image
              src={comment.user.avatarUrl}
              alt={comment.user.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p>{comment.user.name}</p>
              <p>{comment.createdAt.toString()}</p>
            </div>
          </div>
          <p>{comment.body}</p>
        </div>
      ))}

      <form action={createCommentWithPrId}>
        <input
          type="text"
          name="comment"
          className="border border-gray-300 rounded-md bg-white text-black mr-2"
          placeholder="Comment"
        />
        <input
          type="text"
          name="filePath"
          className="border border-gray-300 rounded-md bg-white text-black mr-2"
          placeholder="File Path"
        />
        <input
          type="text"
          name="lineNumber"
          className="border border-gray-300 rounded-md bg-white text-black mr-2"
          placeholder="Line Number"
        />
        <button className="bg-blue-500 text-white px-4 rounded-md h-full">
          Send
        </button>
      </form>
    </div>
  );
}
