import React from 'react';

const PrivacyPolicy = () => {
    const styles = {
      section: {
        maxWidth: '1200px',
        margin: '20px auto 20px',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 200px)',
        backgroundColor: '#fff'
      },
      content: {
        color: '#333',
        lineHeight: '1.6'
      },
      title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#000'
      },
      subtitle: {
        fontSize: '1.2rem',
        marginBottom: '30px',
        color: '#666'
      },
      heading: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginTop: '30px',
        marginBottom: '15px',
        color: '#000'
      },
      subheading: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginTop: '20px',
        marginBottom: '10px',
        color: '#333'
      },
      paragraph: {
        marginBottom: '20px'
      },
      list: {
        marginLeft: '20px',
        marginBottom: '20px'
      },
      listItem: {
        marginBottom: '10px'
      }
    };

  return (
    <section style={styles.section}>
      <div style={styles.content}>
        <h1 style={styles.title}>Privacy Policy</h1>
        
        <p style={styles.subtitle}>Effective Date: 27 November 2024</p>
        
        <p style={styles.paragraph}>
          At VidCleaner, we respect your privacy and are committed to protecting your personal information. 
          This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services. 
          By using VidCleaner, you agree to the practices described in this policy.
        </p>

        <h2 style={styles.heading}>1. Information We Collect</h2>
        <p style={styles.paragraph}>
          We may collect the following types of information when you use our services:
        </p>
        
        <h3 style={styles.subheading}>a. Personal Information:</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Name, email address, and payment information when you create an account or make a purchase.</li>
        </ul>

        <h3 style={styles.subheading}>b. Usage Data:</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Information about how you interact with our website, including IP address, browser type, operating system, and pages visited.</li>
        </ul>

        <h3 style={styles.subheading}>c. Uploaded Content:</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Videos or files you upload for processing. We do not retain or share this content unless necessary for technical purposes or as required by law.</li>
        </ul>

        <h2 style={styles.heading}>2. How We Use Your Information</h2>
        <p style={styles.paragraph}>We use the information we collect for the following purposes:</p>
        <ul style={styles.list}>
          <li style={styles.listItem}>To provide, operate, and maintain our services.</li>
          <li style={styles.listItem}>To process payments and manage your subscription.</li>
          <li style={styles.listItem}>To communicate with you, including sending updates, support information, or marketing messages (if you've opted in).</li>
          <li style={styles.listItem}>To improve and personalize our website and services.</li>
          <li style={styles.listItem}>To detect, prevent, and address technical issues or security breaches.</li>
        </ul>

        <h2 style={styles.heading}>3. Sharing Your Information</h2>
        <p style={styles.paragraph}>
          We do not sell, rent, or trade your personal information. However, we may share your information in the following cases:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>With Service Providers: Third-party providers who assist with payment processing, hosting, or analytics, solely to perform services on our behalf.</li>
          <li style={styles.listItem}>As Required by Law: If we are legally obligated to disclose your information.</li>
          <li style={styles.listItem}>Business Transfers: In the event of a merger, sale, or acquisition of VidCleaner, your information may be transferred to the new entity.</li>
        </ul>

        <h2 style={styles.heading}>4. Data Retention</h2>
        <p style={styles.paragraph}>
          We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or comply with legal obligations.
        </p>

        <h2 style={styles.heading}>5. Security Measures</h2>
        <p style={styles.paragraph}>
          We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 style={styles.heading}>6. Cookies and Tracking Technologies</h2>
        <p style={styles.paragraph}>
          We use cookies and similar technologies to enhance your experience on our website. These tools help us analyze website traffic, personalize content, and improve functionality.
        </p>
        <p style={styles.paragraph}>
          You can manage or disable cookies in your browser settings, but this may affect your use of certain features.
        </p>

        <h2 style={styles.heading}>7. Your Rights</h2>
        <p style={styles.paragraph}>
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>Access to the information we hold about you.</li>
          <li style={styles.listItem}>Request corrections or updates to your information.</li>
          <li style={styles.listItem}>Request deletion of your personal data.</li>
          <li style={styles.listItem}>Withdraw consent for certain data processing activities.</li>
        </ul>
        <p style={styles.paragraph}>
          To exercise these rights, please contact us at [Insert Contact Email].
        </p>

        <h2 style={styles.heading}>8. Third-Party Links</h2>
        <p style={styles.paragraph}>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
        </p>

        <h2 style={styles.heading}>9. Children's Privacy</h2>
        <p style={styles.paragraph}>
          VidCleaner is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.
        </p>

        <h2 style={styles.heading}>10. Changes to This Policy</h2>
        <p style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. We encourage you to review this policy periodically.
        </p>

        <h2 style={styles.heading}>11. Contact Us</h2>
        <p style={styles.paragraph}>
          If you have any questions about this Privacy Policy or how we handle your information, please contact us at:
        </p>
        <p style={styles.paragraph}>
          Email: info@vidcleaner.com<br />
          Address: 530-B Harkle Road, New Mexico 87505
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;