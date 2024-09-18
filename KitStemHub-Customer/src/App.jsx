import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/loginpage/LoginPage";
import ProfilePage from "./pages/profilepage/ProfilePage";
import ProfileInfo from "./components/profile/profileinfo/ProfileInfo";
import ProfileAddress from "./components/profile/profileaddress/ProfileAddress";

function App() {
  const router = createBrowserRouter([
    {
      path: "/loginpage",
      element: <LoginPage />,
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
