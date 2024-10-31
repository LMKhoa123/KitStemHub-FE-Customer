import { useEffect, useState } from "react";
import api from "../../../../config/axios";
import Swal from "sweetalert2";
import { Button, Modal } from "antd";

const baseURL = "https://vn-public-apis.fpo.vn";
function FormMyProfile() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    address: "",
    points: 0,
  });
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState(""); // Địa chỉ nhà cụ thể
  const [fullAddress, setFullAddress] = useState(""); // Địa chỉ đầy đủ
  const [isUpdated, setIsUpdated] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false); // Trạng thái modal
  const [errors, setErrors] = useState({});

  // Hàm để hiển thị modal chỉnh sửa địa chỉ
  const showAddressModal = () => {
    setIsAddressModalVisible(true);
  };

  // Hàm để đóng modal chỉnh sửa địa chỉ
  const handleAddressModalClose = () => {
    setIsAddressModalVisible(false);
  };

  // Hàm để xác nhận thông tin từ modal và hiển thị địa chỉ đầy đủ trên trang
  const handleModalOk = () => {
    const selectedProvinceObj = provinceList.find(
      (province) => province.code === selectedProvince
    );
    const selectedDistrictObj = districtList.find(
      (district) => district.code === selectedDistrict
    );
    const selectedWardObj = wardList.find((ward) => ward.code === selectedWard);

    const completeAddress = `${specificAddress}, ${selectedWardObj?.name_with_type || ""}, ${selectedDistrictObj?.name_with_type || ""}, ${selectedProvinceObj?.name_with_type || ""}`;

    setFullAddress(completeAddress); // Hiển thị địa chỉ đầy đủ trên giao diện
    setIsAddressModalVisible(false); // Đóng modal
  };

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
        phoneNumber: userProfile["phone-number"] || "",
        address: userProfile["address"] || "",
        points: userProfile["points"] || 0,
      });

      setFullAddress(userProfile["address"]); // Hiển thị địa chỉ ban đầu từ API
    } catch (error) {
      console.log("Lấy dữ liệu thất bại", error);
    }
  };

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${baseURL}/provinces/getAll?limit=-1`);
      const data = await response.json();
      const provincesArray = Array.isArray(data.data.data)
        ? data.data.data
        : [];
      setProvinceList(provincesArray);
      console.log("Updated provinceList:", provincesArray); // Debug log to verify data
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh:", error);
    }
  };

  // Fetch districts based on provinceCode
  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await fetch(
        `${baseURL}/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
      );
      const data = await response.json();
      const districtsArray = Array.isArray(data.data.data)
        ? data.data.data
        : [];
      setDistrictList(districtsArray);
      console.log("Updated districtList:", districtsArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận:", error);
      setDistrictList([]); // Reset danh sách nếu có lỗi
    }
  };

  // Fetch wards based on districtCode
  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(
        `${baseURL}/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      );
      const data = await response.json();

      console.log("Wards API response:", data); // Kiểm tra phản hồi API

      const wardsArray = Array.isArray(data.data.data) ? data.data.data : []; // Truy cập đúng thuộc tính của API
      setWardList(wardsArray);
      console.log("Updated wardList:", wardsArray); // Kiểm tra dữ liệu danh sách phường
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường:", error);
      setWardList([]); // Đảm bảo đặt giá trị mặc định nếu có lỗi
    }
  };

  // Hàm kiểm tra tính hợp lệ của họ, tên và số điện thoại
  const validateProfileData = () => {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/; // phải là số theo đầu số việt nam
    const newErrors = {};

    if (!nameRegex.test(profileData.firstName)) {
      newErrors.firstName =
        "Họ chỉ được chứa chữ cái và không có ký tự đặc biệt.";
    }

    if (!nameRegex.test(profileData.lastName)) {
      newErrors.lastName =
        "Tên chỉ được chứa chữ cái và không có ký tự đặc biệt.";
    }

    if (!phoneRegex.test(profileData.phoneNumber)) {
      newErrors.phoneNumber =
        "Số điện thoại phải có 10 số và bắt đầu bằng đầu số Việt Nam (03, 05, 07, 08, 09)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const updateProfile = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!validateProfileData()) return;

    const cleanData = {
      "first-name": profileData.firstName || "",
      "last-name": profileData.lastName || "",
      "phone-number": profileData.phoneNumber || "",
      address: fullAddress || profileData.address,
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
        title: "Bạn có muốn lưu những thay đổi không?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Lưu",
        denyButtonText: `Không lưu`,
      }).then((result) => {
        if (result.isConfirmed) {
          setProfileData(response.data);
          setIsUpdated(true);
          Swal.fire("Đã lưu!", "", "thành công");
        } else if (result.isDenied) {
          Swal.fire("Những thay đổi không được lưu", "", "thông tin");
        }
      });
    } catch (error) {
      console.log("Error updating profile:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.", "lỗi");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (isUpdated) {
      fetchProfile();
      setIsUpdated(false);
    }
  }, [isUpdated]);

  return (
    <div className="bg-white p-10 rounded-lg shadow-md max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-rose-600 mb-8">
        Cập nhật thông tin cá nhân
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Họ</label>
          <input
            className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Tên</label>
          <input
            className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData({ ...profileData, lastName: e.target.value })
            }
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Số điện thoại</label>
          <input
            type="text"
            maxLength="10"
            className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            value={profileData.phoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setProfileData({ ...profileData, phoneNumber: value });
              }
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100"
            value={profileData.userName}
            disabled
          />
        </div>
      </div>

      {/* Nút để mở modal chỉnh sửa địa chỉ */}
      <div className="mt-6">
        <Button type="primary" onClick={showAddressModal}>
          Chỉnh sửa địa chỉ
        </Button>
      </div>

      {/* Modal chứa form chỉnh sửa địa chỉ */}
      <Modal
        title={
          <div className="ml-5 mt-5">
            <span className="text-2xl font-bold">Chỉnh sửa địa chỉ</span>
          </div>
        }
        visible={isAddressModalVisible}
        onCancel={handleAddressModalClose}
        onOk={handleModalOk}
        width="800px"
        footer={[
          <Button
            key="back"
            onClick={handleAddressModalClose}
            className="px-8 py-4 font-medium"
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleModalOk}
            className="px-8 py-4 bg-rose-600 text-white hover:bg-rose-700 mr-5 font-medium"
          >
            Lưu địa chỉ
          </Button>,
        ]}
        bodyStyle={{ padding: "20px", height: "300px" }} // Thêm padding để tạo khoảng cách cho nội dung
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-4">
              Tỉnh/Thành phố
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={selectedProvince}
              onChange={(e) => {
                const provinceCode = e.target.value;
                setSelectedProvince(provinceCode);
                fetchDistricts(provinceCode);
              }}
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {Array.isArray(provinceList) &&
                provinceList.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name_with_type}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-4">
              Quận/Huyện
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={selectedDistrict}
              onChange={(e) => {
                const districtCode = e.target.value;
                setSelectedDistrict(districtCode);
                fetchWards(districtCode);
              }}
            >
              <option value="">Chọn Quận/Huyện</option>
              {Array.isArray(districtList) && districtList.length > 0 ? (
                districtList.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name_with_type}
                  </option>
                ))
              ) : (
                <option value="">Không có dữ liệu</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-4">
              Phường/Xã
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
              }}
            >
              <option value="">Chọn Phường/Xã</option>
              {Array.isArray(wardList) && wardList.length > 0 ? (
                wardList.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name_with_type}
                  </option>
                ))
              ) : (
                <option value="">Không có dữ liệu</option>
              )}
            </select>
          </div>
        </div>

        <div className="mt-10">
          <label className="block text-gray-700 font-semibold mb-4">
            Địa chỉ cụ thể
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="123 Đường ABC"
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
          />
        </div>
      </Modal>

      <div className="mt-6">
        <label className="text-gray-700 font-semibold">Địa chỉ đầy đủ</label>
        <input
          className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100"
          value={fullAddress}
          readOnly
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          className="px-6 py-2 bg-rose-600 text-white font-bold rounded-md hover:bg-rose-700 transition duration-300"
          onClick={updateProfile}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

export default FormMyProfile;
