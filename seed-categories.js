const axios = require('axios');

const API = 'http://localhost:5000/api';

async function seedCategories() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API}/auth/login`, {
      email: 'admin@example.com',
      password: 'Admin@12345'
    });
    const token = loginRes.data.token;
    console.log('✅ Logged in');

    const categories = ['Electronics', 'Clothing', 'Books', 'Sports', 'Home & Garden'];
    const headers = { Authorization: `Bearer ${token}` };

    for (const name of categories) {
      try {
        const res = await axios.post(`${API}/categories`, { name }, { headers });
        console.log(`✅ Created category: ${res.data.name}`);
      } catch (err) {
        if (err.response?.status === 400) {
          console.log(`⚠️  Category "${name}" already exists`);
        } else {
          throw err;
        }
      }
    }

    const allCats = await axios.get(`${API}/categories`);
    console.log(`\n📊 Total categories: ${allCats.data.length}`);
    allCats.data.forEach((c) => console.log(`   - ${c.name}`));
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

seedCategories();
