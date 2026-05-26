import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJSON } from '../utils/fileStore';
import { User } from '../types';
import { JWT_SECRET } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as { username: string; password: string };

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const users = readJSON<User>('users.json');
  const user = users.find((u) => u.username === username);

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  if (user.status === 'Inactive') {
    res.status(403).json({ message: 'Account is inactive. Contact your administrator.' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  const { password: _pw, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

export default router;
