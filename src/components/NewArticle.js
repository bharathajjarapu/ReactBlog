import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const NewArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/articles',
        { title, content },
        { withCredentials: true }
      );
      // Handle successful article creation (e.g., show a success message, redirect to author articles)
    } catch (error) {
      console.error('Error creating article:', error);
      // Handle error
    }
  };

  return (
    <div className="auth-container">
      <h2>New Article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content (Markdown)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <ReactMarkdown>{content}</ReactMarkdown>
        <button type="submit" className="auth-btn">Create Article</button>
      </form>
    </div>
  );
};

export default NewArticle;