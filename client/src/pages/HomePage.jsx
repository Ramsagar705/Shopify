import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get('/products', { params: { sortBy: 'createdAt', sortOrder: 'desc' } })
      .then((res) => setProducts(res.data.slice(0, 8)))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            className="bg-white rounded shadow-sm hover:shadow-md transition p-3 flex flex-col"
          >
            <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
              {p.images?.[0] && (
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="font-semibold line-clamp-1">{p.title}</h2>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-indigo-600">₹{p.price}</span>
              <span className="text-xs text-gray-500">
                ⭐ {p.averageRating?.toFixed(1) || '0.0'} ({p.numReviews || 0})
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

