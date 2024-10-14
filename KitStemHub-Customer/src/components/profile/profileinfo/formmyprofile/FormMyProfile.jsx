import { useEffect, useState } from "react";
import api from "../../../../config/axios";
import Swal from "sweetalert2";

function FormMyProfile() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "", // Thêm phoneNumber vào state
    address: "",
    points: 0,
  });
  const [isUpdated, setIsUpdated] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await api.get("users/profile");
      console.log("Lấy dữ liệu thành công", response.data);

      const userProfile = response.data.details.data["user-profile-dto"];

      setProfileData({
        firstName: userProfile["first-name"] || "",
        lastName: userProfile["last-name"] || "",
        userName: userProfile["user-name"] || "",
        phoneNumber: userProfile["phone-number"] || "", // Lấy phoneNumber từ API
        address: userProfile["address"] || "",
        points: userProfile["points"] || 0,
      });
    } catch (error) {
      console.log("Lấy dữ liệu thất bại", error);
    }
  };

  // Update profile data (PUT request)
  const updateProfile = async () => {
    // Chỉ gửi những trường cần thiết
    const cleanData = {
      "first-name": profileData.firstName || "",
      "last-name": profileData.lastName || "",
      "phone-number": profileData.phoneNumber || "",
      address: profileData.address || "",
    };

    console.log("Payload gửi đi:", cleanData);

    try {
      const response = await api.put("users/profile", cleanData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")?.replaceAll('"', "")}`,
        },
      });
      console.log("Profile updated successfully", response.data);
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then((result) => {
        if (result.isConfirmed) {
          setProfileData(response.data);
          setIsUpdated(true);
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      console.log("Error updating profile:", error);

      // Xử lý lỗi theo status code
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          // Lỗi 400 - Bad Request
          Swal.fire({
            icon: "error",
            title: "Lỗi 400",
            text: "Dữ liệu bạn nhập không hợp lệ. Vui lòng kiểm tra lại!",
          });
        } else if (status === 401) {
          // Lỗi 401 - Unauthorized
          Swal.fire({
            icon: "warning",
            title: "Lỗi 401",
            text: "Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.",
          }).then(() => {
            // Điều hướng người dùng đến trang đăng nhập
            window.location.href = "/login";
          });
        } else {
          // Các lỗi khác
          Swal.fire({
            icon: "error",
            title: `Lỗi ${status}`,
            text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
          });
        }
      } else if (error.request) {
        // Lỗi request không nhận được phản hồi từ server
        Swal.fire({
          icon: "error",
          title: "Lỗi kết nối",
          text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.",
        });
      } else {
        // Lỗi xảy ra khi cấu hình yêu cầu
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Đã xảy ra lỗi: ${error.message}`,
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isUpdated) {
      fetchProfile(); // Gọi lại fetchProfile để lấy dữ liệu mới
      setIsUpdated(false); // Reset lại cờ isUpdated
    }
  }, [isUpdated]);

  return (
    <div className="bg-white p-14 rounded-lg shadow-lg max-w-4xl">
      <h1 className="mb-6 text-red-500 text-2xl font-medium">
        Edit Your Profile
      </h1>
      <div className="form-container flex gap-6">
        <form className="flex flex-col md:w-1/2">
          <div className="form-group flex flex-col">
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="firstName"
              >
                Họ
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="firstName"
                type="text"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
              />
            </div>
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="lastName"
              >
                Tên
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="lastName"
                type="text"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastName: e.target.value })
                }
              />
            </div>

            <div className="w-full mb-6 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="email"
                value={profileData.userName}
                disabled
              />
            </div>
          </div>
        </form>

        <form className="flex flex-col md:w-1/2">
          <div className="form-group flex flex-col">
            {/* Số điện thoại */}
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="phoneNumber"
              >
                Số điện thoại
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="phoneNumber"
                type="text"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </div>

            {/* points */}
            <div className="w-full px-3 mb-10">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="points"
              >
                Số điểm thưởng:
              </label>
              <input
                className="appearance-none block w-full text-xl text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4"
                id="points"
                type="text"
                value={profileData.points}
                readOnly
              />
            </div>
          </div>
        </form>
      </div>

      {/* Địa chỉ */}
      <div className="w-full px-3 mb-6">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="address"
        >
          Địa chỉ
        </label>
        <input
          className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id="address"
          type="text"
          value={profileData.address}
          onChange={(e) =>
            setProfileData({ ...profileData, address: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end">
        <div
          className="flex bg-red-600 justify-center align-middle p-3 rounded-lg text-white font-medium w-32"
          onClick={updateProfile}
        >
          <a>Save Changes</a>
        </div>
      </div>
    </div>
  );
}

export default FormMyProfile;
