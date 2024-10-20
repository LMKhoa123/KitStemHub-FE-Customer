import { Layout } from "antd";
import ProfileNav from "../profilenav/ProfileNav";
import ProfileSidebar from "../profilesidebar/ProfileSidebar";
import ProfileMyLabHistory from "./profilemylab/ProfileMyLabHistory";
// import ProfileMyLab from "./profilemylab/ProfileMyLab";

function ProfileLab() {
  return (
    <Layout className="min-h-screen">
      <div className="px-11">
        {/* Nav profile */}
        <ProfileNav />

        <Layout className="">
          {/* side bar */}

          <div className="flex flex-row min-h-screen ml-28">
            <div className="w-1/4">
              <ProfileSidebar />
            </div>

            <div className="w-3/4 mt-14">
              {/* form profile */}

              {/* <ProfileMyLab /> */}
              <ProfileMyLabHistory />
            </div>
          </div>
        </Layout>
      </div>
    </Layout>
  );
}

export default ProfileLab;
