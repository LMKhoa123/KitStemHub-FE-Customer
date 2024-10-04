import { Layout } from "antd";
import CartMyProfile from "./cartmyprofile/CartMyProfile";
import { Content } from "antd/es/layout/layout";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";

function ProfileCart() {
  return (
    <Layout className="h-screen">
      <Content className="px-11">
        {/* Nav profile */}
        <ProfileNav />

        <Layout className="">
          {/* side bar */}

          <Content className="flex justify-center flex-wrap">
            <div className="pr-1 max-w-xs">
              <ProfileSidebar />
            </div>

            {/* form profile */}
            <div className="pt-14">
              <CartMyProfile />
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default ProfileCart;
