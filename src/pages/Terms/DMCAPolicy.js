import React from 'react';

const DMCAPolicy = () => {
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
      },
      email: {
        color: '#44ACE9',
        textDecoration: 'none'
      }
    };

  return (
    <section style={styles.section}>
      <div style={styles.content}>
        <h1 style={styles.title}>DMCA and Copyright Policy</h1>
        
        <p style={styles.subtitle}>Effective Date: 27 November 2027</p>

        <p style={styles.paragraph}>
          VidCleaner respects the intellectual property rights of others and expects its users to do the same. 
          If you believe your copyrighted material has been infringed upon, please follow the process below:
        </p>

        <h2 style={styles.heading}>Filing a DMCA Notice:</h2>
        <p style={styles.paragraph}>
          If you are the copyright owner or an authorized agent, submit a written notice with the following information:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Your contact information, including your name, email address, and phone number.
          </li>
          <li style={styles.listItem}>
            A detailed description of the copyrighted work you believe has been infringed.
          </li>
          <li style={styles.listItem}>
            The specific location (URL or other identifying information) of the infringing material.
          </li>
          <li style={styles.listItem}>
            A statement that you believe in good faith that the use is unauthorized.
          </li>
          <li style={styles.listItem}>
            A statement, under penalty of perjury, that the information in your notice is accurate and that 
            you are authorized to act on behalf of the copyright owner.
          </li>
        </ul>
        <p style={styles.paragraph}>
          Send your notice to: <a href="mailto:info@vidcleaner.com" style={styles.email}>info@vidcleaner.com</a>
        </p>

        <h2 style={styles.heading}>Counter-Notice:</h2>
        <p style={styles.paragraph}>
          If you believe material you uploaded was removed in error, you may file a counter-notice with the following:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Your contact information, including your name, email address, and phone number.
          </li>
          <li style={styles.listItem}>
            Identification of the material that was removed and its location prior to removal.
          </li>
          <li style={styles.listItem}>
            A statement, under penalty of perjury, that you believe the removal was a mistake or misidentification.
          </li>
          <li style={styles.listItem}>
            A statement consenting to the jurisdiction of your local federal court if the dispute escalates.
          </li>
        </ul>
        <p style={styles.paragraph}>
          Send your counter-notice to: <a href="mailto:info@vidcleaner.com" style={styles.email}>info@vidcleaner.com</a>
        </p>

        <h2 style={styles.heading}>Repeat Infringers:</h2>
        <p style={styles.paragraph}>
          Accounts of users who repeatedly violate copyright laws may be terminated at our discretion.
        </p>

        <h2 style={styles.heading}>No Liability:</h2>
        <p style={styles.paragraph}>
          VidCleaner assumes no responsibility for user-uploaded content and acts solely as a service provider.
        </p>
      </div>
    </section>
  );
};

export default DMCAPolicy;