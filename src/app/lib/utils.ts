import { Comment } from "../types";

export const buildCommentTree = (comments: Comment[]) => {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  const clonedComments = comments.map((c) => ({ ...c, replies: [] }));

  clonedComments.forEach((comment) => {
    commentMap.set(comment.id, comment);
  });

  clonedComments.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        parent.replies!.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
};

export const filterCommentsByResolved = (commentTree: Comment[]) => {
  return commentTree.filter((comment) => {
    if (!comment.parentCommentId && !comment.resolved) {
      if (comment.replies) {
        comment.replies = filterCommentsByResolved(comment.replies);
      }
      return true;
    }
    if (comment.parentCommentId && !comment.resolved) {
      if (comment.replies) {
        comment.replies = filterCommentsByResolved(comment.replies);
      }
      return true;
    }
    return false;
  });
};
