import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'worldnow_secret_session_key';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS_HASH = bcryptjs.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_USER && bcryptjs.compareSync(password, ADMIN_PASS_HASH)) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
      return Response.json({ token, user: { username } });
    }

    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
