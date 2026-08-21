const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:4000';

// Login bruger — returnerer token og bruger info
export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) throw new Error('Forkert brugernavn eller password');
  return res.json();
}

// Opret ny bruger
export async function signup(firstname, lastname, email, password) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      firstname,
      lastname,
      email,
      password,
      refreshToken: '',
      isActive: 'true',
      image: 'http://placeimg.com/640/480',
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Kunne ikke oprette bruger');
  }
  return res.json();
}

// Tjek om token er gyldig
export async function verify(accessToken) {
  const res = await fetch(`${API_URL}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.ok;
}

// Hent token fra localStorage til API requests
export function getAuthHeader() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
