/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Loading from "./components/Loading";
import AuthPage from "./pages/loginpage/LoginPage";
import ProfilePage from "./pages/profilepage/ProfilePage";
import ProfileInfo from "./components/profile/profileinfo/ProfileInfo";
import ProfileCart from "./components/profile/profilecart/ProfileCart";
import ProfileLab from "./components/profile/profilelab/ProfileLab";
import HomePageUser from "./pages/homepage/HomePageUser";
import HomePageRegister from "./pages/homepage/HomePageRegister";
import CartPage from "./pages/cartpage/CartPage";
import CheckOutPage from "./pages/checkoutpage/CheckOutPage";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ProductDetailPage from "./pages/productdetailpage/ProductDetailPageUser";
import OrderDetail from "./components/order/OrderDetail";
import EmailVerification from "./components/EmailVerification"; // Import EmailVerification component
import Result from "./components/result/Result";
import ResetPassword from "./components/ResetPassword";
import KitCategory from "./components/home/KitCategory";
import CategoryDetailPage from "./pages/categoryDetailPage/CategoryDetailPage";
// import "antd/dist/antd.css";
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isLoggedIn ? <Navigate to="/home" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                {/* //children */}
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route path="/" element={<HomePageRegister />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                {/* //children */}
                <HomePageUser />
              </ProtectedRoute>
            }
          />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {/* //children */}
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileInfo />} />
            <Route path="cart" element={<ProfileCart />} />
            <Route path="lab" element={<ProfileLab />} />
          </Route>
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/productdetail/:kitId" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/order/result" element={<Result />} />
          <Route
            path="/category/:categoryName"
            element={<CategoryDetailPage />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
