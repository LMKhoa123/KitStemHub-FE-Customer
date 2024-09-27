import { Layout } from "antd";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";
import ProfileMyLab from "./profilemylab/ProfileMyLab";

const { Content } = Layout;

function ProfileLab() {
  return (
    <Layout className="h-screen">
      <Content className="px-12">
        {/* Nav profile */}
        <ProfileNav />

        <Layout className="">
          {/* side bar */}

          <Content className="flex justify-center flex-wrap">
            <div className="pr-1 max-w-xs">
              <ProfileSidebar />
            </div>

            <div className="p-14 ">
              {/* form profile */}

              <ProfileMyLab />
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default ProfileLab;
