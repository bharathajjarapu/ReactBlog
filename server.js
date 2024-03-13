const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Sample data
let authors = [];
let articles = [];

// Middleware to authenticate authors
const authenticateAuthor = (req, res, next) => {
  if (!req.session.authorId) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// Register a new author
app.post('/api/authors/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const author = { id: authors.length + 1, username, password: hashedPassword };
  authors.push(author);
  res.json({ message: 'Author registered successfully' });
});

// Author login
app.post('/api/authors/login', async (req, res) => {
  const { username, password } = req.body;
  const author = authors.find((a) => a.username === username);
  if (!author) return res.status(400).json({ message: 'Invalid username or password' });
  const validPassword = await bcrypt.compare(password, author.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid username or password' });
  req.session.authorId = author.id;
  res.json({ message: 'Login successful' });
});

// Author logout
app.post('/api/authors/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// Get all articles (public)
app.get('/api/articles', (req, res) => {
  res.json(articles);
});

// Create a new article (author)
app.post('/api/articles', authenticateAuthor, (req, res) => {
  const { title, content } = req.body;
  const newArticle = { id: articles.length + 1, title, content, author: req.session.authorId };
  articles.push(newArticle);
  res.json(newArticle);
});

// Update an article (author)
app.put('/api/articles/:id', authenticateAuthor, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const article = articles.find((a) => a.id === parseInt(id) && a.author === req.session.authorId);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  article.title = title;
  article.content = content;
  res.json(article);
});

// Delete an article (author)
app.delete('/api/articles/:id', authenticateAuthor, (req, res) => {
  const { id } = req.params;
  const articleIndex = articles.findIndex((a) => a.id === parseInt(id) && a.author === req.session.authorId);
  if (articleIndex === -1) return res.status(404).json({ message: 'Article not found' });
  articles.splice(articleIndex, 1);
  res.json({ message: 'Article deleted successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));