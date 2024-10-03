import { useState } from "react";
import { Breadcrumb, Rate, Button, Tooltip } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(2);

  const relatedItems = [
    {
      id: 1,
      name: "HAVIT HV-G92 Gamepad",
      image:
        "https://nshopvn.com/wp-content/uploads/2020/12/combo-tu-lam-xe-3-banh-tranh-vat-can-arduino-jpxl-1.jpg",
      price: 120,
      oldPrice: 160,
      discount: 40,
      rating: 5,
      reviews: 88,
    },
    {
      id: 2,
      name: "AK-900 Wired Keyboard",
      image:
        "https://nshopvn.com/wp-content/uploads/2020/12/combo-tu-lam-xe-3-banh-tranh-vat-can-arduino-jpxl-1.jpg",
      price: 960,
      oldPrice: 1160,
      discount: 35,
      rating: 4,
      reviews: 75,
    },
    {
      id: 3,
      name: "IPS LCD Gaming Monitor",
      image:
        "https://nshopvn.com/wp-content/uploads/2020/12/combo-tu-lam-xe-3-banh-tranh-vat-can-arduino-jpxl-1.jpg",
      price: 370,
      oldPrice: 400,
      discount: 30,
      rating: 5,
      reviews: 99,
    },
    {
      id: 4,
      name: "RGB liquid CPU Cooler",
      image:
        "https://nshopvn.com/wp-content/uploads/2020/12/combo-tu-lam-xe-3-banh-tranh-vat-can-arduino-jpxl-1.jpg",
      price: 160,
      oldPrice: 170,
      rating: 5,
      reviews: 65,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb className="py-4 text-sm">
        <Breadcrumb.Item>Account</Breadcrumb.Item>
        <Breadcrumb.Item>Gaming</Breadcrumb.Item>
        <Breadcrumb.Item>Havit HV-G92 Gamepad</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="flex gap-4">
            <div className="w-1/5">
              {[1, 2, 3, 4].map((item) => (
                <img
                  key={item}
                  src={`https://nshopvn.com/wp-content/uploads/2024/08/r5xc-comboxedieukhientuxacocameragiamsat-1-1.jpg`}
                  alt={`Thumbnail ${item}`}
                  className="w-full mb-2 rounded cursor-pointer hover:opacity-75 transition"
                />
              ))}
            </div>
            <div className="w-4/5">
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src="https://nshopvn.com/wp-content/uploads/2024/08/r5xc-comboxedieukhientuxacocameragiamsat-1-1.jpg"
                    alt="Your product"
                    className="w-full rounded-lg"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl font-semibold mb-2">
            Combo xe điều khiển từ xa có camera giám sát
          </h1>
          <div className="flex items-center mb-4">
            <Rate
              disabled
              defaultValue={4.5}
              className="text-yellow-400 text-sm"
            />
            <span className="ml-2 text-gray-600 text-sm">(100 Reviews)</span>
            <span className="ml-2 text-green-500 text-sm">In Stock</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-4">$192.00</p>
          <p className="mb-4 text-sm">
            Mã sản phẩm:{" "}
            <span className="font-semibold bg-red-500 text-white px-2 py-1 rounded">
              R5XC
            </span>
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Playstation 5 Controller Skin High quality vinyl with air channel
            adhesive for easy bubble free install & mess free removal Pressure
            sensitive.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex border rounded">
              <button className="px-3 py-1 bg-gray-100 hover:bg-red-500 hover:text-white">
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-12 text-center"
              />
              <button className="px-3 py-1 bg-gray-100 hover:bg-red-500 hover:text-white">
                +
              </button>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-red-500 hover:bg-red-600 border-none"
            >
              Buy Now
            </Button>
            <Tooltip title="Add to Wishlist">
              <Button
                icon={<HeartOutlined />}
                size="large"
                className="border-gray-300"
              />
            </Tooltip>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <ShoppingCartOutlined className="text-xl" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCartOutlined className="text-xl" />
              <span>Return Delivery</span>
              <span className="text-gray-500">
                Free 30 Days Delivery Returns.{" "}
                <Link to="#" className="text-blue-500 hover:underline">
                  Details
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-l-full">
            Related Item
          </span>
          <span className="flex-grow border-t-2 border-red-500 ml-4"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedItems.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="block">
              <div className="bg-white rounded-lg shadow-md relative overflow-hidden group">
                {item.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    -{item.discount}%
                  </span>
                )}
                <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-500 font-bold">
                      ${item.price}
                    </span>
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ${item.oldPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Rate
                      disabled
                      defaultValue={item.rating}
                      className="text-yellow-400 text-xs"
                    />
                    <span className="ml-2 text-gray-500 text-xs">
                      ({item.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
