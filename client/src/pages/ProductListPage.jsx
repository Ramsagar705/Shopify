import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const fetchProducts = () => {
    api
      .get('/products', {
        params: {
          keyword: keyword || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy,
          sortOrder: sortBy === 'price' ? 'asc' : 'desc'
        }
      })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="block text-sm">Search</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Min Price</label>
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Max Price</label>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <button
          onClick={fetchProducts}
          className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>
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

export default ProductListPage;

