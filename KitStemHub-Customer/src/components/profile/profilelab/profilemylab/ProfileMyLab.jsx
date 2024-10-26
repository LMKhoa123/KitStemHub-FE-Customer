/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Table, Button, notification } from "antd";
import api from "../../../../config/axios";

function ProfileMyLab({ orderId }) {
  const [labData, setLabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportStatus, setSupportStatus] = useState({});
  const [shippingStatus, setShippingStatus] = useState(""); // Thêm state cho trạng thái giao hàng

  // Gọi API để lấy thông tin lab dựa vào orderId
  const fetchLabData = async () => {
    try {
      const response = await api.get(`orders/${orderId}`);
      const labSupports = response.data.details.data.order["order-supports"];
      const orderDetails = response.data.details.data.order;

      // Lấy trạng thái giao hàng
      setShippingStatus(orderDetails["shipping-status"]); // Lưu trạng thái giao hàng vào state

      // Kiểm tra trạng thái từ localStorage
      const storedStatus =
        JSON.parse(localStorage.getItem("supportStatus")) || {};

      // Lưu trạng thái từ API hoặc localStorage
      const initialSupportStatus = labSupports.reduce((acc, lab) => {
        acc[lab.lab.id] = storedStatus[lab.lab.id] || "success"; // Nếu có trạng thái từ localStorage, dùng nó
        return acc;
      }, {});

      setSupportStatus(initialSupportStatus);
      setLabData(labSupports);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lab data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchLabData();
    }
  }, [orderId]);

  // Hàm hỗ trợ lab
  const handleSupport = async (labId, packageId) => {
    setSupportStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus, [labId]: "fail" };
      localStorage.setItem("supportStatus", JSON.stringify(updatedStatus));
      return updatedStatus;
    });

    try {
      const response = await api.post(
        `labsupports/orders/${orderId}/packages/${packageId}/labs/${labId}`
      );

      notification.success({
        message: response.data.detailss.message,
        duration: 3,
      });
    } catch (error) {
      notification.error({
        message: error.response?.data?.detailss?.message || "Có lỗi xảy ra!",
        duration: 3,
      });

      // Khôi phục trạng thái nếu lỗi
      setSupportStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus, [labId]: "success" };
        localStorage.setItem("supportStatus", JSON.stringify(updatedStatus));
        return updatedStatus;
      });
    }
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Tên Lab",
      dataIndex: ["lab", "name"],
      key: "lab-name",
    },
    {
      title: "Tên Kit",
      dataIndex: ["lab", "kit", "name"],
      key: "kit-name",
    },
    {
      title: "Tên Package",
      dataIndex: ["package", "name"],
      key: "package-name",
    },
    {
      title: "Số lần hỗ trợ còn lại",
      dataIndex: "remain-support-times",
      key: "remain-support-times",
    },
    {
      title: "Hỗ trợ",
      key: "support",
      render: (record) => {
        const status = supportStatus[record.lab.id];
        const remainSupportTimes = record["remain-support-times"];

        // Cấu hình nút Hỗ trợ
        const getButtonProps = () => {
          if (shippingStatus !== "ĐÃ XÁC NHẬN") {
            return null;
          }

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

        const buttonProps = getButtonProps();
        return buttonProps ? <Button type="primary" {...buttonProps} /> : null;
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
