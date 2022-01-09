import React from 'react';

const CommentList = ({ comments }) => {
  const mapStatusToMessage = comment => ({
    approved: comment.content,
    pending: 'This comment is awaiting moderation',
    rejected: 'This comment has been rejected'
  });

  const renderComment = comment => 
    <li key={comment.id}>
      {mapStatusToMessage(comment)[comment.status]}
    </li>;

  return (
    <ul>
      {comments.map(renderComment)}
    </ul>
  );
};

export default CommentList;