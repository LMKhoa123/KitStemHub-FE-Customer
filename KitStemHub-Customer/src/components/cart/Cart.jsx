import Footer from "../footer/Footer";
import NavbarUser from "../navbar/navbaruser/NavbarUser";
import CartContent from "./cartcontent/CartContent";
import CartNav from "./cartcontent/CartNav";

function Cart() {
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

export default Cart;
