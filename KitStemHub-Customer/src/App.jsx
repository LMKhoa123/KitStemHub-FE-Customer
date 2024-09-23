import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/loginpage/LoginPage";
import ProfilePage from "./pages/profilepage/ProfilePage";
import ProfileInfo from "./components/profile/profileinfo/ProfileInfo";
import ProfileAddress from "./components/profile/profileaddress/ProfileAddress";
import SignUpPage from "./pages/signuppage/SignUpPage";
import ProfileCart from "./components/profile/profilecart/ProfileCart";
import ProfileLab from "./components/profile/profilelab/ProfileLab";
import HomePageUser from "./pages/homepage/HomePageUser";
import HomePageRegister from "./pages/homepage/HomePageRegister";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePageRegister />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/home",
      children: [
        { path: "user", element: <HomePageUser /> },
        { path: "register", element: <HomePageRegister /> },
      ],
    },
    {
      path: "/profile", // Đường dẫn cho ProfilePage
      element: <ProfilePage />, // Sử dụng ProfilePage làm layout
      children: [
        {
          path: "profileinfo", // Đường dẫn con: /profile/profileinfo
          element: <ProfileInfo />, // Thành phần ProfileInfo
        },
        {
          path: "profileaddress", // Đường dẫn con: /profile/profileaddress
          element: <ProfileAddress />, // Thành phần ProfileAddress
        },
        {
          path: "profilecart", // Đường dẫn con: /profile/profilecart
          element: <ProfileCart />, // Thành phần ProfileCart
        },
        {
          path: "profilelab", // Đường dẫn con: /profile/profilelab
          element: <ProfileLab />, // Thành phần ProfileLab
        },
      ],
    },
    {
      path: "/signup",
      element: <SignUpPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
