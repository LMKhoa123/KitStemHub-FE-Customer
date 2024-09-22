import { EyeOutlined, HeartOutlined } from "@ant-design/icons";

function HomeProductCarousel() {
  const styleCard =
    "container bg-slate-50 w-64 shadow-xl hover-container flex flex-col relative";
  const styleImg = "w-full shadow-md rounded-lg";
  // const icon =
  //   "absolute top-2 right-2 flex flex-col space-y-2 hover-content";
  const styleAddToCart = "absolute bottom-0 left-0 w-full hover-content";
  const stylebtnAddToCart =
    "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white py-2 w-full rounded-b-lg";

  const styleIcon =
    "absolute top-2 right-2 flex flex-col space-y-2 hover-content";

  const styleBtnIcon =
    "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 p-2 rounded-full shadow-md";
  return (
    <div className="grid grid-cols-4 gap-4 place-items-stretch h-96">
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
      <div className={styleCard}>
        <img
          className={styleImg}
          src="https://nshopvn.com/wp-content/uploads/2024/03/bai-tap-phu-cam-bien-vat-can-ajkt-1-600x600.jpg"
          alt=""
        />

        {/* icon */}
        <div className={styleIcon}>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <HeartOutlined />
            </i>
          </button>
          <button className={styleBtnIcon}>
            <i className=" text-white">
              <EyeOutlined />
            </i>
          </button>
        </div>

        {/* button */}
        <div className={styleAddToCart}>
          <button className={stylebtnAddToCart}>Add To Cart</button>
        </div>
      </div>
    </div>
  );
}

export default HomeProductCarousel;
