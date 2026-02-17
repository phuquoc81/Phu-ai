import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../utils/auth';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Attempt auto-login on component mount
    const autoLoginSuccess = AuthService.autoLogin();
    setIsAuthenticated(autoLoginSuccess);
    setIsLoading(false);

    // If auto-login failed, redirect to login page
    if (!autoLoginSuccess) {
      router.replace('/login');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <h2>Loading Phu AI...</h2>
          <p>Authenticating with Phutokenvercel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>Welcome to Phu AI</h1>
        <p style={styles.description}>
          You are now automatically logged in with Phutokenvercel!
        </p>
        
        <div style={styles.grid}>
          <div style={styles.card}>
            <h2>AI Capabilities</h2>
            <p>Solve complex puzzles and problems of any kind</p>
          </div>

          <div style={styles.card}>
            <h2>Knowledge</h2>
            <p>Access wisdom from various domains</p>
          </div>

          <div style={styles.card}>
            <h2>Analysis</h2>
            <p>Diagnose and understand complex systems</p>
          </div>

          <div style={styles.card}>
            <h2>Predictions</h2>
            <p>Forecast and predict future outcomes</p>
          </div>
        </div>

        <div style={styles.status}>
          <p>✓ Authenticated with Phutokenvercel</p>
          <p>✓ Deployed on Vercel Platform</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    color: '#fff',
  },
  main: {
    padding: '5rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    lineHeight: 1.15,
    fontSize: '4rem',
    textAlign: 'center',
    background: 'linear-gradient(to right, #00f, #0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  description: {
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '1.5rem',
    margin: '2rem 0',
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '800px',
    marginTop: '3rem',
  },
  card: {
    margin: '1rem',
    padding: '1.5rem',
    textAlign: 'left',
    color: 'inherit',
    textDecoration: 'none',
    border: '1px solid #333',
    borderRadius: '10px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    width: '45%',
    backgroundColor: '#111',
  },
  status: {
    marginTop: '3rem',
    padding: '1rem',
    border: '1px solid #0f0',
    borderRadius: '10px',
    backgroundColor: '#001100',
  },
  loadingBox: {
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid #333',
    borderRadius: '10px',
    backgroundColor: '#111',
  },
};
