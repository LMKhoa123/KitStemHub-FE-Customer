import { useEffect, useState } from "react";
import api from "../../../../config/axios";

function FormMyProfile() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    city: "",
    district: "",
    ward: "",
    addressStreet: "",
    address: "",
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await api.get("Profile");
      console.log("Lấy dữ liệu thành công", response.data);
      setProfileData({
        firstName: response.data.details.profile.firstName || "",
        lastName: response.data.details.profile.lastName || "",
        userName: response.data.details.profile.userName || "",
        address: response.data.details.profile.address || "",
      });
    } catch (error) {
      console.log("Lấy dữ liệu thất bại", error);
    }
  };

  // const fetchEmail = async () => {
  //   try {
  //     const response = await api.
  //   } catch (error) {

  //   }
  // }

  // Update profile data (PUT request)
  const updateProfile = async () => {
    const combinedAddress = `${profileData.addressStreet}, ${profileData.ward}, ${profileData.district}, ${profileData.city}`;

    const updatedProfile = {
      ...profileData,
      address: combinedAddress, // Set the full address
    };

    try {
      const response = await api.put("Profile", updatedProfile);
      console.log("Profile updated successfully", response.data);
      setProfileData(response.data);
    } catch (error) {
      console.log("Error updating profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
                htmlFor="name"
              >
                Họ
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="name"
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
                htmlFor="name"
              >
                Tên
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="name"
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
                onChange={(e) =>
                  setProfileData({ ...profileData, userName: e.target.value })
                }
                disabled
              />
            </div>
          </div>
        </form>

        <form className="flex flex-col md:w-1/2">
          <div className="form-group flex flex-col div2">
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="city"
              >
                Tỉnh / Thành phố
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="city"
                type="text"
                value={profileData.city}
                onChange={(e) =>
                  setProfileData({ ...profileData, city: e.target.value })
                }
              />
            </div>

            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="district"
              >
                Quận huyện
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="district"
                type="text"
                value={profileData.district}
                onChange={(e) =>
                  setProfileData({ ...profileData, district: e.target.value })
                }
              />
            </div>

            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="ward"
              >
                Phường Xã
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="ward"
                type="text"
                value={profileData.ward}
                onChange={(e) =>
                  setProfileData({ ...profileData, ward: e.target.value })
                }
              />
            </div>

            <div className="w-full px-3 mb-10">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="address"
              >
                Địa chỉ
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="address"
                type="text"
                value={profileData.addressStreet}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    addressStreet: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end">
              <div className="mr-3 p-3 font-medium">
                <a href="#">Cancel</a>
              </div>
              <div
                className="flex bg-red-600 justify-center align-middle p-3 rounded-lg text-white font-medium w-32"
                onClick={updateProfile}
              >
                <a>Save Changes</a>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full px-3 mb-10">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="address"
        >
          Thông tin Địa chỉ
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="address"
          type="text"
          value={profileData.address}
          onChange={(e) =>
            setProfileData({ ...profileData, address: e.target.value })
          }
          disabled
        />
      </div>
    </div>
  );
}

export default FormMyProfile;
