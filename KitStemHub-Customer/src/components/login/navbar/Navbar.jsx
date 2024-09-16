import { Input } from "antd";
const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info && info.source, value);

function Navbar() {
  return (
    <div className="content-wrapper max-w-screen-2xl text-base mx-auto px-8 border-b">
      <header className="py-6 mx-10">
        <nav className="flex flex-row justify-between items-center">
          <div className="logo basis-1/6 text-center text-xl font-semibold cursor-pointer">
            KitStemHub
          </div>
          <ul className=" basis-2/6 flex items-center justify-between text-md font-normal text-gray-400">
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
          <Search
            placeholder="What are you looking for?"
            onSearch={onSearch}
            enterButton
            className="search-product basis-2/6"
          />
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
