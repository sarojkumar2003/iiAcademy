// client/src/App.jsx
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontend from './components/Frontend';
import Backend from './components/Backend'; // <-- fixed casing
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import Login from './components/Login';
import AccountRegistration from './components/AccountRegistration';
import Choose from './components/Choose';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import DeleteAccount from './components/DeleteAccount';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<AccountRegistration />} />

        <Route path="/frontend" element={<Frontend />} />
        <Route path="/backend" element={<Backend />} />
        <Route path="/choose" element={<Choose />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/delete" element={<DeleteAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
