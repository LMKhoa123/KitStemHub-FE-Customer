import { Layout } from "antd";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";
import FormMyAddress from "./formmyaddress/FormMyAddress";

const { Content } = Layout;

function ProfileAddress() {
  return (
    <Layout className="">
      <Content className="px-12">
        {/* Nav profile */}

        <ProfileNav />
        <Layout className="">
          <Content className="flex justify-center flex-wrap">
            {/* side bar */}

            <div className="pr-2 max-w-xs">
              <ProfileSidebar />
            </div>

            {/* form profile */}
            <div className="p-14 max-w-4xl">
              <FormMyAddress />
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default ProfileAddress;
