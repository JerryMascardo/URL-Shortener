// Change this value when deploying your backend (Render, Railway, etc.)
const API_BASE_URL = 'http://localhost:3000';

const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const resultSection = document.getElementById('resultSection');
const shortUrlLink = document.getElementById('shortUrlLink');
const copyBtn = document.getElementById('copyBtn');
const statsBtn = document.getElementById('statsBtn');
const clickCount = document.getElementById('clickCount');
const message = document.getElementById('message');

let currentCode = '';

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? '#dc2626' : '#16a34a';
}

shortenBtn.addEventListener('click', async () => {
  const longUrl = urlInput.value.trim();

  if (!longUrl) {
    showMessage('Please enter a URL.', true);
    return;
  }

  showMessage('Shortening...');

  try {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: longUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Could not shorten URL.', true);
      return;
    }

    currentCode = data.code;
    shortUrlLink.href = data.shortUrl;
    shortUrlLink.textContent = data.shortUrl;
    clickCount.textContent = '';

    resultSection.classList.remove('hidden');
    showMessage('Short URL created successfully.');
  } catch (error) {
    showMessage('Could not connect to backend API.', true);
  }
});

copyBtn.addEventListener('click', async () => {
  const urlToCopy = shortUrlLink.textContent;

  if (!urlToCopy) {
    showMessage('No short URL to copy yet.', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(urlToCopy);
    showMessage('Copied to clipboard.');
  } catch (error) {
    showMessage('Copy failed. Please copy manually.', true);
  }
});

statsBtn.addEventListener('click', async () => {
  if (!currentCode) {
    showMessage('Create a short URL first.', true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/stats/${currentCode}`);
    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Could not fetch stats.', true);
      return;
    }

    clickCount.textContent = `Clicks: ${data.clicks}`;
    showMessage('Stats loaded.');
  } catch (error) {
    showMessage('Could not connect to backend API.', true);
  }
});
