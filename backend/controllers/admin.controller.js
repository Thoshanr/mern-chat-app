import { timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import jwt from 'jsonwebtoken';

const failedAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 10 * 60 * 1000;

export const unlockAdminQr = (req, res) => {
  const address = req.ip || 'unknown';
  const attempt = failedAttempts.get(address);
  if (attempt?.lockedUntil > Date.now()) {
    return res.status(429).json({ error: 'Too many attempts. Wait a few minutes, then try again.' });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  const suppliedPassword = String(req.body?.password || '');
  const expected = Buffer.from(expectedPassword);
  const supplied = Buffer.from(suppliedPassword);
  if (expected.length < 20) {
    return res.status(503).json({ error: 'The admin QR has not been configured on the server.' });
  }
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    const failures = (attempt?.failures || 0) + 1;
    failedAttempts.set(address, {
      failures: failures >= MAX_ATTEMPTS ? 0 : failures,
      lockedUntil: failures >= MAX_ATTEMPTS ? Date.now() + LOCK_TIME_MS : 0,
    });
    return res.status(401).json({ error: 'That admin password did not match.' });
  }

  failedAttempts.delete(address);
  const accessToken = jwt.sign({ purpose: 'admin-qr' }, process.env.JWT_SECRET, { expiresIn: '5m' });
  res.cookie('adminQrAccess', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 5 * 60 * 1000,
    path: '/api/admin/qr',
  });
  return res.status(200).json({ unlocked: true });
};

export const getAdminQr = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies?.adminQrAccess || '', process.env.JWT_SECRET);
    if (decoded.purpose !== 'admin-qr') return res.status(403).json({ error: 'Admin access required.' });
  } catch {
    return res.status(403).json({ error: 'Admin access expired. Unlock again to view the QR.' });
  }

  try {
    const qrPath = new URL('../private/admin-qr.png', import.meta.url);
    const qrImage = await readFile(qrPath);
    res.set('Cache-Control', 'no-store');
    res.type('png').status(200).send(qrImage);
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(404).json({ error: 'The admin QR has not been added yet.' });
    console.error('Could not load the private admin QR image:', error.message);
    return res.status(500).json({ error: 'Could not load the QR right now.' });
  }
};
