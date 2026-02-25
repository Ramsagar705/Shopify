import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    await api.post(`/products/${id}/reviews`, { rating, comment });
    alert('Review submitted');
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
      <div>
        <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-2">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <div className="text-lg font-semibold text-indigo-600 mb-2">₹{product.price}</div>
        <div className="text-sm text-gray-600 mb-2">
          ⭐ {product.averageRating?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)
        </div>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <button
          onClick={() => addToCart(product._id, 1)}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Add to Cart
        </button>

        {user && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Leave a review</h2>
            <form onSubmit={submitReview} className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-black"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

