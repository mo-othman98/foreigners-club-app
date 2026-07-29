export const metadata = {
  title: "Support — Foreigners Club",
  description: "Get help with the Foreigners Club app.",
};

export default function SupportPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12 prose prose-slate">
      <h1>Support</h1>
      <p>
        Need help with Foreigners Club? We&apos;re happy to assist with account
        access, reviews, maps, and general app questions.
      </p>

      <h2>Contact</h2>
      <p>
        Email:{" "}
        <a href="mailto:mo-othman98@hotmail.com">mo-othman98@hotmail.com</a>
      </p>
      <p>We typically reply within 1–2 business days.</p>

      <h2>Common topics</h2>
      <ul>
        <li>Signing up or logging in</li>
        <li>Updating your passport / visited countries</li>
        <li>Reporting inaccurate country information or abusive content</li>
        <li>Deleting your account</li>
      </ul>

      <h2>Privacy</h2>
      <p>
        Read our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    </article>
  );
}
