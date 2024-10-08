import { DeleteOutlined } from "@ant-design/icons";
import { Table, Button, Card, InputNumber, Checkbox, Popconfirm } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    },
    {
      key: "2",
      product: "Kit học tập phát triển 8051 đa chức năng",
      price: 960,
      quantity: 2,
      subtotal: 1920,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/ttAIhIY1ttoaJR9pWjGuX0SN6ASfwsgOaEOujSRHJPeM2OkTA.jpg",
    },
  ]);

  const [point, setPoint] = useState(false); // Sử dụng điểm
  const [subtotal, setSubtotal] = useState(3080);
  const [total, setTotal] = useState(3080);

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
    const discount = point ? 1000 : 0; // Giảm 10 đơn vị khi sử dụng điểm
    setTotal(newSubtotal - discount);
  };

  const handlePointChange = (e) => {
    setPoint(e.target.checked);
    updateTotals(cartItems); // Cập nhật tổng giá khi người dùng chọn/deselect điểm
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "30%",
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
      width: "25%",
      render: (price) => `$${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "25%",
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
      width: "25%",
      render: (subtotal) => `$${subtotal}`,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-5 text-xl">
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
        </div>
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
    </div>
  );
}

export default CartContent;
