import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setServerOtp(data.otp);
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // Simple client-side verification
      if (otp === serverOtp) {
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'  // This forces Google to show account selection
      });
      
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // User successfully authenticated
        console.log('Successfully logged in with Google:', result.user.email);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to login with Google. Please try again.');
    }
  };


  return (
    <div className="login-container" style={{ backgroundColor: 'transparent' }}>
      <h3>Welcome to CompoundN</h3>
      {error && <p className="error">{error}</p>}
      
      <button 
        type="button" 
        onClick={handleGoogleLogin} 
        className="google-btn"
        style={{ width: '100%', cursor: 'pointer', marginBottom: '2rem' }}
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" />
        Continue with Google
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      {!isOtpSent ? (
        <form onSubmit={handleSendOtp}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', cursor: 'pointer' }}
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label>Enter OTP sent to {email}:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter OTP"
              maxLength={6}
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', cursor: 'pointer' }}
          >
            Verify OTP
          </button>
          <button 
            type="button" 
            onClick={() => setIsOtpSent(false)}
            className="resend-button"
            style={{ width: '100%', cursor: 'pointer', marginTop: '1rem' }}
          >
            Back to Email
          </button>
        </form>
      )}
    </div>
  );
};

export default Login; 