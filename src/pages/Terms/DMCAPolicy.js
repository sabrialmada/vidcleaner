import React from 'react';
import './Policies.css';

const DMCAPolicy = () => {
    return (
        <section className="policy-section">
            <div className="policy-content">
                <h1 className="policy-title">DMCA and Copyright Policy</h1>

                <p className="policy-subtitle">Effective Date: 27 November 2027</p>

                <p className="policy-paragraph">
                    VidCleaner respects the intellectual property rights of others and expects its users to do the same.
                    If you believe your copyrighted material has been infringed upon, please follow the process below:
                </p>

                <h2 className="policy-heading">Filing a DMCA Notice:</h2>
                <p className="policy-paragraph">
                    If you are the copyright owner or an authorized agent, submit a written notice with the following information:
                </p>
                <ul className="policy-list">
                    <li className="policy-list-item">
                        Your contact information, including your name, email address, and phone number.
                    </li>
                    <li className="policy-list-item">
                        A detailed description of the copyrighted work you believe has been infringed.
                    </li>
                    <li className="policy-list-item">
                        The specific location (URL or other identifying information) of the infringing material.
                    </li>
                    <li className="policy-list-item">
                        A statement that you believe in good faith that the use is unauthorized.
                    </li>
                    <li className="policy-list-item">
                        A statement, under penalty of perjury, that the information in your notice is accurate and that
                        you are authorized to act on behalf of the copyright owner.
                    </li>
                </ul>
                <p className="policy-paragraph">
                    Send your notice to: <a href="mailto:info@vidcleaner.com" className="policy-email">info@vidcleaner.com</a>
                </p>

                {/* Rest of the component remains the same, just update className instead of style prop */}
            </div>
        </section>
    );
};

export default DMCAPolicy;