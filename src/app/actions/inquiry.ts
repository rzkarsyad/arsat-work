"use server";

import { createHash } from "node:crypto";
import { Resend } from "resend";
import { inquiryEmail } from "@/lib/inquiry-email";
import { site } from "@/lib/site";

export type InquiryValues = { name: string; email: string; message: string };
/** On failure the submitted values come back, so the form can keep the writing after React resets it. */
export type InquiryState = { ok: true } | { ok: false; error: string; values: InquiryValues } | null;

const LIMIT = { name: 80, email: 254, message: 2000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Delivers an inquiry through Resend with the writer as reply-to. Called from
 * the "Get in touch" dialog (`src/components/contact.tsx`) via
 * `useActionState(sendInquiry, null)` with fields name, email, message and an
 * untouched honeypot input named "company".
 */
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
  const mail = inquiryEmail({ name, email, message });
  // The same letter sent twice within a day (a retry, a double submit) is delivered once.
  const idempotencyKey = `inquiry/${createHash("sha256").update(`${email}\n${name}\n${message}`).digest("hex").slice(0, 32)}`;
  const { error } = await resend.emails.send(
    {
      from: process.env.INQUIRY_FROM ?? `${site.brand} <onboarding@resend.dev>`,
      to: [to],
      replyTo: email,
      ...mail,
    },
    { idempotencyKey },
  );
  if (error) {
    console.error("[inquiry] resend error", error);
    return fail("Couldn't send right now. Please try again in a moment.");
  }
  return { ok: true };
}
