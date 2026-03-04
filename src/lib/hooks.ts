const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type HookEvent = 'user.registered' | 'user.verified';

type HookPayload = {
  'user.registered': { name?: string; email: string };
  'user.verified': { email: string };
};

function formatMessage<E extends HookEvent>(event: E, data: HookPayload[E]): string {
  switch (event) {
    case 'user.registered': {
      const d = data as HookPayload['user.registered'];
      return `🆕 *New Registration*\nName: ${d.name || '—'}\nEmail: \`${d.email}\``;
    }
    case 'user.verified': {
      const d = data as HookPayload['user.verified'];
      return `✅ *Email Verified*\nEmail: \`${d.email}\``;
    }
    default:
      return `Event: ${event}`;
  }
}

async function sendTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

export async function emitHook<E extends HookEvent>(event: E, data: HookPayload[E]) {
  try {
    const message = formatMessage(event, data);
    await sendTelegram(message);
  } catch {
    // fire-and-forget — never break app flow
  }
}
