import { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import api from "../../../../config/axios";
import { useNavigate } from "react-router-dom";
import ProfileMyLab from "../../profilelab/profilemylab/ProfileMyLab";

function CartMyProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLabModalVisible, setIsLabModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Giao diện bắt đầu từ trang 1
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const pageSize = 20; // Số lượng order trên mỗi trang

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      // Lấy dữ liệu từ API, giảm `page` để phù hợp với zero-based indexing của API
      const response = await api.get(`orders/customers?page=${page - 1}`);
      console.log(response.data);
      const { data } = response.data.details;

      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders); // Cập nhật danh sách đơn hàng
        setTotalPages(data["total-pages"]); // Cập nhật tổng số trang từ API
        setCurrentPage(data["current-page"] + 1); // Điều chỉnh `current-page` để phù hợp với giao diện
        console.log("Updated currentPage:", data["current-page"] + 1);
      } else {
        setOrders([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage); // Gọi API khi trang hiện tại thay đổi
  }, [currentPage]);

  const handleTableChange = (pagination) => {
    const page = pagination?.current;
    console.log("Changing to page:", page);
    setCurrentPage(page);
    fetchOrders(page);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  };

  const renderShippingStatus = (status) => {
    let colorClass = "";

    switch (status) {
      case "ĐÃ XÁC NHẬN":
        colorClass = "bg-blue-100 text-blue-500 border border-blue-500";
        break;
      case "ĐANG GIAO HÀNG":
        colorClass = "bg-orange-100 text-orange-600 border border-orange-600";
        break;
      case "GIAO HÀNG THÀNH CÔNG":
        colorClass = "bg-green-100 text-green-600 border border-green-600";
        break;
      case "GIAO HÀNG THẤT BẠI":
        colorClass = "bg-red-100 text-red-600 border border-red-600";
        break;
      case "CHỜ XÁC NHẬN":
        colorClass = "bg-gray-100 text-gray-600 border border-gray-600";
        break;
      default:
        colorClass = "bg-gray-500 text-white";
    }

    return (
      <span
        className={`p-1 ${colorClass} rounded-lg block text-center w-40 shadow-xl`}
      >
        {status}
      </span>
    );
  };
  const handleViewDetail = (record) => {
    navigate(`/order/${record.id}`, { state: { orderId: record.id } });
  };

  const showLabModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsLabModalVisible(true);
  };

  const handleLabModalClose = () => {
    setIsLabModalVisible(false);
  };

  const handleShowNoteModal = (note) => {
    setSelectedNote(note);
    setIsNoteModalVisible(true);
  };

  const handleNoteModalClose = () => {
    setIsNoteModalVisible(false);
  };

  const columns = [
    {
      title: "Đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 400,
    },
    {
      title: "Thời gian đặt hàng",
      dataIndex: "created-at",
      key: "created-at",
      render: (text) => formatDateTime(text),
      width: 150,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shipping-address",
      key: "shipping-address",
      width: 400,
    },
    {
      title: "Trạng thái giao hàng",
      dataIndex: "shipping-status",
      key: "shipping-status",
      render: (status) => renderShippingStatus(status),
      width: 100,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total-price",
      key: "total-price",
      render: (price) => price.toLocaleString("vi-VN") + " VND",
      width: 100,
    },
    {
      title: "Xem Lab & Hỗ trợ",
      key: "lab-support",
      width: 100,
      render: (record) => (
        <Button type="primary" onClick={() => showLabModal(record.id)}>
          Xem
        </Button>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 70,
      render: (note) =>
        note ? (
          <Button type="link" onClick={() => handleShowNoteModal(note)}>
            Xem Ghi Chú
          </Button>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Chi tiết đơn hàng",
      key: "action",
      render: (record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Chi Tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white p-14 max-w-7xl shadow-lg rounded mb-6 ">
      <h1 className="text-2xl font-semibold mb-6">Đơn hàng của bạn</h1>
      <Table
        dataSource={orders} // Hiển thị danh sách đơn hàng
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          total: totalPages * pageSize,
          pageSize: pageSize,
          showSizeChanger: false,
        }}
        onChange={(pagination) => handleTableChange(pagination)} // Gắn onChange trực tiếp
      />

      <Modal
        title="Chi tiết hỗ trợ"
        visible={isLabModalVisible}
        onCancel={handleLabModalClose}
        footer={null}
        width={800}
      >
        <ProfileMyLab orderId={selectedOrderId} />
      </Modal>

      <Modal
        title="Ghi chú đơn hàng"
        visible={isNoteModalVisible}
        onCancel={handleNoteModalClose}
        footer={[
          <Button key="close" onClick={handleNoteModalClose}>
            Đóng
          </Button>,
        ]}
      >
        <p>{selectedNote}</p>
      </Modal>
    </div>
  );
}

export default CartMyProfile;
