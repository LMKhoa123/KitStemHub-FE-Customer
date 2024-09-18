import { Layout } from "antd";
import SidebarMenu from "../sidebarmenu/SidebarMenu";
import NavProfile from "../navprofile/NavProfile";
import FormMyProfile from "./formprofilemanagement/FormMyProfile";

const { Content } = Layout;

function ProfileInfo() {
  return (
    <Layout className="h-screen justify-center items-center min-h-screen">
      <Content className="px-12 overflow-y-auto">
        {/* Nav profile */}

        <NavProfile />
        <div className="flex">
          {/* side bar */}

          <div className="pr-2 max-w-xs shrink-0">
            <SidebarMenu />
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

export default ProfileInfo;
