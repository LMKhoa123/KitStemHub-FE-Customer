import Footer from "../footer/Footer";
import NavbarUser from "../navbar/navbaruser/NavbarUser";
import CartContent from "./cartcontent/CartContent";
import CartNav from "./cartcontent/CartNav";

function Cart() {
  return (
    <div className="w-full h-screen">
      <NavbarUser />
      <div className="flex flex-col">
        <div className="pl-64">
          <CartNav />
        </div>
        <div className="flex justify-center">
          <CartContent />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
