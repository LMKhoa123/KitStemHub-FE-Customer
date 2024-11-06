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

          <div className="flex flex-wrap min-h-screen gap-10 ml-44">
            <div className="">
              <ProfileSidebar className="w-1/4" />
            </div>

            <div className="mt-14">
              {/* form profile */}

              {/* <ProfileMyLab /> */}
              <ProfileMyLabHistory className="w-3/4" />
            </div>
          </div>
        </Layout>
      </div>
    </Layout>
  );
}

export default ProfileLab;
