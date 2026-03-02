import Image from "next/image";
import { Comment } from "../types";
import { CommentItem } from "./comment-item";

export function CommentThread({
  comments,
  prId,
}: {
  comments: Comment[];
  prId: string;
}) {
  return (
    <>
      {comments.map((comment) => (
        <>
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
          {comment.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((reply) => (
              <CommentItem comment={reply} key={reply.id} prId={prId} />
            ))}
        </>
      ))}
    </>
  );
}
