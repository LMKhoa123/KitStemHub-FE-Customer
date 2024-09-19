import { Table } from "antd";
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
    <div className="p-13 max-w-3xl rounded">
      {/* form profile */}

      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default ProfileMyLab;
