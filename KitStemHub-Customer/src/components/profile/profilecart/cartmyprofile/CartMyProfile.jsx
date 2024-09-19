import { Layout, Table } from "antd";
import ProfileNav from "../../profilenav/ProfileNav";
import ProfileSidebar from "../../profilesidebar/ProfileSidebar";

function CartMyProfile() {
  const dataSource = [
    {
      key: "1",
      donhang: "Mike",
      ngay: 32,
      soluong: "10 Downing Street",
      trangthai: (
        <span className="p-1 bg-green-600 rounded-lg text-white block text-center w-40 shadow-xl">
          Thành công
        </span>
      ),
      chitietdonhang: (
        <a href="#" className="text-blue-600">
          Chi Tiết
        </a>
      ),
    },
    {
      key: "1",
      donhang: "Mike",
      ngay: 32,
      soluong: "10 Downing Street",
      trangthai: (
        <span className="p-1 bg-red-600 rounded-lg text-white block text-center w-40 shadow-xl">
          Thất bại
        </span>
      ),
      chitietdonhang: (
        <a href="#" className="text-blue-600">
          Chi Tiết
        </a>
      ),
    },
    {
      key: "1",
      donhang: "Mike",
      ngay: 32,
      soluong: "10 Downing Street",
      trangthai: (
        <span className="p-1 bg-slate-600 rounded-lg text-white block text-center w-40 shadow-xl">
          Đang giao
        </span>
      ),
      chitietdonhang: (
        <a href="#" className="text-blue-600">
          Chi Tiết
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Đơn hàng",
      dataIndex: "donhang",
      key: "donhang",
    },
    {
      title: "Ngày",
      dataIndex: "ngay",
      key: "ngay",
    },

    {
      title: "Số lượng",
      dataIndex: "soluong",
      key: "soluong",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      key: "trangthai",
    },
    {
      title: "Chi tiết đơn hàng",
      dataIndex: "chitietdonhang",
      key: "chitietdonhang",
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

export default CartMyProfile;
