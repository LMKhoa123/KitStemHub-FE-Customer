import React from "react";
import KitCategory from "../../components/home/KitCategory";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";
import NavbarEx from "../../components/navbar/navbarEx/NavbarEx";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/login/navbar/Navbar";

function CategoryDetailPage() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      {isLoggedIn ? <NavbarUser /> : <Navbar />}

      <KitCategory />

      <Footer />
    </>
  );
}

export default CategoryDetailPage;
