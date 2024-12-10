import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
    const [openQuestion, setOpenQuestion] = useState(null);

    const faqData = [
        {
            question: "What types of videos can I process with VidCleaner?",
            answer: "All video formats are acceptable in VidCleaner"
        },
        {
            question: "Will this make me go Viral?",
            answer: "Clean data doesn't make you go viral, your content does. We recommend using videos with a 2k-10k views minimum"
        },
        {
            question: "Does it work on Tiktok?",
            answer: "The videos are downloaded to your local hardrive so you can reuse your content on any platform after you clean it"
        },
        {
            question: "Does this get you shadowbanned?",
            answer: "No. We have yet to be shadow banned on any platform for resuing data. However if your content is prohibited that will get you shadowbanned. We recommend multiple social accounts"
        },
        {
            question: "Is it only take 30 second clips?",
            answer: "No you can use any length videos you want"
        }
    ];

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2 className="faq-title">
                    Frequently Asked <span className="faq-highlight">Questions</span>
                </h2>
                <div>
                    {faqData.map((item, index) => (
                        <div key={index} className="faq-question-container">
                            <button
                                className="faq-question"
                                onClick={() => toggleQuestion(index)}
                            >
                                <span>{item.question}</span>
                                <svg
                                    className={`faq-icon ${openQuestion === index ? 'faq-icon-rotated' : ''}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M7 10L12 15L17 10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                </svg>
                            </button>
                            {openQuestion === index && (
                                <div className="faq-answer">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="faq-footer">
                    Still have questions?{' '}
                    <a
                        href="https://t.me/vidcleaner"
                        className="faq-contact-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Contact us
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;