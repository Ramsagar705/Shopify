import { useEffect, useState } from 'react';
import api from '../api/axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded shadow-sm p-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Order #{o._id}</span>
              <span className="font-semibold">{o.status}</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {new Date(o.createdAt).toLocaleString()} • ₹{o.totalAmount}
              {o.paymentProvider === 'COD' && ' • Pay on delivery'}
            </div>
            <ul className="text-sm list-disc ml-5">
              {o.items.map((it, idx) => (
                <li key={idx}>
                  {it.title} x {it.quantity} (₹{it.price})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

