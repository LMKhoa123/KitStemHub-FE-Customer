import { Layout } from "antd";
import CartMyProfile from "./cartmyprofile/CartMyProfile";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";

function ProfileCart() {
  return (
    <Layout className="min-h-screen">
      <div className="px-11">
        {/* Nav profile */}
        <ProfileNav />

        {/* Flex container để sidebar và profile cùng một hàng */}
        <div className="flex flex-row min-h-screen ml-28">
          {/* Sidebar */}
          <div className="w-1/4">
            <ProfileSidebar />
          </div>

          {/* Nội dung chi tiết đơn hàng */}
          <div className="w-3/4 mt-14">
            <CartMyProfile />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfileCart;
