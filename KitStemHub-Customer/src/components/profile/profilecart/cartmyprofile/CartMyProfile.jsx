import { useState, useEffect } from "react";
import { Table, Button, Modal, Space, DatePicker } from "antd";
import api from "../../../../config/axios";
import { useNavigate } from "react-router-dom";
import ProfileMyLab from "../../profilelab/profilemylab/ProfileMyLab";

function CartMyProfile() {
  const [orders, setOrders] = useState([]);
  const [isLabModalVisible, setIsLabModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Giao diện bắt đầu từ trang 1
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const pageSize = 20; // Số lượng order trên mỗi trang
  const [filters, setFilters] = useState({
    createdFrom: null,
    createdTo: null,
  });

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async (page = 1) => {
    try {
      const params = {
        page: page - 1,
      };

      if (filters.createdFrom) {
        params["created-from"] = filters.createdFrom.format("YYYY-MM-DD");
      }
      if (filters.createdTo) {
        params["created-to"] = filters.createdTo.format("YYYY-MM-DD");
      }

      const response = await api.get("orders/customers", { params });

      const { data } = response.data.details;

      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        setTotalPages(data["total-pages"]);
        setCurrentPage(data["current-page"] + 1);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error.response.data.details.message);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, filters]);

  const handleTableChange = (pagination) => {
    const page = pagination?.current;
    console.log("Changing to page:", page);
    setCurrentPage(page);
    fetchOrders(page);
  };

  const handleDateChange = (dates) => {
    setFilters({
      createdFrom: dates ? dates[0] : null,
      createdTo: dates ? dates[1] : null,
    });
    setCurrentPage(1);
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
      width: 300,
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
      width: 150,
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
      width: 100,
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
    <div className="bg-white p-10 w-full shadow-lg rounded mb-32">
      <h1 className="text-2xl font-semibold mb-3">Đơn hàng của bạn</h1>
      <Space className="mb-3 flex justify-end">
        <DatePicker.RangePicker
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          value={[filters.createdFrom, filters.createdTo]}
        />
      </Space>
      <Table
        dataSource={orders} // Hiển thị danh sách đơn hàng
        columns={columns}
        rowKey="id"
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
