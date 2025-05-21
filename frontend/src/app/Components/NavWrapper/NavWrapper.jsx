"use client";
import { usePathname } from "next/navigation";
import BusinessNavbar from "../BusinessNavbar/BusinessNavbar";
import Header from "../Navbar/Navbar";

export default function NavWrapper() {
  const pathname = usePathname();
  return pathname === "/pages/bussiness-listing" ? (
    <BusinessNavbar />
  ) : (
    <Header />
  );
}
