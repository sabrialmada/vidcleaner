import React from 'react';

const RefundPolicy = () => {
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
        <h1 style={styles.title}>Refund Policy</h1>
        
        <p style={styles.subtitle}>Effective Date: 27 November 2024</p>
        
        <p style={styles.paragraph}>
          We strive to provide the best service possible at VidCleaner. However, we understand 
          that issues may arise. Please review our refund policy below:
        </p>

        <h2 style={styles.heading}>Refund Eligibility:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Refunds are only issued in the case of technical issues on our end that prevent you from using the service.
          </li>
          <li style={styles.listItem}>
            Requests must be made within 7 days of the transaction date.
          </li>
        </ul>

        <h2 style={styles.heading}>Non-Refundable Situations:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Subscriptions that have already been used to clean videos.
          </li>
          <li style={styles.listItem}>
            Situations where the service was used improperly or against our Terms and Conditions.
          </li>
        </ul>

        <h2 style={styles.heading}>Requesting a Refund:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Contact us at info@vidcleaner.com with your account details, proof of payment, and a description of the issue.
          </li>
          <li style={styles.listItem}>
            We will evaluate your request and respond within 5-7 business days.
          </li>
        </ul>

        <h2 style={styles.heading}>Final Decision:</h2>
        <p style={styles.paragraph}>
          Refunds are issued at the sole discretion of VidCleaner.
        </p>
      </div>
    </section>
  );
};

export default RefundPolicy;