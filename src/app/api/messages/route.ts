import { connectToDatabase } from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';
import nodemailer from 'nodemailer';

const escapeHtml = (value: string) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    const saved = await ContactMessage.create({ name, email, subject, message });

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const ownerEmail =  'worldnow.blogs@gmail.com';

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `WORLD NOW <${smtpUser}>`,
        to: ownerEmail,
        replyTo: email,
        subject: `New message from WORLD NOW contact form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="color: #b5150e; margin-bottom: 8px;">New Contact Message</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f9fafb; padding: 12px; border-radius: 8px;">${escapeHtml(message)}</p>
            <p style="font-size: 12px; color: #6b7280;">This message was automatically forwarded from the WORLD NOW contact form and saved in the newsroom database.</p>
          </div>
        `,
      });
    }

    return Response.json({
      success: true,
      message: 'Your message was sent successfully to the WORLD NOW newsroom.',
      saved,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to send your message right now.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1] || new URL(request.url).searchParams.get('token');
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return Response.json(messages);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
