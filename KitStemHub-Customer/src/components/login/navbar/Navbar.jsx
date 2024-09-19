import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Input, Menu, Drawer } from "antd";
const { Search } = Input;

const onSearch = (value) => console.log(value);

const items = [
  {
    label: "Home",
    key: "home",
  },
  {
    label: "Contact Us",
    key: "contact",
  },
  {
    label: "About Us",
    key: "about",
  },
  {
    label: "Login",
    key: "login",
  },
  {
    label: "Sign In",
    key: "signin",
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
            <li className="kt-menu-item">
              <a href="#" className="">
                Home
              </a>
            </li>
            <li className="kt-menu-item">
              <a href="#" className="">
                Contact
              </a>
            </li>
            <li className="kt-menu-item">
              <a href="#" className="">
                About
              </a>
            </li>
            <li className="kt-menu-item">
              <a href="#" className="">
                Sign Up
              </a>
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
