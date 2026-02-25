import { createHmac, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.CF_JWT_SECRET || 'changeflow-dev-secret';

const readDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');

const base64UrlEncode = (input) => Buffer.from(input).toString('base64url');
const base64UrlDecode = (input) => Buffer.from(input, 'base64url').toString('utf8');

const sign = (payload) => {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac('sha256', JWT_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
};

const verify = (token) => {
  const parts = token.split('.');
  if (parts.length !== 2) throw new Error('Invalid token');
  const [encoded, signature] = parts;
  const expected = createHmac('sha256', JWT_SECRET).update(encoded).digest('base64url');
  if (signature !== expected) throw new Error('Invalid token signature');
  return JSON.parse(base64UrlDecode(encoded));
};

const json = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  });
  res.end(JSON.stringify(data));
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const getAuthUser = (req, db) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  const payload = verify(token);
  return db.users.find((u) => u.id === payload.userId) || null;
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    json(res, 404, { error: 'Not found' });
    return;
  }

  if (req.method === 'OPTIONS') {
    json(res, 200, { ok: true });
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const db = readDb();

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      json(res, 200, { status: 'ok' });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await parseBody(req);
      const email = String(body.email || '').toLowerCase();
      const user = db.users.find((u) => u.email.toLowerCase() === email) || db.users[0];
      const token = sign({ userId: user.id, issuedAt: Date.now() });
      json(res, 200, { token, user });
      return;
    }

    if (pathname.startsWith('/api/auth/')) {
      const user = getAuthUser(req, db);
      if (!user) {
        json(res, 401, { error: 'Unauthorized' });
        return;
      }

      if (req.method === 'GET' && pathname === '/api/auth/me') {
        json(res, 200, { user });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/auth/switch-role') {
        const body = await parseBody(req);
        const role = body.role;
        const roleUser = db.users.find((u) => u.role === role) || user;
        const token = sign({ userId: roleUser.id, issuedAt: Date.now() });
        json(res, 200, { user: roleUser, token });
        return;
      }
    }

    const authUser = getAuthUser(req, db);
    if (!authUser) {
      json(res, 401, { error: 'Unauthorized' });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/bootstrap') {
      json(res, 200, {
        projects: db.projects,
        projectSteps: db.projectSteps,
        feedback: db.feedback,
        learningProgress: db.learningProgress,
        lessonProgress: db.lessonProgress || [],
        aiConversations: db.aiConversations,
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/projects') {
      const body = await parseBody(req);
      db.projects.push(body.project);
      writeDb(db);
      json(res, 201, { project: body.project });
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/projects/')) {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const index = db.projects.findIndex((p) => p.id === id);
      if (index === -1) {
        json(res, 404, { error: 'Project not found' });
        return;
      }
      db.projects[index] = { ...db.projects[index], ...body.updates };
      writeDb(db);
      json(res, 200, { project: db.projects[index] });
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/project-steps/')) {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const index = db.projectSteps.findIndex((s) => s.id === id);
      if (index === -1) {
        json(res, 404, { error: 'Step not found' });
        return;
      }
      db.projectSteps[index] = { ...db.projectSteps[index], status: body.status };
      writeDb(db);
      json(res, 200, { step: db.projectSteps[index] });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/feedback') {
      const body = await parseBody(req);
      db.feedback.push(body.feedback);
      writeDb(db);
      json(res, 201, { feedback: body.feedback });
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/feedback/')) {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const index = db.feedback.findIndex((f) => f.id === id);
      if (index === -1) {
        json(res, 404, { error: 'Feedback not found' });
        return;
      }
      db.feedback[index] = { ...db.feedback[index], ...body.updates };
      writeDb(db);
      json(res, 200, { feedback: db.feedback[index] });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/learning-progress') {
      const body = await parseBody(req);
      db.learningProgress.push(body.progress);
      writeDb(db);
      json(res, 201, { learningProgress: body.progress });
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/learning-progress/')) {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const index = db.learningProgress.findIndex((lp) => lp.id === id);
      if (index === -1) {
        json(res, 404, { error: 'Learning progress not found' });
        return;
      }
      db.learningProgress[index] = { ...db.learningProgress[index], ...body.updates };
      writeDb(db);
      json(res, 200, { learningProgress: db.learningProgress[index] });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/lesson-progress') {
      const body = await parseBody(req);
      const progress = body.progress;
      const list = db.lessonProgress || [];
      const existingIndex = list.findIndex(
        (lp) =>
          lp.user_id === progress.user_id
          && lp.material_id === progress.material_id
          && lp.lesson_id === progress.lesson_id,
      );
      if (existingIndex >= 0) {
        list[existingIndex] = { ...list[existingIndex], ...progress };
        db.lessonProgress = list;
        writeDb(db);
        json(res, 200, { lessonProgress: list[existingIndex] });
        return;
      }
      list.push(progress);
      db.lessonProgress = list;
      writeDb(db);
      json(res, 201, { lessonProgress: progress });
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/lesson-progress/')) {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const list = db.lessonProgress || [];
      const index = list.findIndex((lp) => lp.id === id);
      if (index === -1) {
        json(res, 404, { error: 'Lesson progress not found' });
        return;
      }
      list[index] = { ...list[index], ...body.updates };
      db.lessonProgress = list;
      writeDb(db);
      json(res, 200, { lessonProgress: list[index] });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/ai-conversations') {
      const body = await parseBody(req);
      const message = body.message || { ...body, id: randomUUID() };
      db.aiConversations.push(message);
      writeDb(db);
      json(res, 201, { message });
      return;
    }

    json(res, 404, { error: 'Not found' });
  } catch (error) {
    json(res, 500, { error: error instanceof Error ? error.message : 'Internal error' });
  }
});

server.listen(PORT, () => {
  console.log(`ChangeFlow API running on http://localhost:${PORT}`);
});
