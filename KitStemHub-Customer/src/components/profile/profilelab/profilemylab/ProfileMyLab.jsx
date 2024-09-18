import { Layout, Table } from "antd";
import ProfileNav from "../../profilenav/ProfileNav";
import ProfileSidebar from "../../profilesidebar/ProfileSidebar";
import { CloudDownloadOutlined } from "@ant-design/icons";

function ProfileMyLab() {
  const dataSource = [
    {
      key: "1",
      madathang: 3354654654526,
      tenkit: 32,
      taixuonglab: <CloudDownloadOutlined />,
      solanhotro: 3,
      hotro: (
        <span className="p-1 bg-green-600 rounded-lg text-white block text-center w-36 shadow-xl">
          Hỗ trợ ?
        </span>
      ),
    },
    {
      key: "1",
      madathang: 3354654654526,
      tenkit: "Bộ linh kiện STEM Kit V2",
      taixuonglab: <CloudDownloadOutlined />,
      solanhotro: 3,
      hotro: (
        <span className="p-1 bg-green-600 rounded-lg text-white block text-center w-36 shadow-xl">
          Hỗ trợ ?
        </span>
      ),
    },
    {
      key: "1",
      madathang: 3354654654526,
      tenkit: "Bộ linh kiện STEM Kit V2",
      taixuonglab: <CloudDownloadOutlined />,
      solanhotro: 3,
      hotro: (
        <span className="p-1 bg-green-600 rounded-lg text-white block text-center w-36 shadow-xl">
          Hỗ trợ ?
        </span>
      ),
    },
  ];

  const columns = [
    {
      title: "Mã đặt hàng",
      dataIndex: "madathang",
      key: "madathang",
    },
    {
      title: "Tên Kit",
      dataIndex: "tenkit",
      key: "tenkit",
    },

    {
      title: "Tải xuống Lab",
      dataIndex: "taixuonglab",
      key: "taixuonglab",
    },
    {
      title: "Số lần hỗ trợ",
      dataIndex: "solanhotro",
      key: "solanhotro",
    },
    {
      title: "",
      dataIndex: "hotro",
      key: "hotro",
    },
  ];
  return (
    <Layout className="h-screen min-h-screen px-12 overflow-y-auto">
      {/* Nav profile */}

      <div className="pl-[310px] pr-[310px]">
        <ProfileNav />
      </div>

      <div className="flex justify-center">
        {/* side bar */}

        <div className="pr-2 max-w-xs shrink-0">
          <ProfileSidebar />
        </div>

        {/* form profile */}
        <div className="p-14 max-w-4xl grow">
          <Table dataSource={dataSource} columns={columns} />
        </div>
      </div>
    </Layout>
  );
}

export default ProfileMyLab;
