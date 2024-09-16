import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/loginpage/LoginPage";
import ProfilePage from "./pages/profilepage/ProfilePage";

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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
