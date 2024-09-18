import { Layout } from "antd";
import SidebarMenu from "../sidebarmenu/SidebarMenu";
import NavProfile from "../navprofile/NavProfile";
import FormMyProfile from "./formprofilemanagement/FormMyProfile";

const { Content } = Layout;

function ProfileInfo() {
  return (
    <Layout className="h-screen" style={{ minHeight: "100vh" }}>
      <Content className="px-12 " style={{ overflowY: "auto" }}>
        {/* Nav profile */}

        <NavProfile />
        <div className="flex">
          {/* side bar */}

          <div className="pr-2" style={{ maxWidth: "300px", flexShrink: 0 }}>
            <SidebarMenu />
          </div>

          {/* form profile */}
          <div className="p-14" style={{ maxWidth: "800px", flexGrow: 1 }}>
            <FormMyProfile />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default ProfileInfo;
