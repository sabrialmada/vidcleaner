import React from 'react';
import { Link } from 'react-router-dom';
import VidCleanerLogo from '../assets/VidCleaner.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="brand">
                        <img
                            src={VidCleanerLogo}
                            alt="VidCleaner"
                            className="logo"
                        />
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="section-title">Platforms</h3>
                    <a
                        href="https://www.instagram.com/vidcleaner?igsh=ZHQ0bDVhZTVuNTBu"
                        className="footer-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://t.me/vidcleaner"
                        className="footer-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Telegram
                    </a>
                </div>

                <div className="footer-section">
                    <h3 className="section-title">Terms & Conditions</h3>
                    <Link to="/terms-and-conditions" className="footer-link">
                        Terms and Conditions Policy
                    </Link>
                    <Link to="/privacy-policy" className="footer-link">
                        Privacy Policy
                    </Link>
                    <Link to="/refund-policy" className="footer-link">
                        Refund Policy
                    </Link>
                    <Link to="/subscription-policy" className="footer-link">
                        Subscription and Cancellation Policy
                    </Link>
                    <Link to="/dmca-policy" className="footer-link">
                        DMCA and Copyright Policy
                    </Link>
                </div>
            </div>

            <div className="copyright">
                © 2024 VidCleaner
            </div>
        </footer>
    );
};

export default Footer;