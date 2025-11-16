import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontend from './components/Frontend';
import Backend from './components/backend';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import Login from './components/Login';
import AccountRegistration from './components/AccountRegistration';
import Choose from './components/Choose';
import ViewProfile from './components/ViewProfile';  // Add the import for ViewProfile
import EditProfile from './components/EditProfile';  // Add the import for EditProfile
import DeleteAccount from './components/DeleteAccount';  // Add the import for DeleteAccount



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Home page route */}
        <Route path="/" element={<Home />} />

        {/* ✅ Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<AccountRegistration />} />
        
        {/* ✅ Frontend page route */}
        <Route path="/frontend" element={<Frontend />} />
        <Route path="/backend" element={<Backend />} />
        <Route path="/choose" element={<Choose />} />

        {/* ✅ Legal pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/delete" element={<DeleteAccount />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
