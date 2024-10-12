import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../../config/firebase";
import api from "../../../config/axios";
import styles from "./AuthForm.module.css";
import Loading from "../../Loading";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

function LoginInput() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

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
            toast.error("Đăng nhập không thành công. Vui lòng thử lại.");
          }
        } catch (error) {
          // console.error("Error during server communication:", error);
          toast.error("Lỗi kết nối với server. Vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      // console.error("Error during Google login:", error);
      toast.error("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleOnFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post(
        isSignUpMode ? "users/register" : "users/login",
        values
      );

      if (isSignUpMode) {
        // Xử lý khi đăng ký
        if (response.data.status === "success") {
          toast.success(response.data.details.message);
          setIsSignUpMode(false);
        } else {
          const error = response.data.details?.errors || {};
          console.log(error);
          toast.error("Đăng ký không thành công. Vui lòng thử lại.");
        }
      } else {
        // Xử lý khi đăng nhập
        console.log(response.data);
        const accessToken = response.data.details["access-token"];
        const refreshToken = response.data.details["refresh-token"];

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setIsLoggedIn(true);

        await new Promise((resolve) => {
          toast.success("Đăng nhập thành công!", {
            onClose: resolve,
            autoClose: 1500,
          });
        });

        // Kiểm tra nếu có URL trước đó để điều hướng sau khi login
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          navigate(redirectUrl);
          localStorage.removeItem("redirectAfterLogin"); // Xóa URL sau khi điều hướng
        } else {
          navigate("/home"); // Điều hướng mặc định nếu không có URL nào trước đó
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        const error = err.response.data.details?.errors || {};
        // console.log("Lỗi từ phía server:", err.response.status);
        // console.log("Thông điệp lỗi:", err.response.data);
        // console.log("Chi tiết lỗi:", err.response.data.details);

        if (error.email) {
          toast.error(error.email, {
            autoClose: 1500,
          });
        }
      } else if (err.request) {
        console.log("Không có phản hồi từ server:", err.request);
        await new Promise((resolve) => {
          toast.error(
            "Không thể kết nối đến server, vui lòng kiểm tra lại kết nối mạng.",
            {
              onClose: resolve,
            }
          );
        });
      } else {
        console.log("Lỗi khi tạo yêu cầu:", err.message);
        await new Promise((resolve) => {
          toast.error(`Lỗi khi tạo yêu cầu: ${err.message}`, {
            onClose: resolve,
          });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`${styles.container} ${isSignUpMode ? styles.signUpMode : ""} `}
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
            initialValues={{
              remember: true,
            }}
            onFinish={handleOnFinish}
            autoComplete="true"
          >
            <h2 className={styles.title}>Sign in</h2>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
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
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<i className="fas fa-lock"></i>}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.btn} ${styles.solid}`}
            >
              Login
            </Button>
            <p className={styles.socialText}>
              Or Sign in with social platforms
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
                  Sign Up with Google
                </button>
              </div>
            </div>
          </Form>

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
            className={`${styles.signUpForm} ${isSignUpMode ? "" : styles.hidden} ml-10`}
            onFinish={handleOnFinish}
            initialValues={{
              remember: true,
            }}
            autoComplete="true"
          >
            <h2 className={styles.title}>Sign up</h2>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                placeholder="Email"
                prefix={<i className="fas fa-envelope"></i>}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
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
                className={`${styles.btnBlue} ${styles.transparent} `}
              >
                Create account
              </Button>
            </Form.Item>
            <p className={styles.socialText}>
              Or Sign up with social platforms
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
                  Sign In with Google
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div className={styles.panelsContainer}>
        <div className={`${styles.panel} ${styles.leftPanel}`}>
          <div className={styles.content}>
            <h3>New here?</h3>
            <p>
              Let&apos;s create an account to join our community and get access
              to exclusive content.
            </p>

            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.btn} ${styles.transparent}`}
              onClick={() => setIsSignUpMode(true)}
            >
              Sign up
            </Button>
          </div>
          <img src="./log.svg" className={styles.image} alt="" />
        </div>
        <div className={`${styles.panel} ${styles.rightPanel}`}>
          <div className={styles.content}>
            <h3>One of us?</h3>
            <p>Welcome back! Log in to pick up where you left off.</p>
            <Button
              className={`${styles.btn} ${styles.transparent}`}
              onClick={() => setIsSignUpMode(false)}
            >
              Sign in
            </Button>
          </div>
          <img src="./register.svg" className={styles.image} alt="" />
        </div>
      </div>
    </div>
  );
}

export default LoginInput;
