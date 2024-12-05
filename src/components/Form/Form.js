
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {type === 'register' && (
          <div className="form-group">
            <label>Repeat Password</label>
            <input
              type="password"
              required
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
        )}
        <button type="submit" className="submit-btn">{buttonText}</button>
      </form>
    </div>
  );
};

export default Form;
