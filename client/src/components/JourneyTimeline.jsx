import { motion } from "framer-motion";

const steps = [
  { id: 1, title: "Foundation Building", desc: "Start with programming basics, logic & problem solving.", side: "left" },
  { id: 2, title: "Skill Development", desc: "Build real-world skills with projects & applications.", side: "right" },
  { id: 3, title: "Advanced Learning", desc: "Explore AI, ML, robotics, web development, and more.", side: "left" },
  { id: 4, title: "Innovation & Creation", desc: "Build projects and solve real-world problems.", side: "right" }
];

export default function TreeTimeline() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-white via-purple-50 to-indigo-50">

      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800">Your Journey to Innovation</h2>
        <p className="text-gray-600 mt-2">Step-by-step path to becoming tech-ready</p>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-6xl mx-auto">
        
        {/* Vertical Center Line */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-purple-300 transform -translate-x-1/2"></div>

        {/* Cards */}
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            className={`w-full flex ${step.side === "left" ? "justify-start" : "justify-end"} mb-16`}
          >
            <div className={`relative w-[45%] p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-2 duration-300`}>
              
              {/* Dot Connector */}
              <div className={`absolute top-6 ${
                step.side === "left" ? "right-[-32px]" : "left-[-32px]"
              } w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-lg`}></div>

              {/* Text */}
              <h3 className="text-lg font-bold text-purple-700">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
