import { Footer } from "antd/es/layout/layout";
import CartContent from "../../components/cart/cartcontent/CartContent";
import CartNav from "../../components/cart/cartcontent/CartNav";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function CartPage() {
  return (
    <>
      <NavbarUser />
      <div className="w-full min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <div className="pl-64">
            <CartNav />
          </div>
          <div className="flex justify-center">
            <CartContent />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default CartPage;
