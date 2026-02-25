import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold">₹{stats.totalRevenue}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow-sm p-4">
          <h2 className="font-semibold mb-3">Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products sold yet</p>
          ) : (
            <ul className="text-sm space-y-2">
              {stats.topProducts.map((tp) => (
                <li key={tp._id} className="border-b pb-2 last:border-b-0">
                  <div className="font-medium">{tp.product.title}</div>
                  <div className="text-gray-600">{tp.totalSold} sold • ₹{tp.revenue}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <h2 className="font-semibold mb-3">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet</p>
          ) : (
            <ul className="text-sm space-y-3">
              {stats.recentOrders.map((o) => (
                <li key={o._id} className="border-b pb-3 last:border-b-0">
                  <div className="font-medium">{o.user?.name || 'Unknown'}</div>
                  <div className="text-gray-600">
                    {o.user?.address || 'No address'} • ₹{o.totalAmount}
                  </div>
                  <div className="text-xs text-gray-500">Status: {o.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <Link to="/admin/products" className="bg-indigo-600 text-white px-4 py-3 rounded text-center hover:bg-indigo-700 font-semibold">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-green-600 text-white px-4 py-3 rounded text-center hover:bg-green-700 font-semibold">
          View Orders
        </Link>
        <Link to="/admin/users" className="bg-blue-600 text-white px-4 py-3 rounded text-center hover:bg-blue-700 font-semibold">
          Users
        </Link>
        <Link to="/" className="bg-gray-600 text-white px-4 py-3 rounded text-center hover:bg-gray-700 font-semibold">
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

