import { useState } from 'react';
import './App.css';

function App() {
  const [authenticationResult, setAuthenticationResult] = useState('');

  // Simulated fingerprint authentication function
  const simulateFingerprintAuthentication = async () => {
    try {
      // Simulate waiting for the fingerprint sensor to respond
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate a successful authentication (change to 'false' to simulate failure)
      return true;
    } catch (error) {
      console.error('Fingerprint authentication error:', error);
      return false;
    }
  };

  const handleFingerprintAuthentication = async () => {
    try {
      setAuthenticationResult('Authenticating...');

      // Simulate fingerprint authentication process
      const isAuthenticated = await simulateFingerprintAuthentication();

      if (isAuthenticated) {
        setAuthenticationResult('Authentication successful!');
      } else {
        setAuthenticationResult('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthenticationResult('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Fingerprint Authentication</h1>
      <p>Click the button below to authenticate using your fingerprint:</p>
      <button onClick={handleFingerprintAuthentication}>Authenticate with Fingerprint</button>
      <p id="resultMessage">{authenticationResult}</p>
    </div>
  );
}

export default App;
