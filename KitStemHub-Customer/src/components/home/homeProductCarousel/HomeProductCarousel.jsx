/* eslint-disable react/prop-types */
import { EyeOutlined, HeartOutlined } from "@ant-design/icons";

function HomeProductCarousel({ products, itemsToShow }) {
  const styleCard =
    "container bg-slate-50 w-64 shadow-xl hover-container flex flex-col relative my-7";
  const styleImg = "w-full shadow-md rounded-lg";
  const styleAddToCart = "absolute bottom-0 left-0 w-full hover-content";
  const stylebtnAddToCart =
    "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white py-2 w-full rounded-b-lg";
  const styleIcon =
    "absolute top-2 right-2 flex flex-col space-y-2 hover-content";
  const styleBtnIcon =
    "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 p-2 rounded-full shadow-md";

  return (
    <div className="grid grid-cols-4 gap-5 place-items-stretch h-auto">
      {products.slice(0, itemsToShow).map((product) => (
        <div key={product.id} className={styleCard}>
          <img className={styleImg} src={product.image} alt="" />
          {/* icon */}
          <div className={styleIcon}>
            <button className={styleBtnIcon}>
              <i className="text-white">
                <HeartOutlined />
              </i>
            </button>
            <button className={styleBtnIcon}>
              <i className="text-white">
                <EyeOutlined />
              </i>
            </button>
          </div>
          {/* button */}
          <div className={styleAddToCart}>
            <button className={stylebtnAddToCart}>Add To Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeProductCarousel;
