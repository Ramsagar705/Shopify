import { useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const SHIPPING_FIELDS = ['address', 'city', 'state', 'postalCode', 'country'];

const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p>No items in cart.</p>
      </div>
    );
  }

  const validateShipping = () => {
    const missing = SHIPPING_FIELDS.filter((field) => !shipping[field]?.trim());
    if (missing.length > 0) {
      alert('Please fill in all shipping fields.');
      return false;
    }
    return true;
  };

  const placeCodOrder = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      await api.post('/orders', {
        paymentProvider: 'COD',
        shippingInfo: shipping
      });
      await refreshCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const payWithRazorpay = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      const orderRes = await api.post('/payments/razorpay/order');
      const { orderId, amount, keyId } = orderRes.data;

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: keyId,
          amount,
          currency: 'INR',
          name: 'Shopify Store',
          description: 'Order payment',
          order_id: orderId,
          handler: async function (response) {
            const verifyRes = await api.post('/payments/razorpay/verify', response);
            const paymentInfo = verifyRes.data.paymentInfo;
            await api.post('/orders', {
              paymentProvider: 'Razorpay',
              paymentInfo,
              shippingInfo: shipping
            });
            await refreshCart();
            navigate('/orders');
          },
          theme: { color: '#4f46e5' }
        };
        // eslint-disable-next-line no-undef
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'cod') {
      placeCodOrder();
    } else {
      payWithRazorpay();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Shipping Info</h1>
        <div className="space-y-3">
          {SHIPPING_FIELDS.map((field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input
                value={shipping[field]}
                onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm">
              <span>
                {item.product.title} x {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="text-lg font-semibold mb-4">Total: ₹{cart.totalAmount}</div>

        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <div className="space-y-2 mb-4">
          <label className="flex items-center gap-2 cursor-pointer border rounded p-3 hover:border-indigo-400">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={() => setPaymentMethod('razorpay')}
            />
            <span>Pay online (Razorpay)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer border rounded p-3 hover:border-indigo-400">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <div>
              <span className="block">Pay on delivery</span>
              <span className="text-xs text-gray-500">Pay in cash when your order arrives</span>
            </div>
          </label>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 w-full"
        >
          {loading
            ? 'Processing...'
            : paymentMethod === 'cod'
              ? 'Place order (pay on delivery)'
              : 'Pay with Razorpay'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
