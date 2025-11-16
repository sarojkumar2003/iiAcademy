
import Choose from "./Choose";
import CommunitySection from "./CommunitySection";
import Courses from "./Courses";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Hero from "./Hero";
import JourneyTimeline from "./JourneyTimeline";
import Navbar from"./Navbar";
import SuccessStories from "./SuccessStories";



function Home() {
  return (
    <div>
            <Navbar/>
            <Hero/>
            <Choose/>
            <JourneyTimeline/>
            <Courses/>
            <SuccessStories/>
            <CommunitySection/>
            <FAQSection/>
            <Footer/>
    </div>
  );
}
export default Home;
