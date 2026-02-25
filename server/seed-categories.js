const axios = require('axios');
const API = 'http://localhost:5000/api';

(async () => {
  try {
    console.log('🔐 Logging in...');
    const login = await axios.post(`${API}/auth/login`, {
      email: 'admin@example.com',
      password: 'Admin@12345'
    });
    const token = login.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    const categories = ['Electronics', 'Clothing', 'Books', 'Sports', 'Home & Garden'];
    
    console.log('Creating categories...\n');
    for (const name of categories) {
      try {
        const res = await axios.post(`${API}/categories`, { name }, { headers });
        console.log(`✅ Created: ${res.data.name}`);
      } catch (e) {
        if (e.response?.status === 400) console.log(`⚠️  ${name} already exists`);
      }
    }
    
    const all = await axios.get(`${API}/categories`);
    console.log(`\n📊 Total: ${all.data.length} categories available`);
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
