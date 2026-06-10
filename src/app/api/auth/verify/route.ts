import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'worldnow_secret_session_key';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return new Response(JSON.stringify({ valid: true, user: decoded }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}
