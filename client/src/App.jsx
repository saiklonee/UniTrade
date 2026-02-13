import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Home from "./pages/Home";
import CollegeApiTestPage from "./pages/AddCollege";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import AddItem from "./pages/AddItem";

import { checkAuth } from "./redux/features/auth/authSlice";
import PublicLayout from "./layout/PublicLayout";
import ProfileLayout from "./layout/ProfileLayout";
import EditProfile from "./pages/profile/EditProfile";
import ManageItems from "./pages/profile/ManageItems";
import AddItemPage from "./pages/profile/AddItemPage";
import Wishlist from "./pages/Wishlist";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";

// Simple loader
const BootLoader = ({ label = "Booting UniTrade..." }) => (
  <div className="min-h-screen bg-white text-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 text-sm font-medium tracking-wide">{label}</p>
    </div>
  </div>
);

// Protected wrapper
const Protected = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { booting, user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // While checking auth, don't render routes to avoid flicker
  if (booting) return <BootLoader />;

  return (
    <Routes>
      {/* Root route logic */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <Landing />}
      />

      {/* Auth pages */}
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/landing"
        element={user ? <Navigate to="/home" replace /> : <Landing />}
      />

      {/* Public/Protected Layout Routes */}
      <Route
        path="/home"
        element={
          <Protected user={user}>
            <PublicLayout />
          </Protected>
        }
      >
        <Route index element={<Home />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Product Routes (Wrapped in Public Layout for consistency) */}
      <Route
        path="/"
        element={
          <Protected user={user}>
            <PublicLayout />
          </Protected>
        }
      >
        <Route path="products" element={<AllProducts />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="category/:slug" element={<AllProducts />} />
      </Route>

      <Route
        path="/profile"
        element={
          <Protected user={user}>
            <ProfileLayout />
          </Protected>
        }
      >
        <Route index element={<EditProfile />} />
        <Route path="add-item" element={<AddItemPage />} />
        <Route path="manage-items" element={<ManageItems />} />
      </Route>

      <Route
        path="/admin"
      >
        <Route index element={<AdminDashboardLayout />} />
      </Route>

      <Route
        path="/add-item"
        element={
          <Protected user={user}>
            <AddItem />
          </Protected>
        }
      />

      <Route
        path="/college"
        element={
          <Protected user={user}>
            <CollegeApiTestPage />
          </Protected>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to={user ? "/home" : "/"} replace />}
      />
    </Routes>
  );
};

export default App;
