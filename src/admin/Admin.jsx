import { useState } from 'react';
import Login from './AdLogin';
import Register from './Register';
import CRUDTable from './CRUDTable';

export default function Admin() {
  const [token, setToken] = useState(null);

  if (!token) {
    return (
      <div>
        <Login setToken={setToken} />
        <Register />
      </div>
    );
  }

  return <CRUDTable token={token} />;
}
