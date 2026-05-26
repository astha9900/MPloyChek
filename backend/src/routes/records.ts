import { Router, Request, Response } from 'express';
import { readJSON } from '../utils/fileStore';
import { Record } from '../types';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/records?delay=ms
// Admin → all records; General User → only their own records
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const delayMs = Math.min(parseInt((req.query.delay as string) || '0', 10), 10000);

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const records = readJSON<Record>('records.json');
  const isAdmin = req.user!.role === 'Admin';

  const result = isAdmin
    ? records
    : records.filter((r) => r.userId === req.user!.id);

  res.json({ records: result, delay: delayMs, total: result.length });
});

export default router;
