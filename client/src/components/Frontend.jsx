import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
/**
 * Frontend.jsx – Single-page component
 * -------------------------------------------------------
 * Drop this file into src/ as `Frontend.jsx` and render it in App.jsx:
 *   import Frontend from "./Frontend";
 *   export default function App(){ return <Frontend/> }
 *
 * Tailwind notes:
 * - Make sure your tailwind.config.js includes the custom animations
 *   you used earlier (fade-in, slide-up, float, etc.).
 * - Ensure `index.css` has Tailwind base/components/utilities.
 */

export default function Frontend() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const trackRef = useRef(null); // testimonials track
  const navigate = useNavigate();

  const scrollTrack = (dir = 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".card");
    const step = card ? card.clientWidth + 24 /* gap-6 */ : 340;
    track.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  // mark enrollment and redirect to course dashboard
  const handleEnroll = (e) => {
    const btn = e.currentTarget;
    const id = btn?.dataset?.courseId || "002";
    const name = btn?.dataset?.courseName || "Frontend Development Program";
    const amount = btn?.dataset?.courseAmount || "50000";

    // Persist enrollment locally (you can replace with backend call)
    const enrolledKey = `enrolled:${id}`;
    const enrolledObj = {
      courseId: id,
      name,
      amount: Number(amount),
      enrolledAt: Date.now(),
      status: "active",
    };
    try {
      localStorage.setItem(enrolledKey, JSON.stringify(enrolledObj));
    } catch (err) {
      console.warn("Could not save enrollment to localStorage:", err);
    }

    // Navigate to course dashboard / details page
    navigate(`/course/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 scroll-smooth">
      {/* NAVBAR */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="#hero">
              <img src={logo} alt="logo" className="h-24 mt-2" />
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#overview" className="text-gray-600 hover:text-blue-600 transition">Overview</a>
              <a href="#syllabus" className="text-gray-600 hover:text-blue-600 transition">Syllabus</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">Testimonials</a>
            </div>

            {/* CTA (Desktop) */}
            <div className="hidden md:block">
              <button
                onClick={handleEnroll}
                data-course-id="002"
                data-course-name="Frontend Development Program"
                data-course-amount="50000"
                className="enroll-button bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Enroll Now
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              aria-label="Toggle mobile menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 animate-slide-down">
              <a onClick={() => setMobileOpen(false)} href="#overview" className="block py-2 px-2 text-gray-700 hover:bg-blue-50 rounded">Overview</a>
              <a onClick={() => setMobileOpen(false)} href="#syllabus" className="block py-2 px-2 text-gray-700 hover:bg-blue-50 rounded">Syllabus</a>
              <a onClick={() => setMobileOpen(false)} href="#features" className="block py-2 px-2 text-gray-700 hover:bg-blue-50 rounded">Features</a>
              <a onClick={() => setMobileOpen(false)} href="#testimonials" className="block py-2 px-2 text-gray-700 hover:bg-blue-50 rounded">Testimonials</a>
              <button
                onClick={(e) => { handleEnroll(e); setMobileOpen(false); }}
                data-course-id="002"
                data-course-name="Python Programming Course"
                data-course-amount="50000"
                className="w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Enroll Now
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main id="main-content" className="flex-1 pt-16">
        {/* HERO */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative container mx-auto px-4 py-24 flex flex-col items-center text-center z-10">
            {/* Floating dots */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="animate-float absolute top-1/4 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full" />
              <div className="animate-pulse-slow absolute top-1/3 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full" />
              <div className="animate-bounce-slow absolute bottom-1/4 left-1/3 w-20 h-20 bg-white opacity-10 rounded-full" />
            </div>

            <div className="transform hover:scale-105 transition duration-500">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">Frontend Development Program</h1>
              <p className="text-xl md:text-2xl text-white mb-8 animate-slide-up">Step into the world of possibilities!</p>

              <div className="space-y-4">
                <button
                  onClick={handleEnroll}
                  data-course-id="002"
                  data-course-name="Python Programming Course"
                  data-course-amount="50000"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border-2 border-white rounded-full overflow-hidden hover:bg-white hover:text-blue-600 transition"
                >
                  <span className="relative z-10">Enroll Now for Free!</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white transition-transform duration-300" />
                </button>
                <p className="text-white/95 text-lg">Join thousands of successful students</p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full h-16 bg-white/5 blur-xl" />
          </div>

          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 animate-pulse-slow opacity-30 bg-gradient-to-r from-blue-400 to-purple-400" />
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Course Overview</h2>
              <p className="text-xl text-gray-600">Your journey to success starts here</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["Foundations", "Advanced Skills", "Industry Projects"].map((title, i) => (
                <div key={title} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-blue-600 text-2xl font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
                  <p className="text-gray-600 text-center">{i === 0 ? "Master the fundamental concepts with hands-on practice and expert guidance" : i === 1 ? "Deep dive into advanced topics with real-world project implementation" : "Build your portfolio with industry-standard projects and mentorship"}</p>
                </div>
              ))}
            </div>

            {/* Key features */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Live Interactive Sessions</h4>
                  <p className="text-gray-600">Engage in real-time with industry experts and get your doubts cleared instantly</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">1:1 Mentorship</h4>
                  <p className="text-gray-600">Get personalized guidance from industry experts throughout your learning journey</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SYLLABUS */}
        <section id="syllabus" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Course Syllabus</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Reuse your modules: */}
              {[{
                name: "Foundation Basics",
                items: ["Learn Python syntax, installation, and fundamentals.", "Master loops, functions, and error handling."]
              },{
                name: "Advanced Concepts",
                items: ["Classes, objects, inheritance, and polymorphism.", "List comprehensions, generators, file handling, and debugging."]
              },{
                name: "Real-World Projects",
                items: ["Web scraping, automation, and data analysis.", "Create and showcase projects on GitHub."]
              },{
                name: "Career Preparation",
                items: ["Focus on algorithms, data structures, and Python-specific challenges.", "Build a strong resume and explore career paths."]
              }].map((m) => (
                <div key={m.name} className="cursor-pointer transform hover:scale-105 transition">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      {m.items.map((it, idx) => (
                        <li key={idx} className="flex items-center"><Check/> {it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-linear-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Course Features</h2>
              <p className="text-xl text-gray-600">Everything you need to succeed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Real World Projects", color: "blue" },
                { title: "Expert Mentorship", color: "purple" },
                { title: "Live Sessions", color: "red" },
                { title: "Certification", color: "purple" },
                { title: "Lifetime Access", color: "red" },
                { title: "Community Support", color: "blue" },
              ].map((f) => (
                <div key={f.title} className="group">
                  <div className="bg-white rounded-2xl shadow-xl p-8 transition-transform duration-500 transform group-hover:-translate-y-1">
                    <div className={`w-16 h-16 bg-${f.color}-100 rounded-full flex items-center justify-center mb-6`}>
                      <span className={`w-8 h-8 rounded-full bg-${f.color}-600 inline-block`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{f.title}</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat, quaerat.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="p-5 mb-5 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          <div className="container mx-auto px-4 mb-5">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">What Our Students Say</h2>

            <div className="relative">
              {/* hide native scrollbar (webkit + Firefox + IE) */}
              <style>{`
                .testimonial-carousel::-webkit-scrollbar { display: none; }
                .testimonial-carousel { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>

              {/* Track */}
              <div
                ref={trackRef}
                className="testimonial-carousel flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-p-6"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {[
                  { name: "Rahul Sharma", role: "Software Engineer", badge: "RS", color: "blue" },
                  { name: "Priya Kumar", role: "Data Analyst", badge: "PK", color: "purple" },
                  { name: "Ankit Verma", role: "Full Stack Developer", badge: "AV", color: "green" },
                ].map((t) => (
                  <div key={t.name} className="card min-w-[350px] snap-start bg-white rounded-2xl shadow-xl p-8 transform transition hover:scale-105">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 bg-${t.color}-100 rounded-full flex items-center justify-center mr-4`}>
                        <span className={`text-${t.color}-600 font-bold`}>{t.badge}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{t.name}</h4>
                        <p className="text-gray-600">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">“Amazing course! The mentorship and projects were invaluable.”</p>
                  </div>
                ))}
              </div>

              {/* Arrows */}
              <button onClick={() => scrollTrack(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100" aria-label="Prev">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => scrollTrack(1)} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100" aria-label="Next">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* ENROLLMENT CTA */}
        <section id="enrollment" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-8">Start Building Your Future!</h2>
              <p className="text-xl mb-12 text-white/90">Join thousands of successful students who have transformed their careers with us</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { title: "Lifetime Access" },
                  { title: "1:1 Mentorship" },
                  { title: "Certificate" },
                ].map((b) => (
                  <div key={b.title} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition">
                    <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                    <p className="text-white/80">Benefit description</p>
                  </div>
                ))}
              </div>

              <div className="group inline-block relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition" />
                <button
                  onClick={handleEnroll}
                  data-course-id="002"
                  data-course-name="Python Programming Course"
                  data-course-amount="50000"
                  className="relative px-12 py-4 bg-white text-blue-600 text-xl font-bold rounded-lg transform hover:scale-105 transition"
                >
                  Enroll Today Now
                </button>
              </div>

              
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="footer" className="bg-gray-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div>
              <img src={logo} alt="logo" className="-mt-14" />
              <p className="text-gray-400 mb-6">Empowering students with industry-relevant skills and knowledge for a successful career.</p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#overview" className="text-gray-400 hover:text-white">Overview</a></li>
                <li><a href="#syllabus" className="text-gray-400 hover:text-white">Syllabus</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:internindianacademy@gmail.com?subject=Support%20Request" className="text-gray-400 hover:text-white">Contact Us</a></li>
            
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                {/* <li className="flex items-center gap-2">📞 +91 9540666691</li> */}
                <li className="flex items-center gap-2">✉️ info@iiacademy.in</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">© {new Date().getFullYear()} IIAcademy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Check({ className = "w-5 h-5 mr-2" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}
