import React from 'react';

const SubscriptionPolicy = () => {
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
        <h1 style={styles.title}>Subscription and Cancellation Policy</h1>
        
        <p style={styles.subtitle}>Effective Date: 27 November 2024</p>

        <h2 style={styles.heading}>Subscriptions:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            VidCleaner offers a subscription plan that provides unlimited video cleaning during the subscription period.
          </li>
          <li style={styles.listItem}>
            Subscriptions are billed on a recurring basis (monthly or annually, as selected at checkout).
          </li>
        </ul>

        <h2 style={styles.heading}>Automatic Renewal:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Subscriptions automatically renew at the end of each billing cycle unless canceled.
          </li>
          <li style={styles.listItem}>
            You will be charged using the payment method on file.
          </li>
        </ul>

        <h2 style={styles.heading}>Cancellation Policy:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            You can cancel your subscription at any time through your account settings.
          </li>
          <li style={styles.listItem}>
            Cancellation will prevent future charges but does not result in a refund for the current billing cycle.
          </li>
        </ul>

        <h2 style={styles.heading}>Refunds for Subscriptions:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            No refunds are issued for partial billing periods or unused time.
          </li>
        </ul>

        <h2 style={styles.heading}>Trial Periods (if applicable):</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            If a trial period is offered, cancellation must occur before the trial ends to avoid charges.
          </li>
        </ul>

        <h2 style={styles.heading}>Billing Issues:</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            If you experience billing errors, contact info@vidcleaner.com for resolution.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SubscriptionPolicy;