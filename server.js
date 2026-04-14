const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// In-memory storage: { code: { url: string, clicks: number } }
const urlStore = {};

function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

function createUniqueCode() {
  let code = generateCode();

  while (urlStore[code]) {
    code = generateCode();
  }

  return code;
}

app.post('/shorten', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a URL.' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return res.status(400).json({ error: 'URL must start with http:// or https://.' });
  }

  const code = createUniqueCode();

  urlStore[code] = {
    url: parsedUrl.toString(),
    clicks: 0
  };

  return res.status(201).json({
    code,
    shortUrl: `${BASE_URL}/${code}`,
    originalUrl: parsedUrl.toString()
  });
});

app.get('/stats/:code', (req, res) => {
  const { code } = req.params;
  const entry = urlStore[code];

  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  return res.json({
    code,
    originalUrl: entry.url,
    clicks: entry.clicks
  });
});

app.get('/:code', (req, res) => {
  const { code } = req.params;
  const entry = urlStore[code];

  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  entry.clicks += 1;
  return res.redirect(entry.url);
});

app.get('/', (_req, res) => {
  res.json({
    message: 'URL Shortener API is running.',
    endpoints: {
      shorten: 'POST /shorten',
      redirect: 'GET /:code',
      stats: 'GET /stats/:code'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}`);
});
