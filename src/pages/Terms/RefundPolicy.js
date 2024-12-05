import React from 'react';
import './Policies.css';

const RefundPolicy = () => {
    return (
        <section className="policy-section">
            <div className="policy-content">
                <h1 className="policy-title">Refund Policy</h1>

                <p className="policy-subtitle">Effective Date: 27 November 2024</p>

                <p className="policy-paragraph">
                    We strive to provide the best service possible at VidCleaner. However, we understand
                    that issues may arise. Please review our refund policy below:
                </p>

                <h2 className="policy-heading">Refund Eligibility:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        Refunds are only issued in the case of technical issues on our end that prevent you from using the service.
                    </li>
                    <li className="policy-list-item">
                        Requests must be made within 7 days of the transaction date.
                    </li>
                </ul>

                <h2 className="policy-heading">Non-Refundable Situations:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        Subscriptions that have already been used to clean videos.
                    </li>
                    <li className="policy-list-item">
                        Situations where the service was used improperly or against our Terms and Conditions.
                    </li>
                </ul>

                <h2 className="policy-heading">Requesting a Refund:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        Contact us at <a href="mailto:info@vidcleaner.com" className="policy-email">info@vidcleaner.com</a> with your account details, proof of payment, and a description of the issue.
                    </li>
                    <li className="policy-list-item">
                        We will evaluate your request and respond within 5-7 business days.
                    </li>
                </ul>

                <h2 className="policy-heading">Final Decision:</h2>
                <p className="policy-paragraph">
                    Refunds are issued at the sole discretion of VidCleaner.
                </p>
            </div>
        </section>
    );
};

export default RefundPolicy;