import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    setComments(res.data);
  }
  
  useEffect(() => {
    fetchComments();
  }, []);

  const renderComment = comment => 
    <li key={comment.id}>
      {comment.content}
    </li>;

  return (
    <ul>
      {comments.map(renderComment)}
    </ul>
  );
};

export default CommentList;