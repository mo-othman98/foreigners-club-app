const FROM_EMAIL =
  process.env.AUTH_FROM_EMAIL ?? "Foreigners Club <onboarding@resend.dev>";

export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string
): Promise<{ sent: boolean; devCode?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const subject = "Verify your Foreigners Club email";
  const html = `
    <p>Hi ${name},</p>
    <p>Your verification code is:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
    <p>Enter this code in the app to access your passport.</p>
    <p>If you did not sign up, you can ignore this email.</p>
  `;

  if (!apiKey) {
    console.log(`[auth] Verification code for ${email}: ${code}`);
    const exposeDev =
      process.env.NODE_ENV !== "production" ||
      process.env.AUTH_DEV_CODES === "true";
    return { sent: false, devCode: exposeDev ? code : undefined };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[auth] Resend failed:", text);
    throw new Error("Could not send verification email");
  }

  return { sent: true };
}
