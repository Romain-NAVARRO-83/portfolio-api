import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

dotenv.config();

const app = express();

// trust proxy si derrière un reverse proxy (optional)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', true);
}

// middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// IP whitelist middleware
const ALLOWED_IPS = (process.env.ALLOWED_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use((req, res, next) => {
  if (ALLOWED_IPS.length === 0) return next();
  const ip = req.ip || req.connection?.remoteAddress;
  if (ALLOWED_IPS.includes(ip)) return next();
  res.status(403).json({ error: 'Forbidden' });
});

// csurf setup: stocke le token dans un cookie XSRF-TOKEN non httpOnly pour que le client JS puisse le lire
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } });

// route pour récupérer le token CSRF
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  // csurf met le token dans req.csrfToken()
  res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ csrfToken: req.csrfToken() });
});

// appliquer csurf globalement pour les routes API (sauf GET/OPTIONS/HEAD)
app.use('/api', (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();
  csrfProtection(req, res, next);
});

// routes
import routes from './routes/index.js';
app.use('/api', routes);

// error handler
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
