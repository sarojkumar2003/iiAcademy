import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Frontend Development",
      desc: "Learn to create modern, responsive websites using HTML, CSS, JavaScript, and React.",
      icon: "💻",
      duration: "3 Months",
      level: "Beginner to Advanced",
      tools: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
      link: "/frontend",
    },
    {
      title: "Backend Development",
      desc: "Build powerful server-side applications using Node.js, Express, APIs, and MongoDB.",
      icon: "🗄️",
      duration: "3 Months",
      level: "Beginner to Intermediate",
      tools: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT Auth"],
      link: "/backend",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path); // Navigate to that course page
  };

  return (
    <section id="services" className="courses-section">
      <div className="courses-inner">
        <h2 className="courses-title">Explore Our Courses</h2>
        <p className="courses-subtitle">Choose your path and start learning</p>

        <div className="courses-grid">
          {courses.map((course, index) => (
            <article
              key={index}
              onClick={() => handleCardClick(course.link)}
              className="course-card"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" ? handleCardClick(course.link) : null)}
            >
              <div className="course-icon">{course.icon}</div>

              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.desc}</p>

              <div className="course-info">
                <p><span className="label">Duration:</span> {course.duration}</p>
                <p><span className="label">Level:</span> {course.level}</p>
                <p className="course-tools"><span className="label">Tools:</span> {course.tools.join(", ")}</p>
              </div>

              <div className="course-footer">Learn More →</div>
            </article>
          ))}
        </div>

        <div className="verify-section">
          <h1>Verify Certificates</h1>
        </div>
      </div>
    </section>
  );
}
