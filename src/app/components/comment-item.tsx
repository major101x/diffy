import Image from "next/image";
import { Comment } from "../types";
import {
  createComment,
  resolveComment,
  unresolveComment,
} from "../lib/actions";

export function CommentItem({
  comment,
  prId,
}: {
  comment: Comment;
  prId: string;
}) {
  const createCommentWithPrId = createComment.bind(null, prId, comment.id);

  return (
    <>
      <div
        className={`flex flex-col gap-2 pl-4 border-l border-gray-200 py-2 px-4 ${comment.resolved ? "border-green-500" : "border-gray-200"}`}
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
        <button
          onClick={() =>
            comment.resolved
              ? unresolveComment(comment.id)
              : resolveComment(comment.id)
          }
        >
          {comment.resolved ? "Unresolve" : "Resolve"}
        </button>
        <form action={createCommentWithPrId}>
          <textarea name="comment" />
          <button type="submit">Reply</button>
        </form>
      </div>
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <CommentItem comment={reply} key={reply.id} prId={prId} />
        ))}
    </>
  );
}
