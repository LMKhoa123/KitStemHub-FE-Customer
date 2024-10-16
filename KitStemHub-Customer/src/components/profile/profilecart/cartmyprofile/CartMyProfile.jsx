import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import api from "../../../../config/axios";
import { useNavigate } from "react-router-dom";

function CartMyProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/customers");
      setOrders(response.data.details.data.orders); // Lưu dữ liệu orders vào state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: "15%",
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
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default CartMyProfile;
