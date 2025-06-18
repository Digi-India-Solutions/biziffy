"use client";
import { usePathname } from "next/navigation";
import BusinessNavbar from "../BusinessNavbar/BusinessNavbar";
import Header from "../Navbar/Navbar";

export default function NavWrapper() {
  const pathname = usePathname();
  console.log("pathname", pathname);
  const isBusinessListingPage = pathname?.startsWith("/pages/bussiness-listing/");
  return isBusinessListingPage ? (
    <BusinessNavbar />
  ) : (
    <Header />
  );
}
