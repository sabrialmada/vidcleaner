import React, { useState } from 'react';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const styles = {
    section: {
      padding: '80px 0',
      backgroundColor: '#fff'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 40px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '40px',
      color: '#333'
    },
    highlight: {
      color: '#44ACE9',
      CanvasGradient
    },
    questionContainer: {
      borderBottom: '1px solid #e5e7eb'
    },
    question: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 0',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontSize: '1rem',
      color: '#111827'
    },
    answer: {
      paddingBottom: '24px',
      color: '#4b5563'
    },
    footer: {
      marginTop: '40px',
      fontSize: '1rem',
      color: '#4b5563'
    },
    contactLink: {
      color: '#44ACE9',
      textDecoration: 'none'
    }
  };

  const faqData = [
    {
      question: "What types of videos can I process with VidCleaner?",
      answer: "All video formats are acceptable in VidCleaner"
    },
    {
      question: "Will this make me go Viral?",
      answer: "Clean data doesn’t make you go viral, your content does. We recommend using videos with a 2k-10k views minimum"
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
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>
          Frequently Asked <span style={styles.highlight}>Questions</span>
        </h2>
        <div>
          {faqData.map((item, index) => (
            <div key={index} style={styles.questionContainer}>
              <button
                style={styles.question}
                onClick={() => toggleQuestion(index)}
              >
                <span>{item.question}</span>
                <svg
                  style={{
                    width: '24px',
                    height: '24px',
                    transform: openQuestion === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease'
                  }}
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
                <div style={styles.answer}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={styles.footer}>
          Still have questions?{' '}
          <a href="https://t.me/vidcleaner" style={styles.contactLink}
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