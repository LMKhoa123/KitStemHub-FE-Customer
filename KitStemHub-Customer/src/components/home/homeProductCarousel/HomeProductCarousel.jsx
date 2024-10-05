/* eslint-disable react/prop-types */
import { useState } from "react";
import { EyeOutlined, HeartOutlined } from "@ant-design/icons";
import { Card, CardFooter, Button } from "@nextui-org/react";
import CartModal from "../../cart/cartmodal/CartModal";

function HomeProductCarousel({ products }) {
  const [productStates, setProductStates] = useState(
    products.map(() => ({
      isAddedToCart: false,
      isHeartClicked: false,
      isEyeClicked: false,
    }))
  );

  // State để điều khiển mở/đóng modal
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleState = (index, stateType) => {
    setProductStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index][stateType] = !newStates[index][stateType];
      return newStates;
    });

    // Đặt lại trạng thái sau 1.5 giây
    setTimeout(() => {
      setProductStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index][stateType] = false;
        return newStates;
      });
    }, 1000);
  };

  const handleAddToCart = (index) => {
    toggleState(index, "isAddedToCart");
    setModalOpen(true); // Mở modal khi bấm "Add to Cart"
  };

  return (
    <>
      {/* Cart Modal */}
      <CartModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      <div className="gap-14 grid grid-cols-2 sm:grid-cols-4">
        {products.map((item, index) => (
          <Card
            key={index}
            isFooterBlurred
            className="shadow-xl cursor-pointer w-64 transform transition-all duration-300 hover:shadow-2xl hover:scale-105 relative group rounded-xl overflow-hidden"
          >
            <img
              className="object-cover w-full h-auto"
              height={200}
              src={item.img}
              alt={item.name} // Đảm bảo ảnh có thuộc tính alt cho SEO và truy cập
            />

            {/* Biểu tượng Heart và Eye */}
            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <div
                className={`p-2 transition-all duration-300 ease-in-out ${
                  productStates[index].isHeartClicked
                    ? "bg-gradient-to-r from-pink-500 to-red-500 scale-110"
                    : "bg-black/50"
                } hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-10 h-10`}
                onClick={() => toggleState(index, "isHeartClicked")}
              >
                <HeartOutlined
                  className="text-white"
                  style={{ fontSize: "18px" }}
                />
              </div>
              <div
                className={`p-2 transition-all duration-300 ease-in-out ${
                  productStates[index].isEyeClicked
                    ? "bg-gradient-to-r from-pink-500 to-red-500 scale-110"
                    : "bg-black/50"
                } hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-10 h-10`}
                onClick={() => toggleState(index, "isEyeClicked")}
              >
                <EyeOutlined
                  className="text-white"
                  style={{ fontSize: "18px" }}
                />
              </div>
            </div>

            <CardFooter className="absolute bottom-0 left-0 right-0 py-0 px-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex justify-center">
              <Button
                className={`text-tiny text-white w-full h-10 transform transition-transform duration-300 ease-in-out ${
                  productStates[index].isAddedToCart
                    ? "bg-gradient-to-r from-pink-500 to-red-500 scale-105"
                    : "bg-black/50"
                } hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-lg`}
                onClick={() => handleAddToCart(index)} // Mở modal khi bấm "Add to Cart"
              >
                {productStates[index].isAddedToCart ? "Added" : "Add to Cart"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default HomeProductCarousel;
