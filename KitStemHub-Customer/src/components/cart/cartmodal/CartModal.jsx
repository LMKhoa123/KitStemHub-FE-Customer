/* eslint-disable react/prop-types */

function CartModal({ isOpen, onClose }) {
  if (!isOpen) return null; // Không render modal nếu không mở

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 text-2xl">✔️</span>
            <h2 className="text-lg font-bold text-blue-500">
              Product successfully added to your shopping cart
            </h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose} // Đóng modal
          >
            ✖️
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex py-6">
          <div className="w-1/3 flex items-center justify-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="w-2/3 pl-10">
            <div className="space-y-4">
              <p>There is 1 item in your cart.</p>
              <div className="flex justify-between">
                <p className="font-semibold">Subtotal:</p>
                <p className="">$29.99</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Total (tax excl.):</p>
                <p className="">$29.99</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Total (tax incl.):</p>
                <p className=" text-red-500 font-bold">$31.99</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Taxes:</p>
                <p className="">$2.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center border-t pt-4">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose} // Đóng modal
          >
            CONTINUE SHOPPING
          </button>
          <button className="text-white px-4 py-2 rounded bg-gradient-to-r from-pink-500 to-red-500 font-medium h-10 shadow-lg hover:from-yellow-400 hover:to-red-500 transition-all duration-300">
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartModal;
