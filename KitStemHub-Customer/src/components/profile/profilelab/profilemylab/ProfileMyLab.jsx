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

      // Lấy trạng thái hỗ trợ từ API khác
      const supportResponse = await api.get(`labsupports/customers`);
      const labSupportStatus =
        supportResponse.data.details.data["lab-supports"];

      // Tạo đối tượng trạng thái hỗ trợ cho từng lab, lọc theo orderId
      const initialSupportStatus = labSupports.reduce((acc, lab) => {
        const supportData = labSupportStatus.find(
          (support) =>
            support["lab-id"] === lab.lab.id &&
            support["order-support-id"] === lab["order-support-id"]
        );
        // Kiểm tra trạng thái is-finished cho đúng lab trong đơn hàng
        acc[lab.lab.id] =
          supportData && !supportData["is-finished"] ? "fail" : "success";
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
    setSupportStatus((prevStatus) => ({
      ...prevStatus,
      [labId]: "fail", // Cập nhật trạng thái tạm thời là "Đang hỗ trợ"
    }));

    try {
      const response = await api.post(
        `labsupports/orders/${orderId}/packages/${packageId}/labs/${labId}`
      );
      console.log("ho troj: ", response.data);

      notification.success({
        message: response.data.detailss.message,
        duration: 3,
      });
      fetchLabData();
    } catch (error) {
      notification.error({
        message:
          error?.response?.data?.detailss?.errors["invalid-credentials"] ||
          "Bạn đã gửi yêu cầu hổ trợ cho bài lab này!",
        duration: 3,
      });
      console.log(
        error?.response.data?.detailss?.errors["invalid-credentials"]
      );
      // Nếu có lỗi, phục hồi trạng thái ban đầu
      setSupportStatus((prevStatus) => ({
        ...prevStatus,
        [labId]: "success",
      }));
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
          if (shippingStatus !== "GIAO HÀNG THÀNH CÔNG") {
            return null;
          }

          if (remainSupportTimes === 0) {
            return {
              disabled: true,
              children: "Đã hết số lần hỗ trợ",
              style: { backgroundColor: "#f5f5f5", color: "#d9d9d9" },
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
