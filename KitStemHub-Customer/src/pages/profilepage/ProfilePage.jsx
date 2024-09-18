import Navbar from "../../components/login/navbar/Navbar";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ProfileInfo from "../../components/profile/profileinfo/ProfileInfo";

function ProfilePage() {
  return (
    <>
      <Navbar
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
                  <UserOutlined />
                </a>
              </li>
            </ul>
          </>
        }
      />
      <ProfileInfo />
    </>
  );
}

export default ProfilePage;
