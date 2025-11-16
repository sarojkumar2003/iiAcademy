import React from "react";

/**
 * Privacy Policy – Intern Indian Academy (Startup‑grade)
 *
 * This is a practical, production‑ready privacy policy designed for an
 * Indian ed‑tech startup. It covers DPDP Act (India), and provides
 * addenda for GDPR/UK GDPR and California (CPRA). Replace the COMPANY_* constants
 * with your real details and review with counsel before launch.
 */

// ====== STARTUP CONFIG (edit these) ======
const COMPANY_NAME = "Intern Indian Academy";
const COMPANY_SHORT = "IIA";
const COMPANY_DOMAIN = "internindianacademy.in"; // no protocol
const COMPANY_EMAIL = "internindiaacademy@gmail.com";
const COMPANY_PHONE = "+91 9540666691";
const COMPANY_ADDRESS = "India (remote-first)"; // update with registered address if available
const GRIEVANCE_OFFICER = "Grievance Officer"; // add full name if required
// ========================================

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-violet-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Effective date: {new Date().toLocaleDateString()} • Controller: {COMPANY_NAME}
          </p>
        </header>

        <section className="prose prose-slate max-w-none">
          <p>
            This Privacy Policy explains how <strong>{COMPANY_NAME}</strong> ("<strong>{COMPANY_SHORT}</strong>", "we", "us", or "our") collects, uses, shares, and protects personal information when you access our website (<em>{COMPANY_DOMAIN}</em>), purchase courses, or use related services (the "<strong>Services</strong>"). By using the Services, you agree to this Policy and our Terms.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            Data controller: <strong>{COMPANY_NAME}</strong><br/>
            Address: {COMPANY_ADDRESS}<br/>
            Contact: <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> • {COMPANY_PHONE}
          </p>

          <h2>2. Information We Collect</h2>
          <ul>
            <li><strong>Identity & Contact:</strong> name, email, phone, avatar/profile details.</li>
            <li><strong>Account & Learning:</strong> enrollments, progress, submissions, attendance, badges.</li>
            <li><strong>Payment:</strong> transaction IDs and status from our payment partners (we do not store full card numbers).</li>
            <li><strong>Device/Usage:</strong> IP, device type, OS/browser, pages viewed, timestamps, referral URLs.</li>
            <li><strong>Support Communications:</strong> emails/messages you send to us, feedback and survey responses.</li>
            <li><strong>Cookies/Local Storage:</strong> session tokens, preferences, and analytics cookies.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Deliver and personalize the Services, including course access and progress tracking.</li>
            <li>Process payments, prevent fraud, and maintain accounting records.</li>
            <li>Provide customer support and send essential notifications (receipts, alerts, schedule changes).</li>
            <li>Improve content and platform reliability (analytics, debugging, testing).</li>
            <li>Comply with legal obligations and enforce our terms and policies.</li>
          </ul>

          <h2>4. Lawful Bases / Ground of Processing</h2>
          <p>
            We process data based on: <strong>contract necessity</strong> (to provide the Services), <strong>legitimate interests</strong> (platform improvement, security, fraud prevention), <strong>consent</strong> (optional marketing or certain cookies), and <strong>legal obligation</strong> (tax and compliance).
          </p>

          <h2>5. Sharing & Sub‑processors</h2>
          <p>We share data only as needed to operate the Services:</p>
          <ul>
            <li><strong>Payments:</strong> PCI‑DSS compliant gateways (e.g., Razorpay/Stripe)—for processing and fraud checks.</li>
            <li><strong>Analytics & Crash Reporting:</strong> tools like Google Analytics/Log services—aggregated usage insights.</li>
            <li><strong>Communication:</strong> email/SMS providers for transactional messages.</li>
            <li><strong>Compliance & Safety:</strong> to law enforcement or regulators if required by applicable law.</li>
          </ul>
          <p>
            We require our service providers to handle data securely and only for the documented purpose. Contact us for an up‑to‑date list of sub‑processors.
          </p>

          <h2>6. Cookies & Similar Technologies</h2>
          <p>
            We use <strong>necessary</strong> cookies for login/authentication and preferences, and <strong>optional</strong> cookies for analytics and performance. You can control cookies via your browser settings; blocking some may impact functionality.
          </p>

          <h2>7. Retention</h2>
          <p>We keep data only as long as needed for the purposes above or legal requirements:</p>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Typical Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account profile</td>
                <td>For the life of the account; deleted within 30–90 days after closure</td>
              </tr>
              <tr>
                <td>Learning records</td>
                <td>For the life of the account or until you delete; backups may persist for limited time</td>
              </tr>
              <tr>
                <td>Payment records</td>
                <td>Min. 7 years (tax/accounting), per Indian law and gateway rules</td>
              </tr>
              <tr>
                <td>Support emails</td>
                <td>Up to 3 years, unless required longer for disputes</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>12–26 months in aggregated/anonymized form</td>
              </tr>
            </tbody>
          </table>

          <h2>8. Security</h2>
          <ul>
            <li>Encryption in transit (HTTPS/TLS), restricted access on a need‑to‑know basis.</li>
            <li>Regular backups and monitoring; least‑privilege access for staff.</li>
            <li>No method is 100% secure; incidents will be handled per our response procedures.</li>
          </ul>

          <h2>9. Children</h2>
          <p>
            Our Services are intended for users aged <strong>13+</strong>. If we learn a child under 13 has provided personal data, we will delete it and may suspend access. Parents/guardians can contact us for assistance.
          </p>

          <h2>10. Your Choices & Rights</h2>
          <ul>
            <li>Access, correct, or delete certain profile data in your account settings.</li>
            <li>Request deletion or restriction of personal data where applicable.</li>
            <li>Opt‑out of marketing emails via the unsubscribe link; essential emails will continue.</li>
            <li>Control cookies in your browser settings.</li>
          </ul>

          <h2>11. India – DPDP Act, 2023</h2>
          <p>
            We follow the principles of the Digital Personal Data Protection Act, 2023: lawful use, purpose limitation, data minimization, accuracy, storage limitation, reasonable security safeguards, and accountability. You may write to our <strong>{GRIEVANCE_OFFICER}</strong> for grievances or requests.
          </p>

          <h2>12. EU/UK – GDPR Notice</h2>
          <p>
            Where GDPR/UK GDPR applies, {COMPANY_NAME} acts as a controller. You may have rights to access, rectification, erasure, restriction, portability, and objection. Our lawful bases are listed above. You can contact us to exercise these rights; we may require verification.
          </p>

          <h2>13. California – CPRA Notice</h2>
          <p>
            We do not sell personal information. California residents may request access or deletion of personal information, and may not be discriminated against for exercising rights. Authorized agents may submit requests with proof of authority.
          </p>

          <h2>14. International Transfers</h2>
          <p>
            We are based in India, and service providers may be located in other countries. We take reasonable steps to ensure an adequate level of protection consistent with applicable laws.
          </p>

          <h2>15. Links to Other Sites</h2>
          <p>
            Third‑party sites linked from the Services are governed by their own privacy policies. Review those policies before submitting personal data.
          </p>

          <h2>16. Changes to This Policy</h2>
          <p>
            We may update this Policy as our practices evolve. The “Effective date” above shows the latest version. Material changes will be notified via the website or email where appropriate.
          </p>

          <h2>17. Contact & Grievance Redressal</h2>
          <p>
            Email: <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a><br/>
            Phone: {COMPANY_PHONE}<br/>
            Address: {COMPANY_ADDRESS}<br/>
            Grievance Officer: {GRIEVANCE_OFFICER}
          </p>

          <p className="text-sm text-slate-500">
            <strong>Disclaimer:</strong> This template is provided for convenience and should be reviewed by legal counsel to ensure compliance with your specific operations and jurisdiction.
          </p>
        </section>
      </div>
    </main>
  );
}
