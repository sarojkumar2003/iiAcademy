// client/src/App.jsx
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Frontend from './components/Frontend';
import Backend from './components/Backend';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import Login from './components/Login';
import AccountRegistration from './components/AccountRegistration';
import Choose from './components/Choose';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import DeleteAccount from './components/DeleteAccount';
import Footer from './components/Footer';
import CertificateVerifier from './components/CertificateVerifierFull';

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
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/delete" element={<DeleteAccount />} />

        <Route path="/certificate-verification" element={<CertificateVerifier />} />

       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
