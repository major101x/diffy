import Image from "next/image";
import { useRef } from "react";
import { Comment } from "../types";
import {
  createComment,
  resolveComment,
  unresolveComment,
} from "../lib/actions";

export function CommentItem({
  comment,
  prId,
  root = false,
}: {
  comment: Comment;
  prId: string;
  root?: boolean;
}) {
  const createCommentWithPrId = createComment.bind(null, prId, comment.id);
  const formRef = useRef<HTMLFormElement>(null);

  console.log(comment.body, root);

  return (
    <>
      <div
        className={`flex flex-col gap-2 ${root ? "" : "ml-4 border-l"} py-2 px-4 ${comment.resolved ? "border-green-500" : ""}`}
        key={comment.id}
      >
        <div className="flex gap-2">
          <Image
            src={comment.user.avatarUrl || ""}
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
        <form
          ref={formRef}
          action={async (formData) => {
            await createCommentWithPrId(formData);
            formRef.current?.reset();
          }}
        >
          <input
            type="text"
            name="comment"
            className="border border-gray-300 rounded-md bg-white text-black mr-2 px-2"
          />
          <input type="hidden" name="filePath" value={comment.filePath} />
          <input type="hidden" name="lineNumber" value={comment.lineNumber} />
          <button type="submit">Reply</button>
        </form>
      </div>
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <CommentItem
            comment={reply}
            key={reply.id}
            prId={prId}
            root={false}
          />
        ))}
    </>
  );
}
