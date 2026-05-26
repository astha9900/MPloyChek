import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readJSON, writeJSON } from '../utils/fileStore';
import { User } from '../types';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/users/me — any authenticated user gets their own profile
router.get('/me', authenticate, (req: Request, res: Response): void => {
  const users = readJSON<User>('users.json');
  const user = users.find((u) => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const { password: _pw, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// GET /api/users — admin sees all users
router.get('/', authenticate, requireAdmin, (_req: Request, res: Response): void => {
  const users = readJSON<User>('users.json');
  const sanitized = users.map(({ password: _pw, ...rest }) => rest);
  res.json(sanitized);
});

// POST /api/users — admin creates a user
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { username, password, role, name, email, department, phone, status } = req.body as Partial<User>;

  if (!username || !password || !role || !name || !email) {
    res.status(400).json({ message: 'username, password, role, name and email are required' });
    return;
  }

  const users = readJSON<User>('users.json');
  if (users.find((u) => u.username === username)) {
    res.status(409).json({ message: 'Username already exists' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: `usr-${uuidv4().slice(0, 8)}`,
    username,
    password: hashed,
    role: role as User['role'],
    name,
    email,
    department: department || '',
    phone: phone || '',
    status: (status || 'Active') as User['status'],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeJSON('users.json', users);

  const { password: _pw, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// PUT /api/users/:id — admin updates a user
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const users = readJSON<User>('users.json');
  const idx = users.findIndex((u) => u.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const updates = req.body as Partial<User>;
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  users[idx] = { ...users[idx], ...updates, id: users[idx].id };
  writeJSON('users.json', users);

  const { password: _pw, ...userWithoutPassword } = users[idx];
  res.json(userWithoutPassword);
});

// DELETE /api/users/:id — admin deletes a user
router.delete('/:id', authenticate, requireAdmin, (req: Request, res: Response): void => {
  const users = readJSON<User>('users.json');
  const idx = users.findIndex((u) => u.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Prevent deleting yourself
  if (users[idx].id === req.user!.id) {
    res.status(400).json({ message: 'Cannot delete your own account' });
    return;
  }

  users.splice(idx, 1);
  writeJSON('users.json', users);
  res.json({ message: 'User deleted successfully' });
});

export default router;
