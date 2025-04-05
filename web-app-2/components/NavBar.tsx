"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";
import path from "path";

const NavbarComponent = () => {
  const pathname = usePathname(); // Get the current route
  console.log(pathname); // Log the current route

  return (
    <Navbar className={styles.navbar}>
      <NavbarBrand>
        <p className="font-bold text-inherit">WFN Contribution Tracker</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            href="/"
            id={pathname === "/" ? "active" : undefined} // Highlight if on RecordPage
          >
            Record
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/class"
            id={pathname === "/class" ? "active" : undefined} // Highlight if on ClassPage
          >
            Classes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/lecture"
            id={pathname === "/lecture" ? "active" : undefined} // Highlight if on LecturePage
          >
            Lectures
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
