// lib/resend.ts
//
// Setup: npm install resend
// Daftar di https://resend.com -> Add Domain (atau pakai domain testing mereka dulu)
// -> generate API Key -> taruh di .env.local:
//    RESEND_API_KEY=re_xxxxxxxxxxxx

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Ganti sesuai domain yang udah lo verifikasi di Resend.
// Sebelum domain diverifikasi, Resend cuma izinin kirim dari onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Cardify <onboarding@resend.dev>";

export async function sendOtpEmail(to: string, code: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${code} is your Cardify verification code`,
    html: otpEmailTemplate(code),
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send OTP email");
  }

  return data;
}

function otpEmailTemplate(code: string) {
  return `
  <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #FDFBF3; padding: 40px 20px;">
    <div style="max-width: 420px; margin: 0 auto; background: #ffffff; border: 2px solid #1C1917; border-radius: 24px; overflow: hidden;">
      <div style="background-color: #F6C445; padding: 24px; text-align: center; border-bottom: 2px solid #1C1917;">
        <div style="display: inline-block; width: 40px; height: 40px; background: #1C1917; border-radius: 12px; line-height: 40px; color: #F6C445; font-weight: 900; font-size: 18px;">C</div>
        <p style="margin: 12px 0 0; font-weight: 800; font-size: 20px; color: #1C1917; font-style: italic;">cardify</p>
      </div>
      <div style="padding: 32px 28px; text-align: center;">
        <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #78716c; margin: 0 0 8px;">Your verification code</p>
        <p style="font-size: 40px; font-weight: 800; letter-spacing: 0.15em; color: #1C1917; margin: 0 0 16px;">${code}</p>
        <p style="font-size: 13px; color: #78716c; line-height: 1.6; margin: 0;">
          This code expires in <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <div style="background: #1C1917; padding: 16px; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #a8a29e;">© ${new Date().getFullYear()} Cardify Inc.</p>
      </div>
    </div>
  </div>`;
}