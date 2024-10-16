import { Tabs, Input, Table, Button, Form, Modal } from "antd";
import { useState } from "react";
import api from "../../../../config/axios";
import { toast } from "react-toastify";

const { TabPane } = Tabs;

function ProfileMyLab() {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [isOrderFound, setIsOrderFound] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading

  const fetchOrderData = async (id) => {
    try {
      const response = await api.get(`orders/${id}`);
      const result = response.data;

      if (result.details && result.details.data && result.details.data.order) {
        setOrderData(result.details.data.order["package-orders"]);
        setSelectedOrderId(id); // Lưu lại orderId để dùng khi hỗ trợ
        setIsOrderFound(true);
      } else {
        setIsOrderFound(false);
      }
    } catch (error) {
      if (error.response) {
        console.log("Error Response Data:", error.response.data);
        console.log("Error Response Status:", error.response.status);
        console.log("Error Response Headers:", error.response.headers);
      } else if (error.request) {
        console.log("Error Request:", error.request);
      } else {
        console.log("Error", error.message);
      }
      console.error("Lỗi khi gọi API:", error);
      setIsOrderFound(false);
    }
  };

  const handleSearch = () => {
    if (orderId) {
      fetchOrderData(orderId);
    }
  };

  const columns = [
    {
      title: "Tên Lab",
      dataIndex: ["package", "package-labs", 0, "name"],
      key: "lab-name",
    },
    {
      title: "Tên Kit",
      dataIndex: ["package", "kit", "name"],
      key: "kit-name",
    },
    {
      title: "Tên Package",
      dataIndex: ["package", "name"],
      key: "package-name",
    },
    {
      title: "Số lần hỗ trợ",
      dataIndex: "remain-support-times",
      key: "remain-support-times",
    },
    {
      title: "Hỗ trợ",
      key: "support",
      render: (record) => (
        <Button
          type="primary"
          onClick={() =>
            handleSupportClick(
              record.package["package-labs"][0],
              record.package
            )
          }
        >
          Hỗ trợ
        </Button>
      ),
    },
  ];

  const handleSupportClick = (lab, pkg) => {
    setSelectedLab(lab);
    setSelectedPackage(pkg);
    setIsModalVisible(true); // Hiển thị modal xác nhận
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setLoading(true); // Bắt đầu loading

    try {
      // Log ra thông tin trước khi gọi API
      console.log("Order ID:", selectedOrderId);
      console.log("Package ID:", selectedPackage.id);
      console.log("Lab ID:", selectedLab.id);

      // Gọi API để tạo yêu cầu hỗ trợ (POST request)
      const response = await api.post(
        `/labsupports/orders/${selectedOrderId}/packages/${selectedPackage.id}/labs/${selectedLab.id}`
      );

      // Nếu thành công, thông báo thành công
      if (response.data.status === "success") {
        toast.success("Yêu cầu hỗ trợ đã được gửi thành công!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      // Kiểm tra lỗi từ API
      if (error.response) {
        const errorData = error.response.data;

        console.log("Error Response Data:", errorData);
        console.log("Error Response Status:", error.response.status);

        // Nếu lỗi là do "invalid-credentials" (yêu cầu đã được gửi trước đó)
        if (
          errorData.detail &&
          errorData.detail.errors &&
          errorData.detail.errors["invalid-credentials"]
        ) {
          toast.error(`Lỗi: ${errorData.detail.errors["invalid-credentials"]}`);
        } else {
          // Hiển thị lỗi khác nếu không phải "invalid-credentials"
          toast.error(
            `Lỗi ${error.response.status}: ${errorData.detail.message || "Vui lòng thử lại."}`
          );
        }
      } else if (error.request) {
        // Nếu không có phản hồi từ máy chủ
        console.error("No response from server:", error.request);
        toast.error("Không có phản hồi từ máy chủ. Vui lòng thử lại sau.");
      } else {
        // Các lỗi khác như lỗi khi cấu hình yêu cầu
        console.error("Error:", error.message);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal nếu người dùng hủy
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tab 1" key="1">
          <div className="p-4">
            <Form layout="inline">
              <Form.Item label="Nhập OrderId">
                <Input
                  placeholder="Nhập OrderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  style={{ width: 300 }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Form>

            {isOrderFound ? (
              <Table
                dataSource={orderData}
                columns={columns}
                rowKey="package-id"
                pagination={{ pageSize: 5 }}
                className="mt-4"
              />
            ) : (
              <div className="mt-4">Không tìm thấy OrderId.</div>
            )}
          </div>
        </TabPane>

        <TabPane tab="Tab 2" key="2">
          <div className="p-4">
            <h3>Tab 2: Nội dung khác</h3>
            <p>Đây là nội dung placeholder cho Tab 2. Bạn có thể thay đổi.</p>
          </div>
        </TabPane>
      </Tabs>

      {/* Modal xác nhận */}
      <Modal
        title="Xác nhận hỗ trợ"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
        confirmLoading={loading} // Thêm trạng thái loading cho nút OK
      >
        <p>
          Bạn có chắc chắn muốn hỗ trợ cho Lab: {selectedLab?.name} trong gói{" "}
          {selectedPackage?.name} không?
        </p>
      </Modal>
    </>
  );
}

export default ProfileMyLab;
