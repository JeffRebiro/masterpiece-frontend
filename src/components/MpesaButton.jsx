import React, { useContext, useState } from 'react';
import { AuthContext } from '../components/AuthContext';

const MpesaButton = () => {
  const { token } = useContext(AuthContext);
  const [status, setStatus] = useState('');

  const handleMpesa = async () => {
    try {
      const response = await fetch('/api/payment/mpesa/initiate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '254797675754', // or dynamically get phone number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate M-Pesa payment.');
      }

      const data = await response.json();
      console.log('M-Pesa response:', data);
      setStatus('M-Pesa push sent!');
    } catch (err) {
      console.error(err.message);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleMpesa}>Pay with M-Pesa</button>
      <p>{status}</p>
    </div>
  );
};

export default MpesaButton;
