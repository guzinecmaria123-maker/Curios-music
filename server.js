const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Режим разработки включается только флагом --dev (см. npm run dev)
const isDev = process.argv.includes('--dev');

app.disable('x-powered-by');

if (isDev) {
  // Для автообновления страницы разрешаем встроенные скрипты (только при разработке!)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'"],
          // Без https у локального сервера — иначе телефон в сети не загрузит стили и картинки
          'upgrade-insecure-requests': null,
        },
      },
    })
  );
} else {
  // На настоящем сайте защита остаётся строгой
  app.use(helmet());
}

// API: адрес, к которому обращается React
app.get('/api/status', (req, res) => {
  res.json({ ok: true });
});

// Несуществующий адрес API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Наружу отдаётся ТОЛЬКО папка public
app.use(express.static(path.join(__dirname, 'public')));

// Подробности ошибки видны только в консоли сервера
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  res.status(err.status || 500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}${isDev ? ' (режим разработки)' : ''}`);
});