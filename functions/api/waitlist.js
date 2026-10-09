// Waitlist sign-up: one email address into D1, then back to the page with the outcome as #anchor.
export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const back = (anchor) => Response.redirect(new URL(`/waitlist#${anchor}`, request.url).toString(), 303);
  if (form.get('website')) return back('joined'); // honeypot: bots fill every field
  const email = String(form.get('email') || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return back('invalid');
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS waitlist (email TEXT PRIMARY KEY, created_at TEXT NOT NULL)').run();
  await env.DB.prepare('INSERT OR IGNORE INTO waitlist (email, created_at) VALUES (?, ?)').bind(email, new Date().toISOString()).run();
  return back('joined');
}
