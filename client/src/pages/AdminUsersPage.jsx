import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    fetchUsers();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white rounded shadow-sm p-3 flex items-center justify-between text-sm"
          >
            <div>
              <div className="font-semibold">
                {u.name} ({u.email})
              </div>
              <div className="text-gray-600">Role: {u.role}</div>
            </div>
            <div className="flex gap-2">
              {['user', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(u._id, r)}
                  className={`px-2 py-1 rounded border ${
                    u.role === r ? 'bg-indigo-600 text-white' : 'bg-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;

