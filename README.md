# URL Shortener (Full-Stack)

A beginner-friendly URL shortener with:

- **Frontend**: HTML, CSS, JavaScript (static, GitHub Pages friendly)
- **Backend**: Node.js + Express API
- **Storage**: In-memory JavaScript object

## Project structure

```
.
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js
└── package.json
```

## Backend setup

1. Install dependencies:

```bash
npm install
```

2. Run server:

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

### Environment variables

- `PORT` (optional): API port (default `3000`)
- `BASE_URL` (optional): public backend base URL used in short links

Example:

```bash
BASE_URL=https://your-backend.onrender.com npm start
```

## API endpoints

### `POST /shorten`
Creates a short URL.

Request body:

```json
{
  "url": "https://example.com"
}
```

Response:

```json
{
  "code": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "originalUrl": "https://example.com/"
}
```

### `GET /:code`
Redirects to original URL and increments click count.

### `GET /stats/:code`
Returns click statistics for a code.

## Frontend setup (GitHub Pages ready)

The frontend is inside `/frontend` and is static.

1. Deploy `frontend` folder to GitHub Pages.
2. Open `frontend/script.js` and set:

```js
const API_BASE_URL = 'https://your-backend-domain.com';
```

3. Commit and redeploy frontend.

## Notes

- Data is stored in memory, so it resets when the backend restarts.
- Good for learning/demo projects.
