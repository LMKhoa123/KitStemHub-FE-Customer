import {
  ArrowRightOutlined,
  DeleteOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Table,
  Button,
  Card,
  InputNumber,
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
  const [loading, setLoading] = useState(true); // Trạng thái tải

  // Fetch dữ liệu từ API khi component render
  const fetchCartData = async () => {
    try {
      // Gọi API để lấy dữ liệu từ giỏ hàng
      const cartResponse = await api.get("carts");
      const kitsResponse = await api.get("kits");

      const kitsData = kitsResponse.data.details.data.kits;

      // Tìm ảnh kit dựa trên kitId
      const findKitImage = (kitId) => {
        const kit = kitsData.find((kit) => kit.id === kitId);
        return kit
          ? kit["kit-images"][0].url
          : "https://via.placeholder.com/150"; // Nếu không có ảnh thì hiển thị placeholder
      };

      const cartsData = cartResponse.data.details.data.carts.map(
        (item, index) => ({
          key: index.toString(),
          packageId: item.package["package-id"], // Sử dụng packageId để thao tác với giỏ hàng
          kitId: item.package.kit.id, // Sử dụng kitId để lấy ảnh
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
      setLoading(false); // Đặt trạng thái tải về false khi dữ liệu đã được fetch
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Gọi lại updateTotals khi cartItems thay đổi
  useEffect(() => {
    updateTotals(cartItems);
  }, [cartItems]);

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
      const updatedCartItems = cartItems.filter(
        (item) => item.packageId !== packageId
      );

      // Cập nhật lại giỏ hàng trong state
      setCartItems(updatedCartItems);

      // Gửi sự kiện cartUpdate để cập nhật badge
      const cartEvent = new CustomEvent("cartUpdate", {
        detail: updatedCartItems.length,
      });
      window.dispatchEvent(cartEvent);

      // Cập nhật lại tổng sau khi xóa sản phẩm
      updateTotals(updatedCartItems); // Cập nhật lại tổng sau khi xóa
    } catch (error) {
      notification.error({
        message: "Thất bại",
        description: "Xóa sản phẩm khỏi giỏ hàng thất bại.",
        placement: "topRight",
      });
      console.error("Error deleting cart:", error.response || error.message);
    }
  };

  // Hàm xóa tất cả sản phẩm trong giỏ hàng
  // const deleteAllCarts = async () => {
  //   try {
  //     await api.delete("carts"); // Gọi API xóa tất cả sản phẩm
  //     notification.success({
  //       message: "Thành công",
  //       description: "Tất cả sản phẩm đã được xóa khỏi giỏ hàng.",
  //       placement: "topRight",
  //     });
  //     setCartItems([]);
  //     updateTotals([]);
  //     localStorage.removeItem("cart"); // Xóa giỏ hàng trong localStorage

  //     // Phát sự kiện để cập nhật badge giỏ hàng
  //     const cartEvent = new Event("cartUpdate");
  //     window.dispatchEvent(cartEvent);
  //   } catch (error) {
  //     notification.error({
  //       message: "Thất bại",
  //       description: "Xóa tất cả sản phẩm khỏi giỏ hàng thất bại.",
  //       placement: "topRight",
  //     });
  //     console.error("Error deleting all carts:", error);
  //   }
  // };

  // Hàm xử lý khi thay đổi số lượng sản phẩm
  const handleQuantityChange = async (value, record) => {
    const newCartItems = cartItems.map((item) =>
      item.key === record.key
        ? { ...item, quantity: value, subtotal: item.price * value }
        : item
    );

    setCartItems(newCartItems);
    updateTotals(newCartItems);

    try {
      // Gửi request PUT để cập nhật số lượng sản phẩm
      await api.put("carts", {
        "package-id": record.packageId,
        "package-quantity": value,
      });

      // Hiển thị thông báo thành công
      // notification.success({
      //   message: "Thành công",
      //   description: "Số lượng sản phẩm đã được cập nhật.",
      //   placement: "topRight",
      // });

      // Sau khi thay đổi số lượng, phát lại sự kiện cartUpdate với số loại sản phẩm
      const cartEvent = new CustomEvent("cartUpdate", {
        detail: cartItems.length, // Đếm số loại sản phẩm
      });
      window.dispatchEvent(cartEvent);
    } catch (error) {
      // // Hiển thị thông báo lỗi
      // notification.error({
      //   message: "Thất bại",
      //   description: "Cập nhật số lượng sản phẩm thất bại.",
      //   placement: "topRight",
      // });
      console.error(
        "Error updating quantity:",
        error.response || error.message
      );
    }
  };

  // Hàm xử lý khi quay lại trang Home
  const handleGoHome = () => {
    navigate("/home"); // Điều hướng về trang Home
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const updateTotals = (items) => {
    if (items.length === 0) return; // Nếu không có sản phẩm thì không cần tính
    const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal);
  };

  const columns = [
    {
      title: "Sản phẩm",
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`, // Đổi thành VND và dùng toLocaleString để định dạng
    },

    {
      title: "Số lượng",
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
      title: "Gói",
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
          Xem Labs
        </Button>
      ),
    },
    {
      title: "Tổng cộng",
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
          <h2 className="text-xl font-semibold">Giỏ hàng của bạn đang trống</h2>
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            className="mt-5"
          >
            Quay lại trang chủ
          </Button>
        </div>
      ) : (
        <>
          {/* Table for cart items */}
          <Table columns={columns} dataSource={cartItems} pagination={false} />
          <div className="flex justify-between items-center mt-5">
            <Button
              type="red"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              className="h-10 bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Tiếp tục mua sắm
            </Button>

            <div className="flex items-center gap-4">
              <Button
                type="red"
                className="h-10 bg-red-500 text-white font-semibold hover:bg-red-600 flex items-center"
                onClick={handleProceedToCheckout}
              >
                Tiến hành thanh toán <ArrowRightOutlined className="ml-2" />
              </Button>
            </div>
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
        </>
      )}
    </div>
  );
}

export default CartContent;
