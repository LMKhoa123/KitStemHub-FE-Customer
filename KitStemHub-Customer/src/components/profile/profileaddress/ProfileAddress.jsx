import { Layout } from "antd";
import FormMyProfile from "./formmyaddress/FormMyAddress";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";

const { Content } = Layout;

function ProfileAddress() {
  return (
    <Layout className="h-screen justify-center items-center min-h-screen">
      <Content className="px-12 overflow-y-auto">
        {/* Nav profile */}

        <ProfileNav />
        <div className="flex">
          {/* side bar */}

          <div className="pr-2 max-w-xs shrink-0">
            <ProfileSidebar />
          </div>

          {/* form profile */}
          <div className="p-14 max-w-4xl grow">
            <FormMyProfile />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default ProfileAddress;
