import { Layout } from "antd";
import FormMyProfile from "./formmyprofile/FormMyProfile";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";

const { Content } = Layout;

function ProfileInfo() {
  return (
    <Layout className="">
      <Content className="px-12">
        {/* Nav profile */}
        <ProfileNav />

        <Layout className="">
          {/* side bar */}

          <Content className="flex justify-center flex-wrap">
            <div className="pr-2 max-w-xs">
              <ProfileSidebar />
            </div>

            {/* form profile */}
            <div className="p-14 ">
              <FormMyProfile />
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default ProfileInfo;
