import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase";
import { Button, Form, Input } from "antd";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginInput() {
  const navigate = useNavigate();

  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // console.log(credential);
        const accessToken = credential.accessToken; // Access Token from Google
        // console.log("acccessToken" + accessToken);
        const idToken = credential.idToken; // Get the ID Token from the result
        // console.log("idToke" + idToken);
        const pendingToken = credential.pendingToken; // Pending Token (optional, depends on Google)
        // console.log("pending" + pendingToken);
        const user = result.user; // Thông tin người dùng
        if (user) {
          api
            .post("LoginWithGoogle", { pendingToken, idToken, accessToken })
            .then((response) => {
              console.log(response.data);
              toast.success("User logged in Successfully!", {
                position: "top-center",
                autoClose: 1500,
              });

              // Lưu trữ thông tin vào localStorage
              localStorage.setItem("token", response.data.details.accessToken); // Save server's access token
              localStorage.setItem(
                "refreshToken",
                response.data.details.refreshToken
              ); // Save refresh token
              // console.log(localStorage.getItem("token"));
              // console.log(localStorage.getItem("refreshToken"));
              setTimeout(() => {
                navigate("/"); // Chuyển hướng sang trang homepage
              }, 1500); // Chờ 1.5 giây để đảm bảo người dùng thấy thông báo
            });
        }
      })
      .catch((error) => {
        console.log("Error during Google login:", error);
        toast.error("Google login failed!", {
          position: "top-center",
        });
      });
  };

  const handleOnFinish = async (values) => {
    // console.log("Values gửi đến máy chủ:", values);

    try {
      // /gửi request đến server vaf kèm values cua  form
      const response = await api.post("Login", values);
      console.log(response.data);
      // console.log(localStorage.length); // 2
      // localStorage.clear();
      // console.log(localStorage.length); // 0
      const { accessToken, refreshToken } = response.data.details;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("User logged in Successfully!", {
        position: "top-center",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/"); // Chuyển hướng sang trang homepage
      }, 1500); // Chờ 1.5 giây để đảm bảo người dùng thấy thông báo
    } catch (err) {
      if (err.response) {
        console.log("Lỗi từ phía server:", err.response.status); // Mã lỗi HTTP (ví dụ: 401 Unauthorized)
        console.log("Thông điệp lỗi:", err.response.data); // Thông báo chi tiết từ server
        alert(
          // Dấu ?. là cú pháp Optional Chaining trong JavaScript, cho phép kiểm tra xem thuộc tính có tồn tại hay không mà không gây lỗi nếu thuộc tính đó không tồn tại.
          err.response.data.details.errors?.email ||
            err.response.data.details.errors?.invalidCredentials ||
            "Có lỗi xảy ra, vui lòng thử lại."
        );
      } else if (err.request) {
        console.log("Không có phản hồi từ server:", err.request);
        alert(
          "Không thể kết nối đến server, vui lòng kiểm tra lại kết nối mạng."
        );
      } else {
        console.log("Lỗi khi tạo yêu cầu:", err.message);
        alert(`Lỗi khi tạo yêu cầu: ${err.message}`);
      }
    }
  };

  return (
    <>
      <main className="flex justify-center min-h-screen">
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-md text-center">
          <img
            src="./arranging-files.svg"
            alt="login-image"
            className="w-full h-full"
          />
        </div>
        <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
          <div className="max-w-md w-full p-6 ">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Log in to KitStemHub
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Enter your details below
            </h1>

            <Form
              className="space-y-4"
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={handleOnFinish}
              autoComplete="true"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
                className="mb-1"
              >
                <Input />
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
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-red-400 text-white hover:!bg-red-600 focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
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
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                <span className=" m-1">Already have an account?</span>
                <Link to="/signup" className="text-red-400 hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Toast container needs to be rendered outside any function */}
      <ToastContainer />
    </>
  );
}

export default LoginInput;
