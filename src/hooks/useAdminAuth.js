import { useState } from 'react';

const SESSION_KEY = 'ktlh_admin';

function getStored() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAdminAuth() {
  const [auth, setAuth] = useState(getStored);

  const login = ({ githubToken, owner, repo, branch }) => {
    const data = { githubToken, owner, repo, branch };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuth(null);
  };

  return { auth, login, logout, isLoggedIn: !!auth };
}
