import { Input } from "antd";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function NavbarEx({ childrenItem }) {
  return (
    <div className="content-wrapper max-w-screen-2xl text-base mx-auto px-8 border-b h-24">
      <header className="py-6 mx-10">
        <nav className="flex flex-row justify-between items-center">
          <div className="logo basis-1/6 text-center text-xl font-semibold cursor-pointer">
            KitStemHub
          </div>
          <ul className=" basis-2/5 flex items-center justify-between text-md font-normal text-gray-400">
            <li className="kt-menu-item">
              <NavLink to="/home">Home</NavLink>
            </li>
            <li className="kt-menu-item">
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li className="kt-menu-item">
              <NavLink to="about">About</NavLink>
            </li>
          </ul>

          {childrenItem}
        </nav>
      </header>
    </div>
  );
}

export default NavbarEx;
