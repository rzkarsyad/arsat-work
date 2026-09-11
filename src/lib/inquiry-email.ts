import { site } from "./site";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export type InquiryEmailInput = { name: string; email: string; message: string; sentAt?: Date };

/** The note that lands in the inbox when someone sends the letter on the site. */
export function inquiryEmail({ name, email, message, sentAt = new Date() }: InquiryEmailInput) {
  const when = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }).format(sentAt);
  const safe = { name: escapeHtml(name), email: escapeHtml(email), message: escapeHtml(message).replace(/\n/g, "<br>") };
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: your note on ${site.brand}`)}`;

  const subject = `Great, new inquiry from ${name}!`;

  const text = [
    `Great, new inquiry!`,
    ``,
    `${name} just sent you a letter from ${site.brand}.`,
    ``,
    `From:    ${name}`,
    `Email:   ${email}`,
    `Sent:    ${when}`,
    ``,
    `Message:`,
    message,
    ``,
    `Reply to this email to answer them directly.`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:32px 16px;background:#f3f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif;color:#171614;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
    <tr><td style="padding:0 8px 18px;">
      <div style="font-size:13px;color:#6b6862;">${escapeHtml(site.brand)}</div>
      <h1 style="margin:6px 0 0;font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-0.3px;">Great, new inquiry! &#127881;</h1>
      <p style="margin:8px 0 0;font-size:15px;line-height:1.5;color:#3d3a35;"><strong>${safe.name}</strong> just sent you a letter from ${escapeHtml(site.brand)}.</p>
    </td></tr>
    <tr><td style="background:#fbf8f1;border-radius:16px;padding:26px 28px;box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 12px 30px -18px rgba(0,0,0,.35);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.5;">
        <tr><td style="width:84px;padding:0 0 10px;color:#8a847a;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">From</td><td style="padding:0 0 10px;font-weight:600;">${safe.name}</td></tr>
        <tr><td style="padding:0 0 10px;color:#8a847a;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">Email</td><td style="padding:0 0 10px;"><a href="mailto:${safe.email}" style="color:#171614;text-decoration:underline;">${safe.email}</a></td></tr>
        <tr><td style="padding:0 0 18px;color:#8a847a;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">Sent</td><td style="padding:0 0 18px;">${escapeHtml(when)}</td></tr>
        <tr><td colspan="2" style="padding:18px 0 0;border-top:1px solid rgba(42,39,35,.14);color:#8a847a;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">Message</td></tr>
        <tr><td colspan="2" style="padding:8px 0 0;font-size:15px;line-height:1.65;color:#2a2723;white-space:pre-wrap;">${safe.message}</td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:22px 8px 0;">
      <a href="${replyHref}" style="display:inline-block;background:#171614;color:#fbf8f1;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:999px;">Reply to ${safe.name}</a>
      <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#8a847a;">Replying to this email goes straight to them. Sent from the letter on <a href="${site.url}" style="color:#8a847a;">${escapeHtml(site.brand)}</a>.</p>
    </td></tr>
  </table>
  </td></tr></table>
</body>
</html>`;

  return { subject, text, html };
}
