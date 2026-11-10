// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.send('Timestamp Microservice');
  });
});

// Express 5 syntax: the {/:date} braces make the segment optional,
// so this matches both /api and /api/1451001600000
app.get('/api{/:date}', (req, res) => {
  const { date } = req.params;

  let parsed;

  if (date === undefined || date === '') {
    parsed = new Date();
  } else if (/^-?\d+$/.test(date)) {
    parsed = new Date(Number(date));
  } else {
    parsed = new Date(date);
  }

  if (isNaN(parsed.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  res.json({
    unix: parsed.getTime(),
    utc: parsed.toUTCString(),
  });
});

const PORT = process.env.PORT || 8000;
const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

export default app;