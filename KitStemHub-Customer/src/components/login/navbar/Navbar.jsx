import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Input, Menu, Drawer } from "antd";
import { Link, NavLink } from "react-router-dom";
const { Search } = Input;

const onSearch = (value) => console.log(value);

const items = [
  {
    label: (
      <NavLink
        to="/"
        exact
        className={({ isActive }) => (isActive ? " font-bold " : "")}
      >
        Home
      </NavLink>
    ),
    key: "home",
  },
  {
    label: (
      <NavLink
        to="/contact"
        exact
        className={({ isActive }) => (isActive ? " font-bold " : "")}
      >
        Contact Us
      </NavLink>
    ),
    key: "contact",
  },
  {
    label: (
      <NavLink to="/about" className="text-gray-800 hover:text-red-500">
        About
      </NavLink>
    ),
    key: "about",
  },
  {
    label: (
      <NavLink
        to="/login"
        exact
        className={({ isActive }) => (isActive ? " font-bold " : "")}
      >
        Login
      </NavLink>
    ),
    key: "login",
  },
  {
    label: (
      <NavLink
        to="/signup"
        exact
        className={({ isActive }) => (isActive ? " font-bold " : "")}
      >
        Sign Up
      </NavLink>
    ),
    key: "signup",
  },
];
// eslint-disable-next-line react/prop-types
function Navbar({ childrenItem }) {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="content-wrapper max-w-screen-2xl text-base mx-auto px-8 border-b h-24">
      <header className="py-6 mx-10">
        <nav className="flex flex-row justify-between items-center">
          {/* Logo */}
          <div className="logo basis-1/6 text-center text-xl font-semibold cursor-pointer">
            KitStemHub
          </div>

          {/* Desktop Menu */}
          <ul
            id="kt-menu"
            className="basis-2/6 hidden lg:flex lg:items-center lg:justify-between text-md font-normal text-gray-400"
          >
            <li className="">
              <NavLink
                to="/"
                exact
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 font-bold border-b-2 border-pink-300"
                    : "kt-menu-item"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="/contact"
                exact
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 font-bold border-b-2 border-pink-300"
                    : "kt-menu-item"
                }
              >
                Contact
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="/aboutUs"
                exact
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 font-bold border-b-2 border-pink-300"
                    : "kt-menu-item"
                }
              >
                About Us
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="/login"
                exact
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 font-bold border-b-2 border-pink-300"
                    : "kt-menu-item"
                }
              >
                Login In
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="/signup"
                exact
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 font-bold border-b-2 border-pink-300"
                    : "kt-menu-item"
                }
              >
                Sign Up
              </NavLink>
            </li>
          </ul>

          {/* Desktop Search */}
          <Search
            placeholder="What are you looking for?"
            onSearch={onSearch}
            enterButton
            className="hidden lg:block lg:basis-2/6"
          />

          {childrenItem}

          {/* Mobile Menu Icon */}
          <div className="lg:hidden basis-1/6 cursor-pointer px-4">
            <MenuOutlined onClick={showDrawer} />
          </div>

          {/* Mobile Drawer */}
          <Drawer
            title="Menu"
            placement="right"
            onClose={onClose}
            visible={visible}
            className="lg:hidden"
          >
            <Menu items={items} mode="vertical" />
          </Drawer>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
