import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p>Your cart is empty.</p>
        <Link to="/products" className="text-indigo-600">
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between bg-white rounded shadow-sm p-3"
          >
            <div>
              <div className="font-semibold">{item.product.title}</div>
              <div className="text-sm text-gray-600">₹{item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateCartItem(item.product._id, Number(e.target.value || 1))}
                className="w-16 border rounded px-1 py-0.5"
              />
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Total: ₹{cart.totalAmount}</div>
        <button
          onClick={() => navigate('/checkout')}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;

