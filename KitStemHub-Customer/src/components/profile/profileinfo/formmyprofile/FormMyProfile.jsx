import { useEffect, useState } from "react";
import api from "../../../../config/axios";
import Swal from "sweetalert2";

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

      setSpecificAddress(""); // Hiển thị địa chỉ đầy đủ ngay khi fetch
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

  const updateProfile = async () => {
    // Tìm tên đầy đủ của tỉnh, quận, phường
    const selectedProvinceObj = provinceList.find(
      (province) => province.code === selectedProvince
    );
    const selectedDistrictObj = districtList.find(
      (district) => district.code === selectedDistrict
    );
    const selectedWardObj = wardList.find((ward) => ward.code === selectedWard);

    // Tạo địa chỉ đầy đủ từ các giá trị name_with_type
    const completeAddress = `${specificAddress}, ${selectedWardObj?.name_with_type || ""}, ${selectedDistrictObj?.name_with_type || ""}, ${selectedProvinceObj?.name_with_type || ""}`;

    const cleanData = {
      "first-name": profileData.firstName || "",
      "last-name": profileData.lastName || "",
      "phone-number": profileData.phoneNumber || "",
      address: completeAddress || "",
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
          setFullAddress(completeAddress); // Hiển thị địa chỉ đầy đủ
          setIsUpdated(true);
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      console.log("Error updating profile:", error);
      Swal.fire("Error", "Something went wrong, please try again.", "error");
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
    <div className="bg-white p-10 rounded-lg shadow-md max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-rose-600 mb-8">
        Cập nhật thông tin cá nhân
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Họ</label>
          <input
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Tên</label>
          <input
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData({ ...profileData, lastName: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Số điện thoại</label>
          <input
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={profileData.phoneNumber}
            onChange={(e) =>
              setProfileData({ ...profileData, phoneNumber: e.target.value })
            }
          />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="text-gray-700 font-semibold">Tỉnh/Thành phố</label>
          <select
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
          <label className="text-gray-700 font-semibold">Quận/Huyện</label>
          <select
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
          <label className="text-gray-700 font-semibold">Phường/Xã</label>
          <select
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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

      <div className="mt-6">
        <label className="text-gray-700 font-semibold">Địa chỉ cụ thể</label>
        <input
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="123 Đường ABC"
          value={specificAddress}
          onChange={(e) => setSpecificAddress(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <label className="text-gray-700 font-semibold">Địa chỉ đầy đủ</label>
        <input
          className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100"
          value={profileData.address}
          readOnly
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          className="px-6 py-2 bg-rose-600 text-white font-bold rounded-md hover:bg-rose-700 transition duration-300"
          onClick={updateProfile}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default FormMyProfile;
