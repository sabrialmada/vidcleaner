import React from 'react';
import './Policies.css';

const TermsAndConditions = () => {
    return (
        <section className="policy-section">
            <div className="policy-content">
                <h1 className="policy-title">Terms and Conditions</h1>

                <p className="policy-paragraph">
                    Welcome to VidCleaner. By accessing or using our services, you agree to the following terms and conditions.
                    Please read them carefully before using our platform.
                </p>

                <h2 className="policy-heading">1. General Use</h2>
                <p className="policy-paragraph">
                    VidCleaner provides tools for cleaning and managing video metadata. By using our service,
                    you acknowledge that you understand and agree to these terms.
                </p>

                <h2 className="policy-heading">2. No Guarantee of Results</h2>
                <p className="policy-paragraph">
                    While we strive to provide reliable and effective tools, VidCleaner does not guarantee any specific
                    outcomes or results from using our services. Success and performance may vary depending on individual
                    circumstances, and we do not promise that our services will meet your expectations or result in business success.
                </p>

                <h2 className="policy-heading">3. Limitation of Liability</h2>
                <p className="policy-paragraph">
                    VidCleaner and its affiliates, partners, or employees shall not be held liable for:
                </p>
                <ul className="policy-list">
                    <li className="policy-list-item">Any direct, indirect, incidental, special, or consequential damages arising from your use of our service.</li>
                    <li className="policy-list-item">Any loss of data, profits, business opportunities, or reputation due to the use or inability to use VidCleaner.</li>
                    <li className="policy-list-item">Any damages resulting from third-party actions, system failures, or unforeseen events.</li>
                </ul>
                <p className="policy-paragraph">You use our service entirely at your own risk.</p>

                <h2 className="policy-heading">4. Responsibility of Use</h2>
                <p className="policy-paragraph">
                    VidCleaner is a tool designed for lawful and ethical use. You are solely responsible for ensuring
                    that your use of VidCleaner complies with all applicable laws, regulations, and platform policies.
                    We are not responsible for any consequences arising from misuse of the service.
                </p>

                <h2 className="policy-heading">5. Subscription Terms</h2>
                <p className="policy-paragraph">
                    Your subscription grants you access to VidCleaner's services for the duration of the subscription period.
                    We reserve the right to modify pricing, features, or service availability at any time. No refunds will be
                    issued unless explicitly stated otherwise.
                </p>

                <h2 className="policy-heading">6. No Warranties</h2>
                <p className="policy-paragraph">
                    VidCleaner is provided on an "as-is" and "as-available" basis. We do not warrant that:
                </p>
                <ul className="policy-list">
                    <li className="policy-list-item">The service will be uninterrupted, secure, or error-free.</li>
                    <li className="policy-list-item">Any errors or defects will be corrected.</li>
                    <li className="policy-list-item">The service will meet your specific needs or expectations.</li>
                </ul>

                <h2 className="policy-heading">7. Intellectual Property</h2>
                <p className="policy-paragraph">
                    All content, tools, and technology provided by VidCleaner are the property of VidCleaner. You are
                    prohibited from copying, modifying, or distributing any part of the service without prior written consent.
                </p>

                <h2 className="policy-heading">8. Changes to the Terms</h2>
                <p className="policy-paragraph">
                    We reserve the right to update or modify these terms at any time without prior notice. By continuing
                    to use our service, you agree to the updated terms.
                </p>

                <h2 className="policy-heading">9. Governing Law</h2>
                <p className="policy-paragraph">
                    These terms are governed by the laws of New Mexico, the United States. Any disputes arising from your
                    use of the service will be resolved in the courts of New Mexico, the United States.
                </p>
            </div>
        </section>
    );
};

export default TermsAndConditions;