import CartMyProfile from "./cartmyprofile/CartMyProfile";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";
import { useState } from "react";

function ProfileCart() {
  const [currentTab, setCurrentTab] = useState("Quản lí đơn hàng");
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* Nav profile */}
      <div className="md:my-16">
        <ProfileNav currentTab={currentTab} />
      </div>

      {/* Flex container để sidebar và profile cùng một hàng */}
      <div className="flex flex-col gap-2">
        {/* Sidebar */}

        <div className="w-full">
          <ProfileSidebar />
        </div>

        {/* Nội dung chi tiết đơn hàng */}
        <div className="w-full">
          <CartMyProfile />
        </div>
      </div>
    </div>
  );
}

export default ProfileCart;
