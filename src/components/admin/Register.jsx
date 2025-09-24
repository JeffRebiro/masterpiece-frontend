import { useState } from 'react';
import { register } from './api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password1, password2 });
      alert('Registered successfully');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password1} onChange={e => setPassword1(e.target.value)} />
      <input placeholder="Confirm Password" type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
