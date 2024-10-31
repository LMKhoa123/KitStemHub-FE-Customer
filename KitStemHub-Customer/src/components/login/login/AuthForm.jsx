import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Form, Input, Modal, Select } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../../config/firebase";
import api from "../../../config/axios";
import styles from "./AuthForm.module.css";
import Loading from "../../Loading";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import EmailVerification from "../../EmailVerification";
const { Option } = Select;

function LoginInput() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [form] = Form.useForm();
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const email = urlParams.get("email");
    const token = urlParams.get("token");

    if (email && token) {
      setIsVerifying(true);
    }
  }, [location]);

  useEffect(() => {
    const urlParams = window.location.search.substring(1).split("&");
    console.log(urlParams);
    let email, token;

    urlParams.forEach((param) => {
      const [key, value] = param.split("=");
      if (key === "email") email = decodeURIComponent(value);
      if (key === "token") token = decodeURIComponent(value);
    });

    // console.log("Email từ URL:", email);
    // console.log("Token từ URL:", token);

    if (email && token) {
      verifyEmail(email, token);
    } else {
      // console.log("Email hoặc token không có trong URL");
    }
  }, []);

  const verifyEmail = async (email, token) => {
    if (!email || !token) {
      toast.error("Không thể xác thực email. Thiếu thông tin cần thiết.");
      return;
    }

    try {
      const response = await api.get(
        `users/email/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
      );
      if (response.data.status === "success") {
        toast.success("Xác thực email thành công!");
      } else {
        toast.error(
          response.data.details?.message ||
            "Xác thực email thất bại. Vui lòng thử lại."
        );
      }
    } catch (error) {
      if (error.response) {
        const errorDetails = error.response.data.details;
        toast.error(
          errorDetails?.message || "Có lỗi xảy ra. Vui lòng thử lại."
        );
      } else if (error.request) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng."
        );
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
  };

  const handleLoginGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      // console.log("acc " + accessToken);
      const idToken = credential.idToken;
      // console.log("id " + idToken);
      const pendingToken = credential.pendingToken;
      // console.log(pendingToken);
      const user = result.user;

      if (user) {
        try {
          const response = await api.post("users/loginwithgoogle", {
            "pending-token": pendingToken,
            "id-token": idToken,
            "access-token": accessToken,
          });
          // console.log(response.data);
          if (response.data.status === "success") {
            // console.log(response.data);
            localStorage.setItem(
              "token",
              response.data.details["access-token"]
            );
            localStorage.setItem(
              "refreshToken",
              response.data.details["refresh-token"]
            );

            setIsLoggedIn(true);

            toast.success(response.data.details.message, {
              onClose: () => {
                // Kiểm tra nếu có URL trước đó để điều hướng sau khi login
                const redirectUrl = localStorage.getItem("redirectAfterLogin");
                if (redirectUrl) {
                  navigate(redirectUrl);
                  localStorage.removeItem("redirectAfterLogin"); // Xóa URL sau khi điều hướng
                } else {
                  navigate("/home");
                }
              },
              autoClose: 1500,
            });
          } else {
            toast.error(
              response.data.details?.message ||
                "Đăng nhập không thành công. Vui lòng thử lại."
            );
          }
        } catch (error) {
          console.error("Google login error:", error);
          toast.error("Đăng nhập Google thất bại!");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleOnFinish = async (values) => {
    setLoading(true);
    try {
      const fullAddress = buildFullAddress();

      const response = await api.post(
        isSignUpMode ? "users/register" : "users/login",
        isSignUpMode
          ? {
              email: values.email,
              password: values.password,
              "first-name": values["first-name"],
              "last-name": values["last-name"],
              "phone-number": values["phone-number"] || "",
              address: fullAddress || "",
            }
          : values
      );
      console.log("Response:", response);
      console.log("Response data:", response?.data);

      if (response.data.status === "success") {
        if (isSignUpMode) {
          setVerificationEmail(values.email);
          setIsVerificationModalVisible(true);
          form.resetFields();
          setFormValues({
            email: "",
            password: "",
            "first-name": "",
            "last-name": "",
            "phone-number": "",
            address: "",
          });
        } else {
          const accessToken = response.data.details["access-token"];
          const refreshToken = response.data.details["refresh-token"];

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setIsLoggedIn(true);

          toast.success("Đăng nhập thành công!", {
            onClose: () => {
              const redirectUrl = localStorage.getItem("redirectAfterLogin");
              if (redirectUrl) {
                navigate(redirectUrl);
                localStorage.removeItem("redirectAfterLogin");
              } else {
                navigate("/home");
              }
            },
            autoClose: 1500,
          });
        }
      } else {
        // Xử lý khi status không phải success
        toast.error(
          response.data.details?.message || "Thao tác không thành công"
        );
      }
    } catch (error) {
      console.log("Error object:", error);

      // Xử lý lỗi từ response
      if (error.response?.data) {
        const errorDetails = error.response.data.details;

        if (errorDetails?.errors?.["invalid-credentials"]) {
          toast.error(errorDetails.errors["invalid-credentials"]);
        } else if (errorDetails.errors["unavailable-username"]) {
          toast.error(errorDetails.errors["unavailable-username"]);
        } else {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } else if (error.request) {
        // Xử lý lỗi network
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng."
        );
      } else {
        // Xử lý các lỗi khác
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationModalOk = () => {
    setIsVerificationModalVisible(false);
    setIsSignUpMode(false);
  };

  const handleSendPasswordResetToken = async () => {
    try {
      const response = await api.post("users/sendpasswordresettoken", {
        email: resetPasswordEmail,
      });
      if (response.data.status === "success") {
        setIsResetPasswordMode(false);
        setIsResetPasswordModalVisible(true);
        toast.success(
          "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
        );
      } else {
        toast.error(
          response.data.details?.message ||
            "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại."
        );
      }
    } catch (error) {
      if (error.response) {
        const errorDetails = error.response.data.details;
        toast.error(
          errorDetails?.message || "Có lỗi xảy ra. Vui lòng thử lại."
        );
      } else if (error.request) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng."
        );
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const baseURL = "https://vn-public-apis.fpo.vn";

  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${baseURL}/provinces/getAll?limit=-1`);
      const data = await response.json();
      const provincesArray = Array.isArray(data.data.data)
        ? data.data.data
        : [];
      setProvinceList(provincesArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh:", error);
    }
  };

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
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận:", error);
      setDistrictList([]);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(
        `${baseURL}/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      );
      const data = await response.json();
      const wardsArray = Array.isArray(data.data.data) ? data.data.data : [];
      setWardList(wardsArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường:", error);
      setWardList([]);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  const buildFullAddress = () => {
    const province =
      provinceList.find((p) => p.code === selectedProvince)?.name || "";
    const district =
      districtList.find((d) => d.code === selectedDistrict)?.name || "";
    const ward = wardList.find((w) => w.code === selectedWard)?.name || "";
    const parts = [specificAddress, ward, district, province].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "";
  };
  console.log(buildFullAddress);
  useEffect(() => {
    if (isSignUpMode) {
      const newAddress = buildFullAddress();
      setFormValues((prev) => ({
        ...prev,
        address: newAddress,
      }));
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    specificAddress,
    isSignUpMode,
  ]);

  if (isVerifying) {
    return <EmailVerification />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`${styles.container} ${isSignUpMode ? styles.signUpMode : ""}`}
    >
      <div className={styles.formsContainer}>
        <div className={styles.signinSignup}>
          <Form
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 600,
            }}
            className={`${styles.signInForm} ${isSignUpMode ? styles.hidden : ""} ml-10`}
            // initialValues={{
            //   remember: true,
            // }}
            onFinish={handleOnFinish}
            onValuesChange={handleFormValuesChange}
            initialValues={formValues}
            preserve={true}
          >
            <h2 className={styles.title}>Đăng nhập</h2>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn!",
                },
              ]}
            >
              <Input
                placeholder="user@example.com"
                prefix={<i className="fas fa-user"></i>}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu của bạn!",
                },
              ]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                prefix={<i className="fas fa-lock"></i>}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.btn} ${styles.solid}`}
            >
              Đăng nhập
            </Button>
            {/* Thêm nút "Quên mật khẩu" vào form đăng nhập */}
            <Link
              onClick={() => setIsResetPasswordMode(true)}
              className="ml-4 text-blue-500 hover:text-blue-700 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-100"
            >
              Quên mật khẩu?
            </Link>
            <p className={styles.socialText}>
              Hoặc đăng nhập bằng các nền tảng xã hội
            </p>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between w-full">
              <div className="w-full  mb-2 lg:mb-0">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                  onClick={handleLoginGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-4"
                    id="google"
                  >
                    <path
                      fill="#fbbb00"
                      d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                    />
                    <path
                      fill="#518ef8"
                      d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                    />
                    <path
                      fill="#28b446"
                      d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                    />
                    <path
                      fill="#f14336"
                      d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                    />
                  </svg>{" "}
                  Đăng nhập bằng Google
                </button>
              </div>
            </div>
          </Form>

          <Form
            form={form}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 600,
            }}
            className={`${styles.signUpForm} ${isSignUpMode ? "" : styles.hidden} ml-10`}
            onFinish={handleOnFinish}
            onValuesChange={handleFormValuesChange}
            initialValues={formValues}
            preserve={true}
          >
            <h2 className={styles.title}>Đăng ký</h2>

            <Form.Item
              label="Họ"
              name="first-name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ của bạn!",
                },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: "Họ chỉ được chứa chữ cái và khoảng trắng!",
                },
                {
                  min: 2,
                  message: "Họ phải có ít nhất 2 ký tự!",
                },
              ]}
            >
              <Input
                placeholder="Họ"
                prefix={<i className="fas fa-user"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Tên"
              name="last-name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên của bạn!",
                },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: "Tên chỉ được chứa chữ cái và khoảng trắng!",
                },
                {
                  min: 2,
                  message: "Tên phải có ít nhất 2 ký tự!",
                },
              ]}
            >
              <Input
                placeholder="Tên"
                prefix={<i className="fas fa-user"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input
                placeholder="Email"
                prefix={<i className="fas fa-envelope"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone-number"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại của bạn!",
                },
                {
                  pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                  message: "Số điện thoại không hợp lệ! (VD: 0912345678)",
                },
              ]}
            >
              <Input
                placeholder="Số điện thoại"
                prefix={<i className="fas fa-phone"></i>}
              />
            </Form.Item>

            <Form.Item label="Địa chỉ">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    className="w-full"
                    value={selectedProvince || undefined}
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={(value) => setSelectedProvince(value)}
                    size="large"
                  >
                    {provinceList.map((province) => (
                      <Option key={province.code} value={province.code}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    value={selectedDistrict || undefined}
                    placeholder="Chọn quận/huyện"
                    onChange={(value) => setSelectedDistrict(value)}
                    size="large"
                    disabled={!selectedProvince}
                  >
                    {districtList.map((district) => (
                      <Option key={district.code} value={district.code}>
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    value={selectedWard || undefined}
                    placeholder="Chọn phường/xã"
                    onChange={(value) => setSelectedWard(value)}
                    size="large"
                    disabled={!selectedDistrict}
                  >
                    {wardList.map((ward) => (
                      <Option key={ward.code} value={ward.code}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <Input
                  placeholder="Số nhà, tên đường"
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                />
                <Form.Item name="address" hidden>
                  <Input />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu của bạn!",
                },
              ]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                prefix={<i className="fas fa-lock"></i>}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.btnBlue} ${styles.transparent}`}
              >
                Tạo tài khoản
              </Button>
            </Form.Item>

            <p className={styles.socialText}>
              Hoặc đăng ký bằng các nền tảng xã hội
            </p>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full mb-2 lg:mb-0">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                  onClick={handleLoginGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-4"
                    id="google"
                  >
                    <path
                      fill="#fbbb00"
                      d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                    />
                    <path
                      fill="#518ef8"
                      d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                    />
                    <path
                      fill="#28b446"
                      d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                    />
                    <path
                      fill="#f14336"
                      d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                    />
                  </svg>
                  Đăng ký bằng Google
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div className={styles.panelsContainer}>
        <div className={`${styles.panel} ${styles.leftPanel}`}>
          <div className={styles.content}>
            <h3>Bạn là người mới?</h3>
            <p>
              Hãy đăng ký tài khoản ngay để trở thành thành viên của cộng đồng
              chúng tôi và khám phá những nội dung độc quyền, ưu đãi hấp dẫn
              dành riêng cho bạn.
            </p>

            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.btn} ${styles.transparent}`}
              onClick={() => setIsSignUpMode(true)}
            >
              Đăng ký
            </Button>
          </div>
          <img src="./log.svg" className={styles.image} alt="" />
        </div>
        <div className={`${styles.panel} ${styles.rightPanel}`}>
          <div className={styles.content}>
            <h3>Đã có tài khoản?</h3>
            <p>
              Chào mừng bạn quay trở lại! Hãy đăng nhập để tiếp tục hành trình
              của bạn ngay từ nơi đã dừng lại.
            </p>
            <Button
              className={`${styles.btn} ${styles.transparent}`}
              onClick={() => setIsSignUpMode(false)}
            >
              Đăng nhập
            </Button>
          </div>
          <img src="./register.svg" className={styles.image} alt="" />
        </div>
      </div>
      <Modal
        title="Yêu cầu xác thực email"
        visible={isVerificationModalVisible}
        onOk={handleVerificationModalOk}
        onCancel={handleVerificationModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleVerificationModalOk}>
            OK
          </Button>,
        ]}
      >
        <p>
          Một email xác thực đã được gửi đến {verificationEmail}. Vui lòng kiểm
          tra hộp thư đến và nhấp vào liên kết xác thực để hoàn tất đăng ký của
          bạn.
        </p>
      </Modal>

      <Modal
        title="Yêu cầu cài lại mật khẩu"
        visible={isResetPasswordModalVisible}
        onOk={() => setIsResetPasswordModalVisible(false)}
        onCancel={() => setIsResetPasswordModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setIsResetPasswordModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <p>
          Chúng tôi đã gửi một email xác thực đến địa chỉ {resetPasswordEmail}.
          Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để hoàn tất
          việc thay đổi mật khẩu!
        </p>
      </Modal>

      {/* Modal for password reset */}
      <Modal
        visible={isResetPasswordMode}
        onCancel={() => setIsResetPasswordMode(false)}
        footer={null}
        className="reset-password-modal"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Gặp sự cố đăng nhập?</h2>
          <p className="text-gray-600 mb-4">
            Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để truy
            cập lại vào tài khoản.
          </p>
          <Input
            placeholder="VD: user@example.com"
            value={resetPasswordEmail}
            onChange={(e) => setResetPasswordEmail(e.target.value)}
            className="mb-4"
          />
          <Button
            type="primary"
            onClick={handleSendPasswordResetToken}
            className="w-full mb-4"
          >
            Gửi liên kết xác thực
          </Button>
          <p className="text-gray-600 mb-4">HOẶC</p>
          <Button
            onClick={() => {
              setIsSignUpMode(true);
              setIsResetPasswordMode(false);
            }}
            className="w-full mb-4"
          >
            Tạo tài khoản mới
          </Button>
          <Button onClick={() => setIsResetPasswordMode(false)} type="link">
            Quay lại đăng nhập
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginInput;
