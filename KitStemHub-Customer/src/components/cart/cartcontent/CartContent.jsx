import { InputNumber, Space, Table } from "antd";

function CartContent() {
  const onChange = (value) => {
    console.log("changed", value);
  };
  const dataSource = [
    {
      key: "1",
      donhang: "Mike",
      ngay: 32,
      soluong: (
        <Space wrap>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            defaultValue={1}
            onChange={onChange}
          />
        </Space>
      ),
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
      soluong: (
        <Space wrap>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            defaultValue={1}
            onChange={onChange}
          />
        </Space>
      ),
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
      soluong: (
        <Space wrap>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            defaultValue={1}
            onChange={onChange}
          />
        </Space>
      ),
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
      title: "Sản phẩm",
      dataIndex: "donhang",
      key: "donhang",
    },
    {
      title: "Giá",
      dataIndex: "ngay",
      key: "ngay",
    },

    {
      title: "Số lượng",
      dataIndex: "soluong",
      key: "soluong",
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "total",
      key: "total",
    },
  ];
  return (
    <div className="bg-white p-14 max-w-3xl shadow-lg rounded mb-6">
      {/* form profile */}

      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default CartContent;
