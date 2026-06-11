function getFromEmail(): string {
  const configured = process.env.AUTH_FROM_EMAIL?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_FROM_EMAIL is not configured. Set it to e.g. Foreigners Club <noreply@yourdomain.com>"
    );
  }

  return "Foreigners Club <onboarding@resend.dev>";
}

function buildVerificationEmail(name: string, code: string) {
  const safeName = name.trim() || "there";
  const subject = `${code} is your Foreigners Club verification code`;
  const text = [
    `Hi ${safeName},`,
    "",
    `Your Foreigners Club verification code is: ${code}`,
    "",
    "Enter this 6-digit code in the app to verify your email and open your passport.",
    "This code expires in 30 minutes.",
    "",
    "If you did not create an account, you can ignore this email.",
    "",
    "— Foreigners Club",
    "(This is an automated message from a no-reply address.)",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#FAF6F0;font-family:Georgia,'Times New Roman',serif;color:#2C2416;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:480px;background:#FFFDF9;border:1px solid #E8DFD0;border-radius:16px;padding:32px;">
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background:#5C3D2E;color:#F5D78E;font-weight:700;font-size:18px;line-height:48px;text-align:center;">FC</div>
              </td>
            </tr>
            <tr>
              <td style="font-size:22px;font-weight:700;text-align:center;padding-bottom:8px;">Verify your email</td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:#6B5E52;text-align:center;padding-bottom:24px;">
                Hi ${safeName}, enter this code in the Foreigners Club app to finish signing up.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <div style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:8px;color:#5C3D2E;background:#FAF6F0;border:1px solid #E8DFD0;border-radius:12px;padding:16px 24px;">${code}</div>
              </td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;color:#6B5E52;text-align:center;">
                This code expires in 30 minutes.<br/>
                If you did not sign up, you can safely ignore this email.
              </td>
            </tr>
          </table>
          <p style="font-size:11px;color:#9A8E82;margin-top:20px;max-width:480px;text-align:center;">
            Sent from a no-reply address. Please do not reply to this email.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string
): Promise<{ sent: boolean; devCode?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const { subject, text, html } = buildVerificationEmail(name, code);

  if (!apiKey) {
    const exposeDev = process.env.AUTH_DEV_CODES === "true";
    console.log(`[auth] Verification code for ${email}: ${code}`);
    if (process.env.NODE_ENV === "production" && !exposeDev) {
      throw new Error(
        "Email verification is not configured. Add RESEND_API_KEY on the server."
      );
    }
    return { sent: false, devCode: exposeDev ? code : undefined };
  }

  const from = getFromEmail();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject,
      html,
      text,
      reply_to: process.env.AUTH_REPLY_TO_EMAIL?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[auth] Resend failed:", text);
    throw new Error("Could not send verification email. Check AUTH_FROM_EMAIL domain setup.");
  }

  console.log(`[auth] Verification email sent to ${email}`);
  return { sent: true };
}
