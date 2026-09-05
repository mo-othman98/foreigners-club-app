export const metadata = {
  title: "Delete Account — Foreigners Club",
  description:
    "How to delete your Foreigners Club account and what data is removed.",
};

export default function DeleteAccountPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12 prose prose-slate">
      <h1>Delete your Foreigners Club account</h1>
      <p>
        This page explains how to permanently delete your account for the
        Foreigners Club mobile app, what data we remove, and what may be retained.
      </p>

      <h2>Delete from the app (fastest)</h2>
      <ol>
        <li>Open the <strong>Foreigners Club</strong> app and sign in.</li>
        <li>Open <strong>Account</strong> settings (from your profile / account screen).</li>
        <li>Tap <strong>Delete account</strong> and confirm.</li>
      </ol>
      <p>
        Deletion starts immediately. Your account session ends and you will need
        to create a new account if you return later.
      </p>

      <h2>Request deletion by email</h2>
      <p>
        If you cannot use the in-app option, email us from the address on your
        account:
      </p>
      <p>
        <a href="mailto:mo-othman98@hotmail.com?subject=Foreigners%20Club%20account%20deletion%20request">
          mo-othman98@hotmail.com
        </a>
      </p>
      <p>
        Include the subject line <strong>“Account deletion request”</strong> and
        the email address used to sign in. We process requests within{" "}
        <strong>14 days</strong> (usually sooner).
      </p>

      <h2>Data we delete</h2>
      <p>When your account is deleted, we remove:</p>
      <ul>
        <li>Account credentials and profile (name, email, sign-in identifiers)</li>
        <li>Passport / journal data stored on our servers</li>
        <li>Connect / member profile and profile photo associated with your account</li>
        <li>Moderation records tied to your account email (reports/blocks where applicable)</li>
      </ul>

      <h2>Data that may be kept</h2>
      <ul>
        <li>
          <strong>Community content</strong> you posted publicly (for example country
          reviews or chat messages) may remain in anonymized or detached form so
          other users’ threads stay readable, unless you ask us to remove specific
          posts.
        </li>
        <li>
          <strong>Security / legal logs</strong> may be retained for a limited period
          when required for security, fraud prevention, or legal obligations
          (typically up to 90 days, or longer if required by law).
        </li>
        <li>
          <strong>Backups</strong> may take a short time to fully purge after
          deletion (usually within 30 days).
        </li>
      </ul>

      <h2>Delete some data without deleting your account</h2>
      <p>
        You can update or clear passport / profile details in the app where those
        editors are available. To request deletion of specific content (for
        example a review or photo) without closing your account, email{" "}
        <a href="mailto:mo-othman98@hotmail.com">mo-othman98@hotmail.com</a> with
        what you want removed.
      </p>

      <p>
        Related: <a href="/privacy">Privacy Policy</a> ·{" "}
        <a href="/support">Support</a>
      </p>
    </article>
  );
}
