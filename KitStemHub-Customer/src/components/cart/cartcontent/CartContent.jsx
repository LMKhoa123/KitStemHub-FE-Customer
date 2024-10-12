import { DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Card,
  InputNumber,
  Checkbox,
  Popconfirm,
  Modal,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";

function CartContent() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [labModalVisible, setLabModalVisible] = useState(false);
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [point, setPoint] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // State để lưu các sản phẩm được chọn
  const [loading, setLoading] = useState(true); // Trạng thái tải

  // Fetch dữ liệu từ API khi component render
  const fetchCartData = async () => {
    try {
      // Gọi API để lấy dữ liệu từ giỏ hàng
      const cartResponse = await api.get("carts");
      const kitsResponse = await api.get("kits");

      const kitsData = kitsResponse.data.details.data.kits;

      // Tìm ảnh kit dựa trên kitId thay vì packageId
      const findKitImage = (kitId) => {
        const kit = kitsData.find((kit) => kit.id === kitId);
        return kit
          ? kit["kit-images"][0].url
          : "https://via.placeholder.com/150"; // Nếu không có ảnh thì hiển thị placeholder
      };

      const cartsData = cartResponse.data.details.data.carts.map(
        (item, index) => ({
          key: index.toString(),
          kitId: item.package.kit.id, // Sử dụng id của kit
          product: item.package.kit.name,
          price: item.package.price, // Giá từ giỏ hàng
          quantity: item["package-quantity"],
          subtotal: item.package.price * item["package-quantity"], // Tính subtotal
          imageUrl: findKitImage(item.package.kit.id), // Lấy ảnh từ kits API dựa trên kitId
          package: item.package.name,
          labs: item.package.labs.map((lab) => lab.name),
        })
      );

      setCartItems(cartsData);
      setSelectedItems([]); // Ban đầu không có sản phẩm nào được chọn
      updateTotals([]); // Cập nhật lại tổng tiền ban đầu
      setLoading(false); // Đặt trạng thái tải về false khi dữ liệu đã được fetch
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Hàm xóa cart theo packageId
  const deleteCart = async (packageId) => {
    try {
      await api.delete(`carts/${packageId}`); // Gọi API xóa
      // Hiển thị thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        placement: "topRight", // Vị trí hiển thị thông báo
      });
      // Cập nhật lại danh sách giỏ hàng sau khi xóa
      setCartItems(cartItems.filter((item) => item.packageId !== packageId));
      setSelectedItems(
        selectedItems.filter((item) => item.packageId !== packageId)
      );
      updateTotals(
        selectedItems.filter((item) => item.packageId !== packageId)
      );
    } catch (error) {
      notification.error({
        message: "Thất bại",
        description: "Xóa sản phẩm khỏi giỏ hàng thất bại.",
        placement: "topRight",
      });
      console.error("Error deleting cart:", error);
    }
  };

  // Hàm xóa tất cả sản phẩm trong giỏ hàng
  const deleteAllCarts = async () => {
    try {
      await api.delete("carts"); // Gọi API xóa tất cả sản phẩm
      notification.success({
        message: "Thành công",
        description: "Tất cả sản phẩm đã được xóa khỏi giỏ hàng.",
        placement: "topRight",
      });
      setCartItems([]);
      setSelectedItems([]);
      updateTotals([]);
    } catch (error) {
      notification.error({
        message: "Thất bại",
        description: "Xóa tất cả sản phẩm khỏi giỏ hàng thất bại.",
        placement: "topRight",
      });
      console.error("Error deleting all carts:", error);
    }
  };

  // Hàm xử lý khi chọn hoặc bỏ chọn sản phẩm
  const handleSelectItem = (selected, record) => {
    let updatedSelectedItems = [...selectedItems];
    if (selected) {
      updatedSelectedItems.push(record);
    } else {
      updatedSelectedItems = updatedSelectedItems.filter(
        (item) => item.key !== record.key
      );
    }
    setSelectedItems(updatedSelectedItems);
    updateTotals(updatedSelectedItems);
  };

  // Hàm xử lý khi chọn hoặc bỏ chọn tất cả sản phẩm
  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedItems(cartItems);
      updateTotals(cartItems);
    } else {
      setSelectedItems([]);
      updateTotals([]);
    }
  };

  // Hàm xử lý khi thay đổi số lượng sản phẩm
  const handleQuantityChange = (value, record) => {
    const newCartItems = cartItems.map((item) =>
      item.key === record.key
        ? { ...item, quantity: value, subtotal: item.price * value }
        : item
    );
    setCartItems(newCartItems);

    // Cập nhật lại tổng khi thay đổi số lượng sản phẩm
    const newSelectedItems = selectedItems.map((item) =>
      item.key === record.key
        ? { ...item, quantity: value, subtotal: item.price * value }
        : item
    );
    setSelectedItems(newSelectedItems);
    updateTotals(newSelectedItems);
  };

  // Hàm xử lý khi quay lại trang Home
  const handleGoHome = () => {
    navigate("/home"); // Điều hướng về trang Home
  };

  // Hàm cập nhật tổng tiền
  const updateTotals = (items) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);

    const discount = point ? 1000 : 0;
    setTotal(newSubtotal - discount);
    console.log("Subtotal:", newSubtotal.toLocaleString("vi-VN")); // Thêm console log
  };

  const handlePointChange = (e) => {
    setPoint(e.target.checked);
    updateTotals(selectedItems);
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)} // Checkbox "Chọn tất cả"
          checked={
            selectedItems.length === cartItems.length && cartItems.length > 0
          } // Nếu tất cả sản phẩm đã được chọn
        >
          Select all
        </Checkbox>
      ),
      dataIndex: "select",
      key: "select",
      width: "5%",
      render: (_, record) => (
        <Checkbox
          onChange={(e) => handleSelectItem(e.target.checked, record)}
          checked={selectedItems.some((item) => item.key === record.key)} // Kiểm tra sản phẩm có được chọn hay không
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "30%",
      render: (text, record) => (
        <div className="flex flex-col">
          <img src={record.imageUrl} alt={text} className="w-12 h-auto mb-2" />
          <span>{text}</span>
        </div>
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`, // Đổi thành VND và dùng toLocaleString để định dạng
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      render: (quantity, record) => (
        <InputNumber
          size="large"
          min={1}
          max={100000}
          value={quantity}
          onChange={(value) => handleQuantityChange(value, record)}
          className="border border-gray-300 rounded-md"
        />
      ),
    },

    {
      title: "Package",
      key: "package",
      width: "15%",
      render: (text, record) => (
        <span>{record.package}</span> // Chỉ hiển thị package hiện tại
      ),
    },

    {
      title: "Labs",
      key: "labs",
      width: "15%",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedLabs(record.labs);
            console.log("Selected labs:", record.labs); // Thêm console log
            setLabModalVisible(true);
          }}
        >
          View Labs
        </Button>
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      width: "15%",
      render: (subtotal) => `${subtotal.toLocaleString("vi-VN")} VND`, // Hiển thị theo VND
    },

    {
      title: "",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => deleteCart(record.packageId)} // Xóa theo packageId
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined
            style={{ cursor: "pointer", color: "red" }}
            className="hover:text-red-700 hover:scale-110"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-2/3 p-5">
      {/* Kiểm tra nếu giỏ hàng trống */}
      {cartItems.length === 0 && !loading ? (
        <div className="text-center my-10">
          <h2 className="text-xl font-semibold">Your shopping cart is empty</h2>
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            className="mt-5"
          >
            Return to Home
          </Button>
        </div>
      ) : (
        <>
          {/* Table for cart items */}
          <Table columns={columns} dataSource={cartItems} pagination={false} />
          <div className="flex justify-between mt-5">
            <Button
              type="default"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              className="h-10 bg-red-500 text-white font-semibold"
            >
              Continue Shopping
            </Button>

            {/* Nút Xóa tất cả sản phẩm */}
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tất cả các sản phẩm không?"
              onConfirm={deleteAllCarts} // Xóa tất cả sản phẩm
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                danger
                className="h-10 font-semibold"
                disabled={cartItems.length === 0} // Vô hiệu hóa nút nếu giỏ hàng trống
              >
                Delete all
              </Button>
            </Popconfirm>
          </div>

          {/* Cart Total section */}
          <Card
            title="Cart Total"
            className="border border-gray-300 rounded-md p-5 mt-16"
          >
            <div className="flex justify-between mb-3 font-medium">
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between mb-3 font-medium">
              <span>Total:</span>
              <span>{total.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between mb-3 font-medium">
              <span>Point:</span>
              <Checkbox checked={point} onChange={() => setPoint(!point)}>
                10 points
              </Checkbox>
            </div>
            <Button
              type="primary"
              className="w-full bg-red-500 text-white mt-3 font-semibold"
            >
              Proceed to checkout
            </Button>
          </Card>
        </>
      )}

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
