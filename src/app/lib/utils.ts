import { Comment } from "../types";

export const buildCommentTree = (comments: Comment[]) => {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, comment);
  });

  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        if (!parent.replies) {
          parent.replies = [];
        }
        parent.replies.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
};
