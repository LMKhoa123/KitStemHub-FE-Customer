import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import NavbarEx from "../navbarEx/NavbarEx";
import DropdownUser from "../../dropdownUser/DropdownUser";

function NavbarUser() {
  return (
    <>
      <NavbarEx
        childrenItem={
          <>
            <ul className="flex justify-between items-center text-gray-400 gap-4 text-md font-normal">
              <li className="hover:text-gray-800 transition p-4 text-xl">
                <a href="#" className="">
                  <HeartOutlined />
                </a>
              </li>
              <li className="hover:text-gray-800 transition p-4 text-xl">
                <a href="#" className="">
                  <ShoppingCartOutlined />
                </a>
              </li>
              <li className="hover:text-gray-800 transition p-4 text-xl">
                <a href="#" className="">
                  <DropdownUser />
                </a>
              </li>
            </ul>
          </>
        }
      />
    </>
  );
}

export default NavbarUser;
