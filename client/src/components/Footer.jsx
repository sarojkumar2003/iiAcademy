import { Link } from "react-router-dom";
import logo from "./../images/logo.png";
import { HashLink } from "react-router-hash-link";

/**
 * Footer (pixel-match with screenshot)
 * - React + Tailwind only (no external icon libs)
 * - Responsive 4-column layout with subtle top gradient
 * - Social buttons, quick links, resources, contact info
 */

const LinkItem = ({ href = "#", children }) => (
  <a
    href={href}
    className="block py-1.5 text-[15px] text-slate-700 transition-colors hover:text-slate-900"
  >
    {children}
  </a>
);

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
    <div className="mt-4 space-y-1">{children}</div>
  </div>
);

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative w-full bg-gradient-to-b from-[#F4F2FF] to-white">
      {/* subtle top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + Social */}
          <div>
            <img src={logo} alt="logo" className="-mt-10" />
            <p className=" max-w-xs text-[15px] leading-7 -mt-3 text-slate-600">
              Empowering students with industry-ready technical skills for a
              brighter future.
            </p>

            <p className="mt-8 text-xs text-slate-500">
              © {year} Intern Indian Academy. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <Section title="Quick Links">
            <LinkItem><HashLink smooth to="/#about">
              About
            </HashLink></LinkItem>


            <LinkItem><HashLink smooth to="/#services">
              Courses
            </HashLink></LinkItem>

            <LinkItem href="https://chat.whatsapp.com/DJQOJiiNFA18vZXd5eo8BC">Community</LinkItem>
          </Section>

          {/* Resources */}
          <Section title="Resources">
            <LinkItem><HashLink smooth to="/#services">
              Learning Path
            </HashLink></LinkItem>
            <LinkItem>Student Projects</LinkItem>
            <LinkItem> <HashLink smooth to="/#contact">FAQs</HashLink></LinkItem>
          </Section>

          {/* Contact Us */}
          <div>
            <h3 className="text-[18px] font-semibold text-slate-900">
              Contact Us
            </h3>
            <div className="mt-4 space-y-4 text-[15px] text-slate-700">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </span>
                <a
                  href="mailto:internindiaacademy@gmail.com"
                  className="hover:text-slate-900"
                >
                  info@iiacademy.in
                </a>
              </div>
              {/* <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92V21a1 1 0 0 1-1.09 1A19.79 19.79 0 0 1 3 5.09 1 1 0 0 1 4 4h4.09a1 1 0 0 1 1 .75l1 3.49a1 1 0 0 1-.29 1L8.09 11A16 16 0 0 0 13 15.91l1.76-1.76a1 1 0 0 1 1-.29l3.49 1a1 1 0 0 1 .75 1V21" />
                  </svg>
                </span>
                <a href="tel:+919540666691" className="hover:text-slate-900">
                  +91 9540666691
                </a>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 -mb-16 flex flex-col items-center justify-between border-t border-slate-200 pt-6 text-[10px] text-slate-600 md:flex-row">
          <div className="flex gap-6 -mt-7">
            <Link to="/privacy-policy" className="hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-slate-900">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-slate-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
