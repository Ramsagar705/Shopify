import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  images: ''
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  const fetchCategories = () => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check each required field
    const missingFields = [];
    if (!form.title) missingFields.push('Title');
    if (!form.description) missingFields.push('Description');
    if (!form.price) missingFields.push('Price');
    if (!form.stock) missingFields.push('Stock');
    if (!form.categoryId) missingFields.push('Category');
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images ? form.images.split(',').map((s) => s.trim()) : []
    };
    
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      stock: p.stock,
      categoryId: p.category?._id || p.category,
      images: (p.images || []).join(', ')
    });
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-xl font-bold mb-4">Products</h1>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet. Create one!</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {products.map((p) => (
              <li
                key={p._id}
                className="bg-white rounded shadow-sm p-3 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">
                    Category: {p.category?.name || 'N/A'} • ₹{p.price} • Stock: {p.stock}
                  </div>
                </div>
                <div className="flex gap-2 text-sm ml-2">
                  <button
                    className="text-indigo-600 hover:underline"
                    onClick={() => startEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteProduct(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1 font-semibold">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              placeholder="Product name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              placeholder="Product description"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Images (comma-separated URLs)</label>
            <textarea
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              placeholder="/images/shirt1.jpg, /images/shirt2.jpg"
              rows="2"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
            >
              {editingId ? 'Update' : 'Create'} Product
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductsPage;

