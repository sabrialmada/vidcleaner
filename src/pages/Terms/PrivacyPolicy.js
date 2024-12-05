import React from 'react';
import './Policies.css';

const PrivacyPolicy = () => {
  return (
    <section className="policy-section">
      <div className="policy-content">
        <h1 className="policy-title">Privacy Policy</h1>

        <p className="policy-subtitle">Effective Date: 27 November 2024</p>

        <p className="policy-paragraph">
          At VidCleaner, we respect your privacy and are committed to protecting your personal information.
          This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.
          By using VidCleaner, you agree to the practices described in this policy.
        </p>

        <h2 className="policy-heading">1. Information We Collect</h2>
        <p className="policy-paragraph">
          We may collect the following types of information when you use our services:
        </p>

        <h3 className="policy-subheading">a. Personal Information:</h3>
        <ul className="policy-list">
          <li className="policy-list-item">Name, email address, and payment information when you create an account or make a purchase.</li>
        </ul>

        <h3 className="policy-subheading">b. Usage Data:</h3>
        <ul className="policy-list">
          <li className="policy-list-item">Information about how you interact with our website, including IP address, browser type, operating system, and pages visited.</li>
        </ul>

        <h3 className="policy-subheading">c. Uploaded Content:</h3>
        <ul className="policy-list">
          <li className="policy-list-item">Videos or files you upload for processing. We do not retain or share this content unless necessary for technical purposes or as required by law.</li>
        </ul>

        <h2 className="policy-heading">2. How We Use Your Information</h2>
        <p className="policy-paragraph">We use the information we collect for the following purposes:</p>
        <ul className="policy-list">
          <li className="policy-list-item">To provide, operate, and maintain our services.</li>
          <li className="policy-list-item">To process payments and manage your subscription.</li>
          <li className="policy-list-item">To communicate with you, including sending updates, support information, or marketing messages (if you've opted in).</li>
          <li className="policy-list-item">To improve and personalize our website and services.</li>
          <li className="policy-list-item">To detect, prevent, and address technical issues or security breaches.</li>
        </ul>

        <h2 className="policy-heading">3. Sharing Your Information</h2>
        <p className="policy-paragraph">
          We do not sell, rent, or trade your personal information. However, we may share your information in the following cases:
        </p>
        <ul className="policy-list">
          <li className="policy-list-item">With Service Providers: Third-party providers who assist with payment processing, hosting, or analytics, solely to perform services on our behalf.</li>
          <li className="policy-list-item">As Required by Law: If we are legally obligated to disclose your information.</li>
          <li className="policy-list-item">Business Transfers: In the event of a merger, sale, or acquisition of VidCleaner, your information may be transferred to the new entity.</li>
        </ul>

        <h2 className="policy-heading">4. Data Retention</h2>
        <p className="policy-paragraph">
          We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or comply with legal obligations.
        </p>

        <h2 className="policy-heading">5. Security Measures</h2>
        <p className="policy-paragraph">
          We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="policy-heading">6. Cookies and Tracking Technologies</h2>
        <p className="policy-paragraph">
          We use cookies and similar technologies to enhance your experience on our website. These tools help us analyze website traffic, personalize content, and improve functionality.
        </p>
        <p className="policy-paragraph">
          You can manage or disable cookies in your browser settings, but this may affect your use of certain features.
        </p>

        <h2 className="policy-heading">7. Your Rights</h2>
        <p className="policy-paragraph">
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul className="policy-list">
          <li className="policy-list-item">Access to the information we hold about you.</li>
          <li className="policy-list-item">Request corrections or updates to your information.</li>
          <li className="policy-list-item">Request deletion of your personal data.</li>
          <li className="policy-list-item">Withdraw consent for certain data processing activities.</li>
        </ul>
        <p className="policy-paragraph">
          To exercise these rights, please contact us at info@vidcleaner.com.
        </p>

        <h2 className="policy-heading">8. Third-Party Links</h2>
        <p className="policy-paragraph">
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
        </p>

        <h2 className="policy-heading">9. Children's Privacy</h2>
        <p className="policy-paragraph">
          VidCleaner is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.
        </p>

        <h2 className="policy-heading">10. Changes to This Policy</h2>
        <p className="policy-paragraph">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. We encourage you to review this policy periodically.
        </p>

        <h2 className="policy-heading">11. Contact Us</h2>
        <p className="policy-paragraph">
          If you have any questions about this Privacy Policy or how we handle your information, please contact us at:
        </p>
        <p className="policy-paragraph">
          Email: <a href="mailto:info@vidcleaner.com" className="policy-email">info@vidcleaner.com</a><br />
          Address: 530-B Harkle Road, New Mexico 87505
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;