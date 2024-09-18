import {} from "antd";

function FormMyAddress() {
  return (
    <div className="container bg-white p-14 rounded-lg shadow-lg">
      <h1 className="mb-6 text-red-500 text-2xl font-medium">
        Edit Your Profile
      </h1>
      <div className="form-container flex flex-col md:flex-row gap-6">
        <form className="flex flex-col gap-6 w-full md:w-1/2">
          <div className="form-group flex flex-col div1">
            <div className="w-full px-3 mb-6 ">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Họ và Tên
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
              />
            </div>
            <div className="w-full mb-6 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Email
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <div className="w-full mb-6 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Số điện thoại
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="name@example.com"
              />
            </div>
          </div>
        </form>

        <form className="flex flex-col gap-6 w-full md:w-1/2">
          <div className="form-group flex flex-col div2">
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Tỉnh / Thành phố
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Kingston, 5236, United State"
              />
            </div>

            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Quận huyện
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="Kingston, 5236, United State"
              />
            </div>

            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Phường Xã
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="Kingston, 5236, United State"
              />
            </div>

            <div className="w-full px-3 mb-10">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Địa chỉ
              </label>
              <input
                className="appearance-none block w-64 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 mb-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="Kingston, 5236, United State"
              />
            </div>

            <div className="flex justify-end">
              <div className="mr-3 p-3 font-medium">
                <a href="#">Cancel</a>
              </div>
              <div className="flex bg-red-600 justify-center align-middle p-3 rounded-lg text-white font-medium w-32">
                <a>Save Changes</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormMyAddress;
