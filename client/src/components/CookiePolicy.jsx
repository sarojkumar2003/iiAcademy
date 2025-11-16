import React from "react";

/**
 * Cookie Policy – Intern Indian Academy (Startup‑grade)
 *
 * Practical cookie policy for an Indian ed‑tech startup with notes for GDPR/ePrivacy.
 * Includes categories, purposes, retention, and management instructions.
 * Update COMPANY_* below and the example cookie list to match your stack.
 */

// ====== STARTUP CONFIG (edit these) ======
const COMPANY_NAME = "Intern Indian Academy";
const COMPANY_DOMAIN = "internindianacademy.in"; // no protocol
const COMPANY_EMAIL = "internindiaacademy@gmail.com";
// ========================================

export default function CookiePolicy() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-violet-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Cookie Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Applies to: {COMPANY_DOMAIN} • Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="prose prose-slate max-w-none">
          <h2>1) What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help websites
            remember your actions and preferences (such as login, language, and other display settings).
            We also use similar technologies like local storage and pixels; we refer to all of these collectively as
            <strong>“cookies.”</strong>
          </p>

          <h2>2) How we use cookies</h2>
          <p>
            {COMPANY_NAME} uses cookies to operate and secure the site, remember your preferences, analyze usage,
            and improve our courses and features.
          </p>

          <h2>3) Categories of cookies</h2>
          <ul>
            <li><strong>Strictly necessary</strong> – required for core functionality (authentication, security, load‑balancing). These cannot be switched off in our systems.</li>
            <li><strong>Preferences</strong> – remember settings like theme, language, or saved progress UI choices.</li>
            <li><strong>Analytics</strong> – help us understand how the site is used so we can improve performance and content.</li>
            <li><strong>Performance</strong> – measure and enhance speed, video delivery, and reliability.</li>
            <li><strong>Marketing</strong> – used to deliver relevant messages and measure campaign effectiveness (only if we run ads).</li>
          </ul>

          <h2>4) Examples of cookies we use</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Purpose</th>
                <th>Provider</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>iia_session</td>
                <td>Strictly necessary</td>
                <td>Maintains your login session and keeps you signed in.</td>
                <td>{COMPANY_DOMAIN}</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>prefs_theme</td>
                <td>Preferences</td>
                <td>Stores dark/light mode preference.</td>
                <td>{COMPANY_DOMAIN}</td>
                <td>12 months</td>
              </tr>
              <tr>
                <td>_ga</td>
                <td>Analytics</td>
                <td>Google Analytics – distinguishes users for usage stats.</td>
                <td>Google</td>
                <td>13 months</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Analytics</td>
                <td>Google Analytics – short‑lived session analytics.</td>
                <td>Google</td>
                <td>24 hours</td>
              </tr>
              <tr>
                <td>_gat</td>
                <td>Performance</td>
                <td>Throttles request rate to improve performance.</td>
                <td>Google</td>
                <td>1 minute</td>
              </tr>
              <tr>
                <td>_fbp</td>
                <td>Marketing</td>
                <td>Facebook Pixel – measures advertising effectiveness.</td>
                <td>Meta</td>
                <td>3 months</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-slate-500">Note: The exact set may change as we improve our platform.</p>

          <h2>5) Consent and control</h2>
          <ul>
            <li>
              <strong>Consent banner:</strong> On your first visit we ask for your consent for non‑essential cookies. You may
              withdraw or change consent at any time using the “Cookie Settings” link (see below).
            </li>
            <li>
              <strong>Browser controls:</strong> You can block or delete cookies in your browser settings. Blocking necessary cookies may
              affect site functionality (e.g., login will not work).
            </li>
            <li>
              <strong>Analytics opt‑out:</strong> Where supported, you can use analytics opt‑out tools or set “Do Not Track.”
            </li>
          </ul>

          <h2>6) Managing your preferences</h2>
          <p>
            To review or update your cookie choices, open <a href="#cookie-settings">Cookie Settings</a> in the site footer or account
            menu. If you cannot find the control, contact us at <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> and we’ll help.
          </p>

          <h2>7) Third‑party cookies</h2>
          <p>
            Some cookies are set by third‑party services we use (e.g., analytics, video, or ads). These providers have their own
            privacy/cookie policies, which we encourage you to review.
          </p>

          <h2>8) Retention</h2>
          <p>
            Cookies may be <strong>session</strong> (deleted when you close your browser) or <strong>persistent</strong> (stored until their
            stated expiration or until you delete them). We aim to use reasonable durations and minimize identifiers.
          </p>

          <h2>9) Children</h2>
          <p>
            Our Services are intended for users aged 13+. We do not knowingly place marketing cookies for users under 13.
          </p>

          <h2>10) Legal bases & compliance notes</h2>
          <ul>
            <li><strong>India (DPDP Act 2023):</strong> We seek consent for non‑essential cookies and use reasonable safeguards.</li>
            <li><strong>EU/UK (GDPR & ePrivacy):</strong> Non‑essential cookies require prior consent; necessary cookies do not.</li>
          </ul>

          <h2>11) Changes to this Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology or our practices. The “Last updated”
            date above shows the latest version.
          </p>

          <h2>12) Contact</h2>
          <p>
            Questions? Email us at <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
          </p>
        </section>

        {/* Optional: simple placeholder for a cookie settings anchor */}
        <div id="cookie-settings" className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Cookie Settings (Placeholder)</h3>
          <p className="mt-2 text-sm text-slate-600">
            Integrate your consent manager here (e.g., custom toggles, Google Consent Mode, or a CMP tool).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked disabled /> Strictly necessary
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> Preferences
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> Analytics
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> Performance
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" /> Marketing
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}
