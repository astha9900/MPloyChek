import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response, NextFunction } from 'express';

// ── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string; username: string; password: string;
  role: 'Admin' | 'General User'; name: string; email: string;
  department: string; phone: string; status: 'Active' | 'Inactive'; createdAt: string;
}
interface VerificationRecord {
  id: string; userId: string; candidateName: string; checkType: string;
  status: string; priority: string; assignedTo: string;
  completionDate: string | null; createdAt: string; remarks: string;
}
interface AuthPayload { id: string; username: string; role: string; }
type AuthRequest = Request & { user?: AuthPayload };

// ── In-memory seed data (resets on cold start — fine for demo) ───────────────
// eslint-disable-next-line @typescript-eslint/no-var-requires
const usersData: User[]               = require('../backend/src/data/users.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const recordsData: VerificationRecord[] = require('../backend/src/data/records.json');

let users: User[]                     = JSON.parse(JSON.stringify(usersData));
let records: VerificationRecord[]     = JSON.parse(JSON.stringify(recordsData));

const JWT_SECRET = 'mploychek_jwt_secret_2024';

// ── Middleware ────────────────────────────────────────────────────────────────
function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) { res.status(401).json({ message: 'No token provided' }); return; }
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET) as AuthPayload;
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
}
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'Admin') { res.status(403).json({ message: 'Admin access required' }); return; }
  next();
}

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) { res.status(400).json({ message: 'Username and password are required' }); return; }

  const user = users.find(u => u.username === username);
  if (!user) { res.status(401).json({ message: 'Invalid credentials' }); return; }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) { res.status(401).json({ message: 'Invalid credentials' }); return; }
  if (user.status === 'Inactive') { res.status(403).json({ message: 'Account is inactive. Contact your administrator.' }); return; }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  const { password: _pw, ...safe } = user;
  res.json({ token, user: safe });
});

// ── Users ─────────────────────────────────────────────────────────────────────
app.get('/api/users/me', authenticate, (req: AuthRequest, res: Response): void => {
  const user = users.find(u => u.id === req.user!.id);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  const { password: _pw, ...safe } = user;
  res.json(safe);
});

app.get('/api/users', authenticate, requireAdmin, (_req: Request, res: Response): void => {
  res.json(users.map(({ password: _pw, ...rest }) => rest));
});

app.post('/api/users', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { username, password, role, name, email, department, phone, status } = req.body as Partial<User>;
  if (!username || !password || !role || !name || !email) {
    res.status(400).json({ message: 'username, password, role, name and email are required' }); return;
  }
  if (users.find(u => u.username === username)) { res.status(409).json({ message: 'Username already exists' }); return; }

  const newUser: User = {
    id: `usr-${uuidv4().slice(0, 8)}`,
    username, password: await bcrypt.hash(password, 10),
    role: role as User['role'], name, email,
    department: department || '', phone: phone || '',
    status: (status || 'Active') as User['status'],
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  const { password: _pw, ...safe } = newUser;
  res.status(201).json(safe);
});

app.put('/api/users/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) { res.status(404).json({ message: 'User not found' }); return; }
  const updates = req.body as Partial<User>;
  if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
  users[idx] = { ...users[idx], ...updates, id: users[idx].id };
  const { password: _pw, ...safe } = users[idx];
  res.json(safe);
});

app.delete('/api/users/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response): void => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) { res.status(404).json({ message: 'User not found' }); return; }
  if (users[idx].id === req.user!.id) { res.status(400).json({ message: 'Cannot delete your own account' }); return; }
  users.splice(idx, 1);
  res.json({ message: 'User deleted successfully' });
});

// ── Records ───────────────────────────────────────────────────────────────────
app.get('/api/records', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const delayMs = Math.min(parseInt((req.query.delay as string) || '0', 10), 5000);
  if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
  const result = req.user!.role === 'Admin' ? records : records.filter(r => r.userId === req.user!.id);
  res.json({ records: result, delay: delayMs, total: result.length });
});

export default app;
