import Footer from "../../components/footer/Footer";
import NavbarEx from "../../components/navbar/navbarEx/NavbarEx";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";
import ProductDetail from "../../components/productDetail/ProductDetail";

function ProductDetailPage() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      {/* Hiển thị NavbarUser nếu đã đăng nhập, ngược lại hiển thị NavbarEx */}
      {isLoggedIn ? <NavbarUser /> : <NavbarEx />}
      <ProductDetail />
      <Footer />
    </>
  );
}

export default ProductDetailPage;
