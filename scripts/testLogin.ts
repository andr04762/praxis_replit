import fetch from 'node-fetch';
(async () => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      email: 'andr0476@outlook.com',
      password: 'Ra52w102$',
    }),
  });
  console.log('[TEST] Status:', res.status, 'Body:', await res.text());
})();
