import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { readJSON, writeJSON } from './utils/fileStore';
import { User } from './types';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import recordRoutes from './routes/records';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// On startup, hash any plain-text passwords in users.json so first run is safe
async function seedPasswords(): Promise<void> {
  const users = readJSON<User>('users.json');
  let updated = false;

  for (const user of users) {
    if (!user.password.startsWith('$2')) {
      user.password = await bcrypt.hash(user.password, 10);
      updated = true;
    }
  }

  if (updated) {
    writeJSON('users.json', users);
    console.log('Passwords hashed and saved on first run.');
  }
}

seedPasswords().then(() => {
  app.listen(PORT, () => {
    console.log(`MPloyChek API running on http://localhost:${PORT}`);
    console.log(`Default credentials → username: astha.admin | password: Pass@1234`);
  });
});
