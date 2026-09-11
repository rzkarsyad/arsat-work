"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";

export type InquiryValues = { name: string; email: string; message: string };
/** On failure the submitted values come back, so the form can keep the writing after React resets it. */
export type InquiryState = { ok: true } | { ok: false; error: string; values: InquiryValues } | null;

const LIMIT = { name: 80, email: 254, message: 2000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Receives the paper form. Validates, then delivers through Resend with the sender as reply-to. */
export async function sendInquiry(_previous: InquiryState, formData: FormData): Promise<InquiryState> {
  const field = (name: string) => String(formData.get(name) ?? "").trim();

  // Honeypot: real people never see this field. Bots that fill it get a quiet "success".
  if (field("company")) return { ok: true };

  const name = field("name");
  const email = field("email");
  const message = field("message");
  const values = { name, email, message };
  const fail = (error: string): InquiryState => ({ ok: false, error, values });
  if (!name || name.length > LIMIT.name) return fail("Add your name so I know who's writing.");
  if (!EMAIL.test(email) || email.length > LIMIT.email) return fail("That email doesn't look right.");
  if (!message || message.length > LIMIT.message) return fail("Write a few words about what you have in mind.");

  if (process.env.NODE_ENV !== "production" && process.env.INQUIRY_DRY_RUN === "1") {
    console.log(`[inquiry dry run] from ${name} <${email}>: ${message.slice(0, 80)}`);
    return { ok: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO;
  if (!apiKey || !to) return fail("Sending isn't set up yet. Reach me on X or LinkedIn instead.");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.INQUIRY_FROM ?? `${site.brand} <onboarding@resend.dev>`,
    to: [to],
    replyTo: email,
    subject: `Inquiry from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; wrote:</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });
  if (error) {
    console.error("[inquiry] resend error", error);
    return fail("Couldn't send right now. Please try again in a moment.");
  }
  return { ok: true };
}
