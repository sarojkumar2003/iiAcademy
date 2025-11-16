import React from "react";

/**
 * Terms of Service – Intern Indian Academy (Startup‑grade)
 *
 * Practical, production‑ready ToS for an Indian ed‑tech startup.
 * Update COMPANY_* constants below. Review with legal counsel before launch.
 */

// ====== STARTUP CONFIG (edit these) ======
const COMPANY_NAME = "Intern Indian Academy";
const COMPANY_SHORT = "IIA";
const COMPANY_DOMAIN = "internindianacademy.in"; // no protocol
const COMPANY_EMAIL = "internindiaacademy@gmail.com";
const COMPANY_PHONE = "+91 9540666691";
const COMPANY_ADDRESS = "India (remote-first)"; // update registered address if available
// ========================================

export default function TermsOfService() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-violet-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Effective date: {new Date().toLocaleDateString()} • Applies to: {COMPANY_DOMAIN}
          </p>
        </header>

        <section className="prose prose-slate max-w-none">
          <p>
            These Terms of Service ("<strong>Terms</strong>") govern your access to and use of the
            website and services offered by <strong>{COMPANY_NAME}</strong> ("<strong>{COMPANY_SHORT}</strong>", "we", "us").
            By accessing <em>{COMPANY_DOMAIN}</em> or using our courses, mentorship, or related services (the
            "<strong>Services</strong>"), you agree to be bound by these Terms and our
            <a href="/privacy-policy"> Privacy Policy</a>.
          </p>

          <h2>1. Accounts & Eligibility</h2>
          <ul>
            <li>You must be at least 13 years old to create an account. Parents/guardians are responsible for minors.</li>
            <li>Provide accurate information and keep your credentials confidential. You are responsible for activities under your account.</li>
            <li>We may suspend or terminate accounts for policy violations, fraud, or misuse.</li>
          </ul>

          <h2>2. Courses, Mentorship & Certificates</h2>
          <ul>
            <li>Course access is personal and non‑transferable. Do not share, resell, or redistribute content.</li>
            <li>Live sessions may be recorded for quality and revision. Timings can change; replays/alternates may be provided.</li>
            <li>Certificates (if offered) reflect completion of specified criteria; they are not a formal degree or guarantee of employment.</li>
          </ul>

          <h2>3. Payments, Pricing & Refunds</h2>
          <ul>
            <li>All fees are shown before checkout. Taxes may apply.</li>
            <li>Payments are processed by third‑party gateways. We do not store full card data.</li>
            <li>
              <strong>No refunds by default.</strong> Limited exceptions may be considered after verification as set out in our
              <a href="/refund-policy"> Refund Policy</a>.
            </li>
            <li>For subscriptions/installments, missed payments may result in access suspension.</li>
            <li>We may correct pricing errors and cancel orders with a full refund of the amount charged.</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <ul>
            <li>No illegal activity, harassment, hate speech, or intellectual‑property infringement.</li>
            <li>No reverse engineering, scraping, or circumvention of technical controls.</li>
            <li>No sharing of paid materials publicly, or attempts to bypass payment.</li>
            <li>Respect community guidelines in forums, chat, and live sessions.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <ul>
            <li>The Services, including text, graphics, videos, and code, are owned by {COMPANY_NAME} or licensors.</li>
            <li>We grant you a limited, non‑exclusive, non‑transferable license to access content for personal learning.</li>
            <li>Any feedback you submit may be used by us without obligation.</li>
          </ul>

          <h2>6. User Content</h2>
          <ul>
            <li>You retain rights in content you submit (projects, comments), but grant us a license to host, display, and improve the Services.</li>
            <li>Do not upload content that is unlawful, harmful, or violates others’ rights.</li>
            <li>We may remove content that breaches these Terms.</li>
          </ul>

          <h2>7. Third‑Party Links & Services</h2>
          <p>
            The Services may include links or integrations with third‑party services (e.g., payment gateways, analytics, video streaming).
            We are not responsible for their content or policies. Review their terms and privacy policies.
          </p>

          <h2>8. Disclaimers</h2>
          <ul>
            <li>The Services are provided on an "as is" and "as available" basis.</li>
            <li>We do not guarantee specific learning outcomes, job offers, or uninterrupted access.</li>
            <li>From time to time, maintenance or outages may occur; we aim to minimize disruptions.</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {COMPANY_NAME} will not be liable for indirect, incidental, special, consequential,
            or punitive damages, or any loss of profits, revenue, data, or use arising from or related to your use of the Services.
            Our aggregate liability shall not exceed the amount you paid to us in the 3 months preceding the claim.
          </p>

          <h2>10. Indemnity</h2>
          <p>
            You agree to defend, indemnify, and hold harmless {COMPANY_NAME} and its affiliates from claims arising from your use of
            the Services, your content, or your violation of these Terms or applicable law.
          </p>

          <h2>11. Privacy</h2>
          <p>
            Our <a href="/privacy-policy">Privacy Policy</a> explains how we collect and use personal data. By using the Services,
            you consent to such processing.
          </p>

          <h2>12. Termination</h2>
          <ul>
            <li>You may delete your account at any time (note: we may retain certain records per law).</li>
            <li>We may suspend or terminate access for violations, fraud, or risks to the community or platform.</li>
          </ul>

          <h2>13. Changes to the Services or Terms</h2>
          <p>
            We may update the Services and these Terms. The effective date above reflects the latest version. Material changes may be
            notified via the website or email. Continued use constitutes acceptance of the updated Terms.
          </p>

          <h2>14. Governing Law & Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of India. Disputes will first be attempted to be resolved amicably by contacting
            us at <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>. If unresolved, the courts of India shall have jurisdiction, subject to
            applicable consumer protection laws.
          </p>

          <h2>15. Contact</h2>
          <p>
            {COMPANY_NAME}, {COMPANY_ADDRESS}<br/>
            Phone: {COMPANY_PHONE} • Email: <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
          </p>

          <p className="text-sm text-slate-500">
            <strong>Note:</strong> This template is for general information and does not constitute legal advice. Please review with your legal advisor.
          </p>
        </section>
      </div>
    </main>
  );
}
