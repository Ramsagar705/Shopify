import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Shopify
        </Link>
        <div className="flex items-center gap-4">
          <NavLink to="/products" className="hover:text-indigo-600">
            Products
          </NavLink>
          <NavLink to="/cart" className="relative hover:text-indigo-600">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full px-1">
                {cartCount}
              </span>
            )}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/orders" className="hover:text-indigo-600">
                Orders
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className="hover:text-indigo-600">
                  Admin
                </NavLink>
              )}
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-indigo-600">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

