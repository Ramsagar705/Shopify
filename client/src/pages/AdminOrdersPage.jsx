import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded shadow-md p-4 border-l-4 border-indigo-600">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-lg font-semibold">{o.user?.name}</div>
                  <div className="text-sm text-gray-600">
                    Order ID: {o._id.substring(0, 12)}...
                    {o.paymentProvider === 'COD' && (
                      <span className="ml-2 text-amber-700 font-medium">• Pay on delivery</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">₹{o.totalAmount}</div>
                  <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Delivery Address */}
              {o.shippingInfo && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                  <div className="text-sm font-semibold text-yellow-800 mb-1">📍 Delivery Address</div>
                  <div className="text-sm text-gray-800">
                    <div>{o.shippingInfo.address}</div>
                    <div>{o.shippingInfo.city}, {o.shippingInfo.state} {o.shippingInfo.postalCode}</div>
                    <div>{o.shippingInfo.country}</div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              {o.items && o.items.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold mb-2">📦 Items</div>
                  <ul className="space-y-1 bg-gray-50 rounded p-2">
                    {o.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex justify-between">
                        <span>{item.title} x {item.quantity}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status and Actions */}
              <div className="border-t pt-3">
                <div className="text-sm font-semibold mb-2">
                  Status: <span className={`px-2 py-1 rounded text-white text-xs ${
                    o.status === 'Pending' ? 'bg-yellow-500' :
                    o.status === 'Paid' ? 'bg-blue-500' :
                    o.status === 'Shipped' ? 'bg-purple-500' :
                    o.status === 'Delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}>{o.status}</span>
                </div>
                <div className="flex gap-2 text-xs flex-wrap">
                  {['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(o._id, s)}
                      className={`px-3 py-1 rounded border transition ${
                        o.status === s 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

