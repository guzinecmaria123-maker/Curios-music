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
        },
      },
    })
  );
} else {
  // На настоящем сайте защита остаётся строгой
  app.use(helmet());
}

// Наружу отдаётся ТОЛЬКО папка public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}${isDev ? ' (режим разработки)' : ''}`);
});