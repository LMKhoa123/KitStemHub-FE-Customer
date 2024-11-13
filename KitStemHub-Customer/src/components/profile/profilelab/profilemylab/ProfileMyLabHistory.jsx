import { notification, Table, Rate, Input, Button, Tag, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../../config/axios";

function ProfileMyLabHistory() {
  const [dataSource, setDataSource] = useState([]); // Dữ liệu lab supports
  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại, hiển thị từ 1
    pageSize: 20, // Số bản ghi trên mỗi trang
    total: 0, // Tổng số bản ghi
  });
  const [feedbacks, setFeedbacks] = useState({}); // Lưu trữ phản hồi của người dùng
  const [ratings, setRatings] = useState({}); // Lưu trữ đánh giá của người dùng

  const fetchLabSupports = async (page = 0, pageSize = 20) => {
    try {
      const response = await api.get("/labsupports/customers", {
        params: {
          page: page,
          supported: true, // Thêm tham số supported=true
        },
      });

      if (response?.data?.details?.data) {
        const labSupportsData = response.data.details.data["lab-supports"];
        const totalPages = response.data.details.data["total-pages"] || 0;
        const currentPage = response.data.details.data["current-page"] || 0;

        if (labSupportsData.length > 0) {
          // Cập nhật dữ liệu bảng
          setDataSource(labSupportsData);
          setPagination({
            total: totalPages * pageSize,
            current: currentPage,
            pageSize: pageSize,
          });
        } else {
          setDataSource([]); // Không có dữ liệu
        }
      }
    } catch (error) {
      console.error(error.response.data.details.message);
    }
  };

  useEffect(() => {
    fetchLabSupports(pagination.current - 1, pagination.pageSize); // Gọi API với tham số supported=true
  }, [pagination.current]); // Thêm phụ thuộc vào pagination.current để gọi lại API khi trang thay đổi

  // Hàm xử lý khi người dùng thay đổi đánh giá (sao)
  const handleRateChange = (id, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [id]: value,
    }));
  };

  // Hàm xử lý khi người dùng nhập feedback
  const handleFeedbackChange = (id, value) => {
    setFeedbacks((prevFeedbacks) => ({
      ...prevFeedbacks,
      [id]: value,
    }));
  };

  // Hàm lưu đánh giá và nhận xét
  const handleSaveFeedback = async (id) => {
    const rating = ratings[id];
    const feedback = feedbacks[id];

    try {
      // Gọi API PUT request để lưu đánh giá và nhận xét
      const response = await api.put("/labsupports/review", {
        id, // ID của bản ghi
        rating, // Đánh giá của người dùng
        "feed-back": feedback, // Phản hồi của người dùng
      });
      message.success(response?.data.details.message);
    } catch (error) {
      // Nếu có lỗi xảy ra
      console.error("Error:", error.response?.data || error);
      message.error(error.response?.data.details.message);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Nhân Viên Hỗ Trợ",
      key: "staff",
      render: (_, record) => {
        const firstName = record.staff["first-name"];
        const lastName = record.staff["last-name"];
        const email = record.staff["email"];
        return firstName && lastName && email
          ? `${lastName} ${firstName} 
           ${email}`.trim()
          : "Chưa có";
      },
      width: 300,
    },
    {
      title: "Ngày",
      dataIndex: "created-at",
      key: "created-at",
      render: (text) => formatDateTime(text),
      width: 250,
    },
    {
      title: "Tên Lab",
      dataIndex: ["lab", "name"],
      key: "lab-name",
      width: 250,
    },
    {
      title: "Tên Kit",
      dataIndex: ["package", "kit", "name"],
      key: "kit-name",
      width: 250,
    },
    {
      title: "Tên Package",
      dataIndex: ["package", "name"],
      key: "package-name",
      width: 200,
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating, record) => (
        <Rate
          value={ratings[record.id] || rating} // Hiển thị đánh giá hiện tại
          onChange={(value) => handleRateChange(record.id, value)} // Cập nhật đánh giá khi người dùng thay đổi
          defaultValue={0}
          max={5}
          className="inline-block whitespace-nowrap" // Sử dụng Tailwind CSS
        />
      ),
      width: 150,
    },
    {
      title: "Nhận Xét",
      dataIndex: "feed-back",
      key: "feed-back",
      render: (feedback, record) => (
        <>
          <Input.TextArea
            value={feedbacks[record.id] || feedback} // Hiển thị nhận xét hiện tại
            onChange={(e) => handleFeedbackChange(record.id, e.target.value)} // Cập nhật nhận xét khi người dùng thay đổi
            placeholder="Nhập nhận xét của bạn"
            rows={3}
          />
          <Button
            type="primary"
            className="mt-2"
            onClick={() => handleSaveFeedback(record.id)} // Lưu khi bấm nút
          >
            Gửi
          </Button>
        </>
      ),
      width: 300,
    },
    {
      title: "Trạng Thái",
      dataIndex: "is-finished",
      key: "is-finished",
      render: (isFinished) => (
        <Tag
          color={isFinished ? "green" : "red"}
          className="px-2 py-1 text-sm font-medium rounded-full"
        >
          {isFinished ? "Hoàn thành" : "Chưa hoàn thành"}
        </Tag>
      ),
      width: 150,
    },
  ];

  return (
    <div className="bg-white p-10 w-full shadow-lg rounded mb-32">
      <h1 className="text-2xl font-semibold mb-6">Lịch sử hỗ trợ</h1>

      <Table
        dataSource={dataSource} // Dữ liệu từ API
        columns={columns} // Cấu trúc các cột
        rowKey="id" // Khóa duy nhất cho mỗi dòng
        pagination={{
          total: pagination.total, // Tổng số bản ghi
          current: pagination.current, // Trang hiện tại
          pageSize: pagination.pageSize, // Số bản ghi trên mỗi trang
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, current: page })), // Thay đổi trang
        }}
      />
    </div>
  );
}

export default ProfileMyLabHistory;
