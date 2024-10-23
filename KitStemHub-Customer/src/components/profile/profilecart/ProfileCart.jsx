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
        <div className="flex flex-row gap-10 min-h-screen ml-44">
          {/* Sidebar */}
          <div className="">
            <ProfileSidebar className="w-1/4" />
          </div>

          {/* Nội dung chi tiết đơn hàng */}
          <div className="mt-14">
            <CartMyProfile className="w-3/4" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfileCart;
