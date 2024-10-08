import { DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Card,
  InputNumber,
  Checkbox,
  Popconfirm,
  Select,
  Modal,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function CartContent() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      key: "1",
      product: "Bộ linh kiện STEM Kit V2",
      price: 1160,
      quantity: 1,
      subtotal: 1160,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/R6miveWxuO3PR6vhzWMLOu87RmVZjNRzAe7VYZj9wdML2OkTA.jpg",
      package: "Package 1",
      availablePackages: ["Package 1", "Package 2", "Package 3"], // Danh sách các package có sẵn
      labs: ["Lab 1", "Lab 2", "Lab 3"], // Bài lab liên quan đến package
    },
    {
      key: "2",
      product: "Kit học tập phát triển 8051 đa chức năng",
      price: 960,
      quantity: 2,
      subtotal: 1920,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/ttAIhIY1ttoaJR9pWjGuX0SN6ASfwsgOaEOujSRHJPeM2OkTA.jpg",
      package: "Package 1",
      availablePackages: ["Package 1", "Package 2"], // Danh sách các package có sẵn
      labs: ["Lab A", "Lab B"], // Bài lab liên quan đến package
    },
  ]);

  const [point, setPoint] = useState(false);
  const [subtotal, setSubtotal] = useState(3080);
  const [total, setTotal] = useState(3080);
  const [labModalVisible, setLabModalVisible] = useState(false);
  const [selectedLabs, setSelectedLabs] = useState([]);

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  // Hàm xử lý khi thay đổi số lượng sản phẩm
  const handleQuantityChange = (value, record) => {
    const newCartItems = cartItems.map((item) =>
      item.key === record.key
        ? { ...item, quantity: value, subtotal: item.price * value }
        : item
    );
    setCartItems(newCartItems);
    updateTotals(newCartItems);
  };

  // Hàm xử lý khi xóa sản phẩm
  const handleDelete = (record) => {
    const newCartItems = cartItems.filter((item) => item.key !== record.key);
    setCartItems(newCartItems);
    updateTotals(newCartItems);
  };

  // Hàm cập nhật tổng tiền
  const updateTotals = (items) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);

    // Nếu người dùng sử dụng điểm thì giảm giá
    const discount = point ? 1000 : 0;
    setTotal(newSubtotal - discount);
  };

  const handlePointChange = (e) => {
    setPoint(e.target.checked);
    updateTotals(cartItems);
  };

  // Hàm xử lý khi thay đổi package
  const handlePackageChange = (value, record) => {
    const newCartItems = cartItems.map((item) =>
      item.key === record.key ? { ...item, package: value } : item
    );
    setCartItems(newCartItems);
  };

  // Hàm mở modal hiển thị các bài lab liên quan
  const handleViewLabs = (labs) => {
    setSelectedLabs(labs);
    setLabModalVisible(true);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "20%",
      render: (text, record) => (
        <div className="flex items-center">
          <img src={record.imageUrl} alt={text} className="w-12 h-auto mr-4" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (price) => `$${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
      render: (quantity, record) => (
        <InputNumber
          size="large"
          min={1}
          max={100000}
          defaultValue={quantity}
          onChange={(value) => handleQuantityChange(value, record)}
          className="border border-gray-300 rounded-md"
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      width: "15%",
      render: (subtotal) => `$${subtotal}`,
    },
    {
      title: "Package",
      key: "package",
      width: "20%",
      render: (text, record) => (
        <Select
          defaultValue={record.package}
          style={{ width: 150 }}
          onChange={(value) => handlePackageChange(value, record)}
        >
          {record.availablePackages.map((pkg) => (
            <Option key={pkg} value={pkg}>
              {pkg}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Labs",
      key: "labs",
      width: "10%",
      render: (_, record) => (
        <Button onClick={() => handleViewLabs(record.labs)}>View Labs</Button>
      ),
    },
    {
      title: "",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => handleDelete(record)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined
            style={{
              cursor: "pointer",
              color: "red",
              transition: "color 0.3s, transform 0.3s",
            }}
            className="hover:text-red-700 hover:scale-110"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-2/3 p-5">
      {/* Table for cart items */}
      <Table
        columns={columns}
        dataSource={cartItems}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <Button
                onClick={handleNavigate("/home")}
                className="!border !border-gray-400 !text-black hover:!bg-black hover:!text-white !transition-all !duration-300 h-10 w-40 font-semibold"
              >
                Return To Shop
              </Button>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      {/* Cart Total section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <Card
          title={<span className="text-2xl">Cart Total</span>}
          className="border border-gray-300 rounded-md p-5 hover:!border-gray-800"
        >
          <div className="flex justify-between mb-3 font-medium">
            <span>Subtotal:</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between mb-3 font-medium">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-3 font-medium">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between mb-3 font-medium">
            <span>Point:</span>
            <Checkbox checked={point} onChange={handlePointChange}>
              10 points
            </Checkbox>
          </div>
          <Button
            type="primary"
            className="bg-red-500 text-white w-full hover:!bg-red-500 hover:opacity-85 mt-3"
          >
            Proceed to checkout
          </Button>
        </Card>
      </div>

      {/* Modal to show labs */}
      <Modal
        title="Labs"
        visible={labModalVisible}
        onCancel={() => setLabModalVisible(false)}
        footer={null}
      >
        <ul>
          {selectedLabs.map((lab, index) => (
            <li key={index}>{lab}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default CartContent;
