

import React from 'react';
import VidCleanerLogo from '../assets/VidCleaner.png';  

const Footer = () => {
  const styles = {
    footer: {
      padding: '40px 0',
      backgroundColor: '#fff',
      borderTop: '1px solid #e5e7eb'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logo: {
      width: '200px',
      height: 'auto'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#000'
    },
    link: {
      color: '#666',
      textDecoration: 'none',
      fontSize: '1rem'
    },
    copyright: {
      maxWidth: '1200px',
      margin: '40px auto 0',
      padding: '20px 40px 0',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center',
      color: '#666'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <div style={styles.brand}>
            <img 
              src={VidCleanerLogo} // You'll need to put the correct path to your logo file
              alt="VidCleaner"
              style={styles.logo}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Follow US</h3>
          <a href="https://www.instagram.com/vidcleaner?igsh=ZHQ0bDVhZTVuNTBu" style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >Instagram</a>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Platforms</h3>
          <a href="https://t.me/vidcleaner" style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >Telegram</a>
        </div>
      </div>

      <div style={styles.copyright}>
        © 2024 VidCleaner
      </div>
    </footer>
  );
};

export default Footer;