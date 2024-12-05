import React from 'react';
import './Policies.css';

const SubscriptionPolicy = () => {
    return (
        <section className="policy-section">
            <div className="policy-content">
                <h1 className="policy-title">Subscription and Cancellation Policy</h1>

                <p className="policy-subtitle">Effective Date: 27 November 2024</p>

                <h2 className="policy-heading">Subscriptions:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        VidCleaner offers a subscription plan that provides unlimited video cleaning during the subscription period.
                    </li>
                    <li className="policy-list-item">
                        Subscriptions are billed on a recurring basis (monthly or annually, as selected at checkout).
                    </li>
                </ul>

                <h2 className="policy-heading">Automatic Renewal:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        Subscriptions automatically renew at the end of each billing cycle unless canceled.
                    </li>
                    <li className="policy-list-item">
                        You will be charged using the payment method on file.
                    </li>
                </ul>

                <h2 className="policy-heading">Cancellation Policy:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        You can cancel your subscription at any time through your account settings.
                    </li>
                    <li className="policy-list-item">
                        Cancellation will prevent future charges but does not result in a refund for the current billing cycle.
                    </li>
                </ul>

                <h2 className="policy-heading">Refunds for Subscriptions:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        No refunds are issued for partial billing periods or unused time.
                    </li>
                </ul>

                <h2 className="policy-heading">Trial Periods (if applicable):</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        If a trial period is offered, cancellation must occur before the trial ends to avoid charges.
                    </li>
                </ul>

                <h2 className="policy-heading">Billing Issues:</h2>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        If you experience billing errors, contact <a href="mailto:info@vidcleaner.com" className="policy-email">info@vidcleaner.com</a> for resolution.
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default SubscriptionPolicy;