import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendOtpEmail(email: string, code: string) {
  await transporter.verify();

  await transporter.sendMail({
    from: `"Cardify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Cardify account",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cardify Verification</title>
</head>

<body style="margin:0; padding:0; background:#BFE7DA; font-family:'Helvetica Neue', Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#BFE7DA; padding:44px 16px;">
<tr>
<td align="center">

<!-- MARQUEE STRIP -->
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#F6C445; border:3px solid #111111; border-radius:999px; margin-bottom:18px;">
<tr>
<td align="center" style="padding:9px 18px; font-size:11px; font-weight:900; letter-spacing:3px; text-transform:uppercase; color:#111111;">
★ Cardify ★ A gift with a story ★ Cardify ★
</td>
</tr>
</table>

<!-- CARD -->
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#FFFDF5; border:3px solid #111111; border-radius:28px; overflow:hidden;">

<!-- HEADER -->
<tr>
<td style="background:#BFE7DA; padding:36px 28px; text-align:center; border-bottom:3px solid #111111;">

<div style="display:inline-block; background:#FFFDF5; border:3px solid #111111; color:#111111; font-size:32px; width:74px; height:74px; line-height:74px; border-radius:22px; font-weight:bold;">
💌
</div>

<h1 style="margin:20px 0 8px; font-size:38px; color:#111111; font-weight:900; letter-spacing:-1px; text-transform:uppercase;">
Cardify
</h1>

<div style="display:inline-block; background:#FF8E7A; border:2.5px solid #111111; border-radius:999px; padding:6px 16px; font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#111111;">
A card with a story
</div>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:42px 34px;">

<p style="margin:0 0 10px; text-align:center; font-size:11px; font-weight:900; letter-spacing:4px; text-transform:uppercase; color:#111111;">
— One more step —
</p>

<h2 style="margin:0; font-size:30px; color:#111111; text-align:center; font-weight:900; letter-spacing:-0.5px;">
Verify your account
</h2>

<p style="margin:16px 0 0; font-size:15px; line-height:1.8; color:#3F3F3F; text-align:center; font-weight:500;">
Use the verification code below to continue signing in to your Cardify account.
</p>

<!-- CODE -->
<table cellpadding="0" cellspacing="0" style="margin:32px auto 0;">
<tr>
<td style="padding:20px 34px; background:#FFF3B0; border:3px solid #111111; border-radius:22px; box-shadow:6px 6px 0 #111111;">
<div style="font-size:42px; font-weight:900; letter-spacing:12px; color:#111111; text-align:center;">
${code}
</div>
</td>
</tr>
</table>

<p style="margin:26px 0 0; text-align:center; font-size:13px; color:#3F3F3F; line-height:1.8; font-weight:600;">
This verification code will expire in <strong style="color:#111111;">5 minutes</strong>.
</p>

<table width="100%" style="margin-top:34px; background:#D8D2F5; border-radius:20px; border:3px solid #111111;" cellpadding="18">
<tr>
<td style="font-size:14px; color:#111111; line-height:1.8; font-weight:500;">
<strong style="text-transform:uppercase; letter-spacing:1px;">Didn't request this?</strong><br>
You can safely ignore this email. Your account will remain secure.
</td>
</tr>
</table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:26px; background:#111111; text-align:center; border-top:3px solid #111111;">

<p style="margin:0; font-size:12px; color:#FFFDF5; font-weight:800; letter-spacing:1px;">
© ${new Date().getFullYear()} Cardify. All rights reserved.
</p>

<p style="margin:10px 0 0; font-size:12px; color:#BFE7DA; font-weight:500;">
Made with ❤️ to help you create meaningful digital cards.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  });
}
