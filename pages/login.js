import { useState } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../utils/auth';

export default function Login() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!token.trim()) {
      setError('Please enter a token');
      setIsLoading(false);
      return;
    }

    const success = AuthService.setToken(token);
    
    if (success) {
      router.push('/');
    } else {
      setError('Failed to set token');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>Phu AI Login</h1>
        <p style={styles.subtitle}>Enter your Phutokenvercel to continue</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Phutokenvercel"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.note}>
          <p>
            <strong>Note:</strong> When deployed on Vercel with the PHUTOKENVERCEL environment variable set,
            the application will automatically log you in.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    color: '#fff',
    padding: '1rem',
  },
  loginBox: {
    maxWidth: '500px',
    width: '100%',
    padding: '2rem',
    border: '1px solid #333',
    borderRadius: '10px',
    backgroundColor: '#111',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '0.5rem',
    background: 'linear-gradient(to right, #00f, #0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#999',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#222',
    color: '#fff',
  },
  button: {
    padding: '1rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#00f',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    color: '#f00',
    textAlign: 'center',
    margin: 0,
  },
  note: {
    marginTop: '2rem',
    padding: '1rem',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#0a0a0a',
    fontSize: '0.9rem',
    color: '#999',
  },
};
