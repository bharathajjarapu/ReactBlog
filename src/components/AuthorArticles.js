import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const AuthorArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articles', { withCredentials: true });
      const authorId = response.data.authorId; // Get the author ID from the response
      const authorArticles = response.data.articles.filter((article) => article.author === authorId);
      setArticles(authorArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Handle error
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`, { withCredentials: true });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      // Handle error
    }
  };

  return (
    <div className="articles-container">
      <h2>My Articles</h2>
      {articles.length === 0 ? (
        <p>You haven't written any articles yet.</p>
      ) : (
        <div>
          {articles.map((article) => (
            <article key={article.id} className="article-card">
              <h3>{article.title}</h3>
              <ReactMarkdown>{article.content}</ReactMarkdown>
              <div className="article-actions">
                <Link to={`/author/edit/${article.id}`} className="edit-btn">Edit</Link>
                <button onClick={() => handleDelete(article.id)} className="delete-btn">Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorArticles;