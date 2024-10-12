import { useState } from "react";
import { Modal, Button, Input, Form } from "antd";

function FormMyAddress() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    firstName: "Jane",
    lastName: "Doe",
    phoneNumber: "0123456789",
    address: "123 Example Street",
  });

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setAddressInfo({
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          address: values.address,
        });
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-white p-14 rounded-lg shadow-lg min-w-[700px] max-w-6xl mx-auto">
      <h1 className="mb-6 text-red-500 text-3xl font-medium">
        Thông tin địa chỉ giao hàng
      </h1>

      {/* Ô hiển thị thông tin địa chỉ giao hàng */}
      <div className="bg-gray-100 p-8 mb-6 rounded-lg text-xl">
        <p className="text-xl text-gray-700 font-semibold mb-6">
          Họ và tên:{" "}
          <span className="font-normal">{`${addressInfo.firstName} ${addressInfo.lastName}`}</span>
        </p>
        <p className="text-xl text-gray-700 font-semibold mb-6">
          Số điện thoại:{" "}
          <span className="font-normal">{`${addressInfo.phoneNumber}`}</span>
        </p>
        <p className="text-xl text-gray-700 font-semibold">
          Địa chỉ:{" "}
          <span className="font-normal">{`${addressInfo.address}`}</span>
        </p>
      </div>

      {/* Nút Thay đổi địa chỉ */}
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={showModal}
          className="flex bg-red-600 justify-center align-middle p-3 rounded-lg text-white font-medium w-32"
        >
          Thay đổi
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title={
          <span className="text-red-500 text-2xl">
            Chỉnh sửa địa chỉ giao hàng
          </span>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{
          className:
            "bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2",
        }}
        cancelButtonProps={{
          className: "text-gray-700 hover:text-red-600 font-medium",
        }}
        className="custom-modal"
      >
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              firstName: addressInfo.firstName,
              lastName: addressInfo.lastName,
              phoneNumber: addressInfo.phoneNumber,
              address: addressInfo.address,
            }}
          >
            <Form.Item
              label="Họ"
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
              <Input
                placeholder="Nhập họ"
                size="large"
                className="p-3 text-base rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Tên"
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input
                placeholder="Nhập tên"
                size="large"
                className="p-3 text-base rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^[0-9]+$/, message: "Vui lòng nhập số hợp lệ!" },
              ]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                size="large"
                className="p-3 text-base rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input
                placeholder="Nhập địa chỉ"
                size="large"
                className="p-3 text-base rounded-md"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default FormMyAddress;
