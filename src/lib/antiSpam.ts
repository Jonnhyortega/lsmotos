import connectDB from '@/lib/db';
import RateLimitHit from '@/models/RateLimitHit';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Gmail ignores dots and anything after "+", so bots use them to fake "different" addresses
export function normalizeEmail(email: string): string {
  const [local, domain] = email.trim().toLowerCase().split('@');
  if (!local || !domain) return email.trim().toLowerCase();

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
  }
  return `${local}@${domain}`;
}

// Catches random strings like "AVzxfkGArZaGjNptD": real names rarely switch
// from lowercase to uppercase more than once inside a word
export function looksLikeGibberish(name: string): boolean {
  return name.split(/\s+/).some(word => {
    const caseSwitches = (word.match(/\p{Ll}\p{Lu}/gu) || []).length;
    return caseSwitches >= 2 || (word.length >= 6 && !/[aeiouáéíóúü]/i.test(word));
  });
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

// Mongo-backed so the limit holds across serverless instances; hits expire after an hour (TTL index)
export async function isRateLimited(key: string, maxPerHour: number): Promise<boolean> {
  await connectDB();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const hits = await RateLimitHit.countDocuments({ key, createdAt: { $gte: since } });
  if (hits >= maxPerHour) return true;

  await RateLimitHit.create({ key });
  return false;
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('TURNSTILE_SECRET_KEY not set: skipping captcha verification');
    return true;
  }
  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}
