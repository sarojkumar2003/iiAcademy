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

  // Robust login-check: accepts valid non-empty strings and JSON objects stored as string
  const isLoggedIn = () => {
    const rawUser = localStorage.getItem("user");
    const rawToken = localStorage.getItem("token");

    const validString = (s) =>
      typeof s === "string" && s !== "" && s !== "null" && s !== "undefined";

    if (validString(rawToken)) return true;
    if (!validString(rawUser)) return false;

    // If user is a JSON string like '{"id":1,...}', treat it as logged-in
    if (rawUser.startsWith("{") || rawUser.startsWith("[")) {
      try {
        const parsed = JSON.parse(rawUser);
        return !!parsed; // truthy object
      } catch {
        // not valid JSON, but it's a non-empty string (e.g. "loggedin")
        return true;
      }
    }

    return true;
  };

  // Handle both mouse click and keyboard (Enter/Space)
  const handleCardActivate = (path) => {
    if (!isLoggedIn()) {
      // optionally show toast here
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const onCardKeyDown = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardActivate(path);
    }
  };

  return (
    <section id="services" className="w-full py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900">Explore Our Courses</h2>
        <p className="text-gray-600 mt-2">Choose your path and start learning</p>

        {/* Course Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleCardActivate(course.link)}
              onKeyDown={(e) => onCardKeyDown(e, course.link)}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={`Open ${course.title} course`}
            >
              <div className="text-4xl">{course.icon}</div>

              <h3 className="text-2xl font-semibold mt-4">{course.title}</h3>
              <p className="text-gray-600 mt-2">{course.desc}</p>

              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Level:</strong> {course.level}</p>
                <p className="mt-2"><strong>Tools:</strong> {course.tools.join(", ")}</p>
              </div>

              <div className="mt-5 text-blue-600 font-medium hover:underline">
                Learn More →
              </div>
            </div>
          ))}
        </div>

        <div className="verify-section">
          <button
            onClick={() => navigate("/certificate-verification")}
            className="mt-16 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Verify Your Certificate Now
          </button>
        </div>
      </div>
    </section>
  );
}
