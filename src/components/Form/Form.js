import React from 'react';
import './Form.css';

const Form = ({
  type,
  buttonText,
  title,
  onSubmit,
  setEmail,
  setPassword,
  setRepeatPassword,
  disabled = false
}) => {
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
            disabled={disabled}
            placeholder="Enter your email"
            className={disabled ? 'input-disabled' : ''}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={disabled}
            placeholder="Enter your password"
            className={disabled ? 'input-disabled' : ''}
          />
        </div>
        {type === 'register' && (
          <div className="form-group">
            <label>Repeat Password</label>
            <input
              type="password"
              required
              onChange={(e) => setRepeatPassword(e.target.value)}
              disabled={disabled}
              placeholder="Repeat your password"
              className={disabled ? 'input-disabled' : ''}
            />
          </div>
        )}
        <button
          type="submit"
          className={`submit-btn ${disabled ? 'btn-disabled' : ''}`}
          disabled={disabled}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default Form;