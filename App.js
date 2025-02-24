import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import CropRecommendation from './components/croprecommendation';
import YieldPrediction from './components/yieldprediction';
import DiseaseDetection from './components/cropdisease';

import './index.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to scroll to banner section
  const scrollToBanner = (e) => {
    e.preventDefault();
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Set a flag to scroll to banner after navigation
      sessionStorage.setItem('scrollTo', 'banner-section');
    } else {
      // We're already on the homepage, just scroll to top where banner is
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Set a flag in sessionStorage to indicate where to scroll after navigation
      sessionStorage.setItem('scrollTo', sectionId);
    } else {
      // We're already on the homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <a href="#" className="nav-logo" onClick={scrollToBanner}>
          HARVEST HUB
        </a>
      </div>
      <div className="nav-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="#" className="nav-item" onClick={scrollToBanner}>
          Home
        </a>
        <div className="nav-dropdown" ref={dropdownRef}>
          <button className="nav-item dropdown-toggle" onClick={toggleDropdown}>
            Models <span className="dropdown-icon">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/crop-recommendation" className="dropdown-item">
                Crop Prediction
              </Link>
              <Link to="/yield-prediction" className="dropdown-item">
                Yield Prediction
              </Link>
              <Link to="/disease-detection" className="dropdown-item">
                Disease Prediction
              </Link>
            </div>
          )}
        </div>

        {/* Simplified Contact Us link - works on any page */}
        <a
          href="#contact"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
        >
          Contact Us
        </a>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Separate component to use React Router hooks
const AppContent = () => {
  const location = useLocation();

  // Effect to handle scrolling after navigation
  useEffect(() => {
    // Check if we need to scroll to a section after navigation
    const scrollTo = sessionStorage.getItem('scrollTo');
    if (scrollTo && location.pathname === '/') {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        if (scrollTo === 'banner-section') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(scrollTo);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Clear the flag
            sessionStorage.removeItem('scrollTo');
          }
        }
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/yield-prediction" element={<YieldPrediction />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
      </Routes>
    </div>
  );
};

const HomePage = () => {
  const models = [
    {
      title: 'CROP PREDICTION',
      image: '/CP.png',
      path: '/crop-recommendation',
    },
    {
      title: 'CROP YIELD PREDICTION',
      image: '/CY.png',
      path: '/yield-prediction',
    },
    {
      title: 'DISEASE PREDICTION',
      image: '/CD.png',
      path: '/disease-detection',
    },
  ];

  return (
    <>
      <div className="container" id="banner-section">
        <img src="/banner.jpeg" alt="Background" className="background-img" />
        <div className="window">
          <div>
            <h1 className="title">HARVEST HUB</h1>
            <p className="sub-title">AI - Driven Agricultural Insights</p>
          </div>
        </div>
      </div>

      <div className="containerski">
        {models.map((model, index) => (
          <ModelCard key={index} model={model} />
        ))}
      </div>

      <section id="about">
        <h1>ABOUT US</h1>
        <p>
          Harvest Hub: AI-Driven Agricultural Insights is a web-based platform
          aimed at supporting farmers in making informed decisions to improve
          crop productivity. It provides personalized crop recommendations,
          accurate yield predictions, and early plant disease detection.
        </p>
      </section>

      <ContactSection />
    </>
  );
};

const ModelCard = ({ model }) => (
  <div className="boxski">
    <div className="card">
      <img className="img" src={model.image} alt={model.title} />
      <div className="textBox">
        <p className="text head">{model.title}</p>
        <Link to={model.path} className="btn">
          <div className="cube">
            <div className="bg-top">
              <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
              <div className="bg-inner"></div>
            </div>
            <div className="bg">
              <div className="bg-inner"></div>
            </div>
            <div className="text">CHOOSE</div>
          </div>
        </Link>
      </div>
    </div>
  </div>
);

const ContactSection = () => (
  <section id="contact">
    <h1 className="section-header">Contact</h1>
    <div className="contact-wrapper">
      <form className="form-horizontal">
        <input
          type="text"
          className="form-control"
          placeholder="NAME"
          required
        />
        <input
          type="email"
          className="form-control"
          placeholder="EMAIL"
          required
        />
        <textarea
          className="form-control"
          placeholder="MESSAGE"
          required
        ></textarea>
        <button className="btn send-button" type="submit">
          <div className="cube">
            <div className="bg-top">
              <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
              <div className="bg-inner"></div>
            </div>
            <div className="bg">
              <div className="bg-inner"></div>
            </div>
            <div className="text">SEND</div>
          </div>
        </button>
      </form>
    </div>
  </section>
);

export default App;
