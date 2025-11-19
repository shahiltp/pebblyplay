import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { hashPassword } from '@/lib/password';
import { signUpSchema } from '@/lib/validators';

let signupHits = 0;

export async function POST(req: Request) {
  // Simple in-memory rate limit (dev). TODO: move to Upstash/Redis.
  if (process.env.NODE_ENV !== 'production') {
    signupHits++;
    if (signupHits > 200) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  const json = await req.json().catch(() => null);
  const parsed = signUpSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { name, email, passwordHash } });
  return NextResponse.json({ ok: true }, { status: 201 });
}










