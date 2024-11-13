import CartContent from "./cartcontent/CartContent";
import CartNav from "./cartcontent/CartNav";

function Cart() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-screen">
      {/* Nav profile */}
      <div className="md:my-16">
        <CartNav />
      </div>

      {/* Nội dung chi tiết đơn hàng */}
      <div>
        <CartContent />
      </div>
    </div>
  );
}

export default Cart;
