import { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import api from "../../../../config/axios";
import { useNavigate } from "react-router-dom";
import ProfileMyLab from "../../profilelab/profilemylab/ProfileMyLab";

function CartMyProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLabModalVisible, setIsLabModalVisible] = useState(false); // State to control modal visibility
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store selected orderId for labs
  const [selectedNote, setSelectedNote] = useState(null); // State to store selected note
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false); // State to control note modal visibility
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async (page = 0) => {
    try {
      const response = await api.get(`/orders/customers?page=${page}`);
      const { data } = response.data.details;
      setOrders(data.orders);
      setTotalPages(data["total-pages"]);
      setCurrentPage(data["current-page"]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage); // Lấy dữ liệu khi component được render hoặc khi currentPage thay đổi
  }, [currentPage]);

  const handleTableChange = (pagination) => {
    const page = pagination.current - 1;
    fetchOrders(page);
  };

  // Xử lý format ngày tháng và giờ
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  };

  // Xử lý trạng thái giao hàng với màu sắc khác nhau
  const renderShippingStatus = (status) => {
    let colorClass = "bg-gray-500";
    if (status === "GIAO HÀNG THÀNH CÔNG") colorClass = "bg-green-600";
    if (status === "GIAO HÀNG THẤT BẠI") colorClass = "bg-red-600";
    if (status === "ĐANG GIAO HÀNG") colorClass = "bg-slate-600";
    return (
      <span
        className={`p-1 ${colorClass} rounded-lg text-white block text-center w-40 shadow-xl`}
      >
        {status}
      </span>
    );
  };

  const handleViewDetail = (record) => {
    navigate(`/order/${record.id}`, { state: { orderId: record.id } });
  };

  // Hàm mở modal và truyền orderId
  const showLabModal = (orderId) => {
    setSelectedOrderId(orderId); // Lưu orderId để truyền vào modal
    setIsLabModalVisible(true); // Hiển thị modal
  };

  const handleLabModalClose = () => {
    setIsLabModalVisible(false); // Đóng modal
  };

  // Hàm mở modal ghi chú và hiển thị ghi chú
  const handleShowNoteModal = (note) => {
    setSelectedNote(note); // Lưu ghi chú đã chọn
    setIsNoteModalVisible(true); // Hiển thị modal ghi chú
  };

  const handleNoteModalClose = () => {
    setIsNoteModalVisible(false); // Đóng modal ghi chú
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Đơn hàng",
      dataIndex: "id",
      key: "id",
      width: "20%",
    },
    {
      title: "Thời gian đặt hàng",
      dataIndex: "created-at",
      key: "created-at",
      render: (text) => formatDateTime(text),
      width: "10%",
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shipping-address",
      key: "shipping-address",
      width: "20%",
    },
    {
      title: "Trạng thái giao hàng",
      dataIndex: "shipping-status",
      key: "shipping-status",
      render: (status) => renderShippingStatus(status),
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total-price",
      key: "total-price",
      render: (price) => price.toLocaleString("vi-VN") + " VND",
      width: "15%",
    },
    {
      title: "Xem Lab & Hỗ trợ",
      key: "lab-support",
      width: "10%",
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
      width: "5%",
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
    <div className="bg-white p-14 max-w-6xl shadow-lg rounded mb-6 ">
      {/* Hiển thị bảng đơn hàng */}
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage + 1,
          total: totalPages * 5,
          pageSize: 5,
          onChange: (page) => handleTableChange({ current: page }),
        }}
      />

      {/* Modal xem Lab & Hỗ trợ */}
      <Modal
        title="Chi tiết hỗ trợ"
        visible={isLabModalVisible}
        onCancel={handleLabModalClose}
        footer={null} // Remove default footer
        width={800} // Set width of modal
      >
        {/* Gọi ProfileMyLab và truyền selectedOrderId */}
        <ProfileMyLab orderId={selectedOrderId} />
      </Modal>

      {/* Modal hiển thị ghi chú */}
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
