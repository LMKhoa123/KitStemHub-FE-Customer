import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/loginpage/LoginPage";
import ProfilePage from "./pages/profilepage/ProfilePage";
import SignUpPage from "./pages/signuppage/SignUpPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/loginpage",
      element: <LoginPage />,
    },
    {
      path: "/profilepage",
      element: <ProfilePage />,
    },
    {
      path: "/signuppage",
      element: <SignUpPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
