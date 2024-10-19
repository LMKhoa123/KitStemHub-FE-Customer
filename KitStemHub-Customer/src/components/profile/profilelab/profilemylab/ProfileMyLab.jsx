/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Table, Button, notification } from "antd";
import api from "../../../../config/axios";

function ProfileMyLab({ orderId }) {
  const [labData, setLabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportStatus, setSupportStatus] = useState({}); // Trạng thái hỗ trợ của từng lab

  // Gọi API để lấy thông tin lab dựa vào orderId
  const fetchLabData = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      const labSupports = response.data.details.data.order["order-supports"];
      console.log("API Response for order supports:", labSupports); // Log response để kiểm tra cấu trúc

      // Thiết lập trạng thái hỗ trợ ban đầu (mặc định là 'success')
      const initialSupportStatus = labSupports.reduce((acc, lab) => {
        acc[lab.lab.id] = "success"; // Trạng thái mặc định là "success"
        return acc;
      }, {});

      setSupportStatus(initialSupportStatus); // Lưu trạng thái hỗ trợ ban đầu
      setLabData(labSupports); // Lưu dữ liệu lab từ order-supports
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lab data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      console.log("Received orderId in ProfileMyLab:", orderId);
      fetchLabData(); // Gọi API khi có orderId
    }
  }, [orderId]);

  // Hàm gọi API hỗ trợ lab
  const handleSupport = async (labId, packageId) => {
    // Đặt trạng thái thành "fail" (Đang hỗ trợ) ngay khi bấm nút
    setSupportStatus((prevStatus) => ({
      ...prevStatus,
      [labId]: "fail", // Đang hỗ trợ
    }));
    try {
      // Kiểm tra các tham số truyền vào
      console.log("Calling support API with:");
      console.log("Order ID:", orderId);
      console.log("Lab ID:", labId);
      console.log("Package ID:", packageId);

      const response = await api.post(
        `/labsupports/orders/${orderId}/packages/${packageId}/labs/${labId}`
      );

      console.log("API Response for lab support:", response.data); // Log response để kiểm tra cấu trúc

      // Hiển thị thông báo thành công
      notification.destroy();
      notification.success({
        message: response.data.detail.message,
        duration: 3,
      });
    } catch (error) {
      console.error("Error in supporting lab:", error);

      // Hiển thị thông báo lỗi
      notification.destroy();
      notification.error({
        message: error.response?.data?.detail?.message || "Có lỗi xảy ra!",
        duration: 3,
      });
    }
  };

  // Cấu hình các cột của bảng trong modal
  const columns = [
    {
      title: "Tên Lab",
      dataIndex: ["lab", "name"], // Tên lab từ order-supports
      key: "lab-name",
    },
    {
      title: "Tên Kit",
      dataIndex: ["lab", "kit", "name"], // Tên kit từ order-supports
      key: "kit-name",
    },
    {
      title: "Tên Package",
      dataIndex: ["package", "name"], // Tên package từ order-supports
      key: "package-name",
    },
    {
      title: "Số lần hỗ trợ còn lại",
      dataIndex: "remain-support-times", // remain-support-times từ order-supports
      key: "remain-support-times",
    },
    {
      title: "Hỗ trợ",
      key: "support",
      render: (record) => {
        const status = supportStatus[record.lab.id];
        const remainSupportTimes = record["remain-support-times"];

        // Thiết lập màu sắc và nội dung nút dựa trên trạng thái hỗ trợ
        const getButtonProps = () => {
          if (remainSupportTimes === 0) {
            return {
              disabled: true,
              children: "Đã hết số lần hỗ trợ",
              style: { backgroundColor: "#f5f5f5", color: "#d9d9d9" },
            };
          }

          if (status === "fail") {
            return {
              disabled: true,
              children: "Đang hỗ trợ",
              style: { backgroundColor: "orange", color: "white" },
            };
          }
          return {
            disabled: false,
            children: "Hỗ trợ",
            onClick: () => handleSupport(record.lab.id, record.package.id),
          };
        };

        return <Button type="primary" {...getButtonProps()} />;
      },
    },
  ];

  return (
    <Table
      dataSource={labData}
      columns={columns}
      rowKey="lab.id"
      loading={loading}
      pagination={false}
    />
  );
}

export default ProfileMyLab;
