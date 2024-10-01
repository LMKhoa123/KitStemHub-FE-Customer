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
import ProfileAddress from "./components/profile/profileaddress/ProfileAddress";
import ProfileCart from "./components/profile/profilecart/ProfileCart";
import ProfileLab from "./components/profile/profilelab/ProfileLab";
import HomePageUser from "./pages/homepage/HomePageUser";
import HomePageRegister from "./pages/homepage/HomePageRegister";

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
  const isLoggedIn = () => !!localStorage.getItem("token");
  console.log(isLoggedIn());
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <HomePageRegister />,
  //   },
  //   {
  //     path: "/login",
  //     element: <LoginPage />,
  //   },
  //   {
  //     path: "/home",
  //     children: [
  //       { path: "user", element: <HomePageUser /> },
  //       { path: "register", element: <HomePageRegister /> },
  //     ],
  //   },
  //   {
  //     path: "/profile", // Đường dẫn cho ProfilePage
  //     element: <ProfilePage />, // Sử dụng ProfilePage làm layout
  //     children: [
  //       {
  //         path: "profileinfo", // Đường dẫn con: /profile/profileinfo
  //         element: <ProfileInfo />, // Thành phần ProfileInfo
  //       },
  //       {
  //         path: "profileaddress", // Đường dẫn con: /profile/profileaddress
  //         element: <ProfileAddress />, // Thành phần ProfileAddress
  //       },
  //       {
  //         path: "profilecart", // Đường dẫn con: /profile/profilecart
  //         element: <ProfileCart />, // Thành phần ProfileCart
  //       },
  //       {
  //         path: "profilelab", // Đường dẫn con: /profile/profilelab
  //         element: <ProfileLab />, // Thành phần ProfileLab
  //       },
  //     ],
  //   },
  // ]);
  // return <RouterProvider router={router} />;
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route path="/" element={<HomePageRegister />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePageUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileInfo />} />
            <Route path="address" element={<ProfileAddress />} />
            <Route path="cart" element={<ProfileCart />} />
            <Route path="lab" element={<ProfileLab />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
