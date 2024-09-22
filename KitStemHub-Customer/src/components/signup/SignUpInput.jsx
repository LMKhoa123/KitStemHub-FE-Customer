import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../config/firebase";
import api from "../../config/axios";

function SignUpInput() {
  const navigate = useNavigate();
  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleOnFinish = async (values) => {
    try {
      // const response = await api.post("User/Register", values, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      const response = await api.post("User/Register", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add this line
        },
      });
      console.log(response.data);
      const { token } = response.data;
      if (token) {
        // Store token securely (consider using cookies or secure storage)
        localStorage.setItem("token", token); // Replace this with secure storage if possible
        navigate("/loginpage");
      } else {
        throw new Error("Token not found in response.");
      }
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
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
              Create an account
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
              // onFinishFailed={handleOnFinishFailed}
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
                <Input className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
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
                <Input.Password className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !py-4 bg-red-400 text-white hover:!bg-red-600 focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Create account
                </Button>
              </Form.Item>
            </Form>
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
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Already have an account?{" "}
                <a href="#" className="text-red-400 hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpInput;
