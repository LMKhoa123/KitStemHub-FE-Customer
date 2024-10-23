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
      const response = await api.get(`/orders/customers?page=${page - 1}`);
      const { data } = response.data.details;

      // Kiểm tra dữ liệu trả về và cập nhật state
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders); // Cập nhật đơn hàng
        setTotalPages(data["total-pages"]); // Cập nhật tổng số trang
      } else {
        setOrders([]); // Đảm bảo orders là một mảng rỗng nếu không có dữ liệu
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
    const page = pagination.current; // Trang hiện tại được chọn từ giao diện người dùng
    setCurrentPage(page); // Cập nhật trang hiện tại (hiển thị)
    fetchOrders(page); // Gọi API với trang chính xác
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  };

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
      <h1 className="text-2xl font-semibold mb-6">Đơn hàng của bạn</h1>
      <Table
        dataSource={orders} // Hiển thị danh sách đơn hàng
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage, // Hiển thị trang hiện tại, bắt đầu từ 1
          total: totalPages * pageSize, // Tổng số lượng đơn hàng
          pageSize: pageSize, // Số lượng bản ghi trên mỗi trang
          onChange: handleTableChange, // Xử lý khi người dùng chuyển trang
        }}
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
