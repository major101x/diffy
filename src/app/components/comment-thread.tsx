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
        <CommentItem
          comment={comment}
          key={comment.id}
          prId={prId}
          root={true}
        />
      ))}
    </>
  );
}
