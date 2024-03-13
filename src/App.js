import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import AuthorLogin from './components/AuthorLogin';
import AuthorRegister from './components/AuthorRegister';
import AuthorArticles from './components/AuthorArticles';
import NewArticle from './components/NewArticle';

const App = () => {
  const [isAuthor, setIsAuthor] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    checkAuthorLogin();
  }, []);

  const checkAuthorLogin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/authors/check', { withCredentials: true });
      if (response.data.isAuthor) {
        setIsAuthor(true);
      }
    } catch (error) {
      console.error('Error checking author login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/authors/logout', null, { withCredentials: true });
      setIsAuthor(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthor ? (
              <>
                <li>
                  <Link to="/author/articles">My Articles</Link>
                </li>
                <li>
                  <Link to="/author/new">New Article</Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/author/login">Author Login</Link>
                </li>
                <li>
                  <Link to="/author/register">Author Register</Link>
                </li>
              </>
            )}
            <li>
              <button className="theme-btn" onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/author/login" element={<AuthorLogin setIsAuthor={setIsAuthor} />} />
            <Route path="/author/register" element={<AuthorRegister />} />
            <Route path="/author/articles" element={<PrivateRoute isAuthor={isAuthor}><AuthorArticles /></PrivateRoute>} />
            <Route path="/author/new" element={<PrivateRoute isAuthor={isAuthor}><NewArticle /></PrivateRoute>} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  return (
    <div className="articles-container">
      <h1>Articles</h1>
      {articles.map((article) => (
        <article key={article.id} className="article-card">
          <h2>{article.title}</h2>
          <ReactMarkdown>{article.content}</ReactMarkdown>
          {/* Add star functionality */}
        </article>
      ))}
    </div>
  );
};

const PrivateRoute = ({ isAuthor, children }) => {
  return isAuthor ? children : <Navigate to="/author/login" replace />;
};

export default App;