import Image from "next/image";
import { useRef, useState } from "react";
import { Comment } from "../types";
import {
  createComment,
  resolveComment,
  unresolveComment,
} from "../lib/actions";
import { formatDistanceToNow } from "date-fns";

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
  const [showReplyForm, setShowReplyForm] = useState(false);

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
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </p>
          </div>
        </div>
        <p className="text-sm mt-1">{comment.body}</p>

        <div className="flex gap-4 text-xs text-gray-500 mt-2">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="hover:text-blue-600 font-semibold transition-colors cursor-pointer"
          >
            Reply
          </button>
          <button
            onClick={() =>
              comment.resolved
                ? unresolveComment(comment.id)
                : resolveComment(comment.id)
            }
            className="hover:text-gray-800 font-semibold transition-colors cursor-pointer"
          >
            {comment.resolved ? "Unresolve" : "Resolve"}
          </button>
        </div>

        {showReplyForm && (
          <form
            ref={formRef}
            action={async (formData) => {
              await createCommentWithPrId(formData);
              formRef.current?.reset();
              setShowReplyForm(false);
            }}
            className="flex flex-col gap-2 mt-3 p-3 rounded-md border border-gray-200"
          >
            <textarea
              name="comment"
              className="border border-gray-300 rounded-md bg-white text-black px-3 py-2 text-sm min-h-[60px] w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder={`Reply to ${comment.user.name}...`}
            />
            <input type="hidden" name="filePath" value={comment.filePath} />
            <input type="hidden" name="lineNumber" value={comment.lineNumber} />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-semibold px-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm"
              >
                Submit Reply
              </button>
            </div>
          </form>
        )}
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
