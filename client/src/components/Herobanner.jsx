export default function Herobanner() {
  return (
    <section className="relative flex justify-center items-center py-16">
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[60%] h-64 bg-pink-200/30 blur-[90px] rounded-full" />
      </div>

      {/* Glowing Card Container */}
      <div className="relative z-10 w-[90%] md:w-[80%] bg-white rounded-3xl shadow-lg px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-10 
        animate-light-glow overflow-hidden">

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 rounded-3xl bg-white/10 pointer-events-none shine-effect" />

        {/* Stat 1 */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">700+</h2>
          <p className="text-gray-600 mt-1">Active Students</p>
        </div>

        {/* Stat 2 */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">5+</h2>
          <p className="text-gray-600 mt-1">Tech Courses</p>
        </div>

        {/* Stat 3 */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">100%</h2>
          <p className="text-gray-600 mt-1">Free Access</p>
        </div>

        {/* Stat 4 */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">50+</h2>
          <p className="text-gray-600 mt-1">Success Stories</p>
        </div>
      </div>

      {/* Add Custom Tailwind Animations */}
      <style>
        {`
          @keyframes lightglow {
            0% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
            50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.4); }
            100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
          }
          .animate-light-glow {
            animation: lightglow 3s ease-in-out infinite;
            transition: 0.3s;
          }
          .shine-effect::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
            transform: skewX(-25deg);
            transition: 0.5s;
          }
          .animate-light-glow:hover .shine-effect::before {
            left: 150%;
          }
        `}
      </style>
    </section>
  );
}
