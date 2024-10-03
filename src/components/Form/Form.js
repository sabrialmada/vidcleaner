// Form.js FOR LOGIN AND REGISTER
/* import React from 'react';
import './Form.css';

const Form = ({ type, buttonText, title, onSubmit }) => {
  return (
    <div className="form-card">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required />
        </div>
        {type === 'register' && (
          <div className="form-group">
            <label>Repeat Password</label>
            <input type="password" required />
          </div>
        )}
        <button type="submit" className="submit-btn">{buttonText}</button>
      </form>
    </div>
  );
};

export default Form;
 */

/* import React from 'react';
import './Form.css';

const Form = ({ type, buttonText, title, onSubmit, setEmail, setPassword }) => {
  return (
    <div className="form-card">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            required 
            onChange={(e) => setEmail(e.target.value)} // Update the email state
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            onChange={(e) => setPassword(e.target.value)} // Update the password state
          />
        </div>
        {type === 'register' && (
          <div className="form-group">
            <label>Repeat Password</label>
            <input type="password" required />
          </div>
        )}
        <button type="submit" className="submit-btn">{buttonText}</button>
      </form>
    </div>
  );
};

export default Form;
 */

import React from 'react';
import './Form.css';

const Form = ({ type, buttonText, title, onSubmit, setEmail, setPassword, setRepeatPassword }) => {
  return (
    <div className="form-card">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            required 
            onChange={(e) => setEmail(e.target.value)} // Update the email state
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            onChange={(e) => setPassword(e.target.value)} // Update the password state
          />
        </div>
        {type === 'register' && (
          <div className="form-group">
            <label>Repeat Password</label>
            <input 
              type="password" 
              required 
              onChange={(e) => setRepeatPassword(e.target.value)} // Update the repeatPassword state
            />
          </div>
        )}
        <button type="submit" className="submit-btn">{buttonText}</button>
      </form>
    </div>
  );
};

export default Form;
