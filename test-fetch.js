fetch('https://school-0b66.onrender.com/api/auth/me')
  .then(res => console.log('STATUS:', res.status))
  .catch(console.error);
