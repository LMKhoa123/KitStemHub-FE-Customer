import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Menu, Drawer } from "antd";
import { NavLink } from "react-router-dom";

const items = [
  {
    label: (
      <NavLink
        to="/"
        exact
        className={({ isActive }) => (isActive ? " font-bold " : "")}
      >
        Trang Chủ
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
        Liên Hệ
      </NavLink>
    ),
    key: "contact",
  },
  {
    label: (
      <NavLink to="/about" className="text-gray-800 hover:text-red-500">
        Về Chúng Tôi
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
        Đăng Nhập
      </NavLink>
    ),
    key: "login",
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
    <div className="content-wrapper max-w-screen-2xl text-base mx-auto px-8 border-b h-24 ">
      <header className="py-6 mx-10">
        <nav className="flex flex-row justify-between items-center">
          {/* Logo */}
          <div className="logo basis-1/6 text-center text-xl font-semibold cursor-pointer">
            KitStemHub
          </div>

          {/* Desktop Menu */}
          <ul
            id="kt-menu"
            className="basis-3/6 hidden lg:flex lg:items-center lg:justify-between text-md font-normal text-gray-400"
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
                Trang Chủ
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
                Liên Hệ
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
                Về chúng tôi
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
                Đăng Nhập
              </NavLink>
            </li>
          </ul>

          {/* Desktop Search */}
          {/* <Search
            placeholder="What are you looking for?"
            onSearch={onSearch}
            enterButton
            className="hidden lg:block lg:basis-2/6"
          /> */}
          <div className="w-36"></div>

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
