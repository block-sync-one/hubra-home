"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import NextLink from "next/link";
import NextImage from "next/image";
import { ChevronDown, ArrowRight } from "lucide-react";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Check if a path is currently active
   * @param href - The path to check
   * @returns true if the path matches the current pathname
   */
  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  /**
   * Check if a dropdown menu has any active child items
   * @param navItems - Array of navigation items
   * @returns true if any child item is active
   */
  const hasActiveChild = (navItems?: Array<{ href: string; label: string; icon?: string }>): boolean => {
    return navItems?.some((child) => isActive(child.href)) ?? false;
  };

  // Filter navigation items (exclude Home for desktop, Stats will be separate)
  const navItems = siteConfig.navItems.filter((item) => item.label !== "Home" && item.label !== "Stats");

  return (
    <HeroUINavbar
      className="backdrop-blur-md bg-black/20 border-b border-white/10"
      classNames={{
        base: "z-50",
        wrapper: "max-w-7xl mx-auto ",
        menuItem: "text-white",
        menu: "text-white bg-black/90 backdrop-blur-md",
        item: "text-white",
      }}
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}>
      {/* Brand/Logo */}
      <NavbarBrand as="li" className="gap-3 max-w-fit md:mr-16">
        <NextLink className="flex justify-start items-center gap-2" href="/">
          <NextImage priority alt="Hubra" className="rounded-none" height={24} src="/logo.png" width={24} />
          <p className="font-bold text-white text-lg">Hubra</p>
        </NextLink>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden lg:flex " justify="center">
        {navItems.map(
          (item) =>
            item.show && (
              <NavbarItem key={item.label}>
                {item.navItems ? (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className={`font-medium text-sm transition-colors duration-200 ${
                          hasActiveChild(item.navItems)
                            ? "text-primary border-b-2 border-primary rounded-none hover:rounded-xl"
                            : "text-[#797B92] hover:text-white"
                        }`}
                        endContent={<ChevronDown size={16} />}
                        variant="light">
                        {item.label}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label={`${item.label} menu`} className="bg-black/90 backdrop-blur-md border border-white/10">
                      {item.navItems.map((child) => (
                        <DropdownItem
                          key={child.href}
                          as={NextLink}
                          className={`transition-colors duration-200 ${
                            isActive(child.href)
                              ? "text-white bg-white/20 font-semibold"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                          href={child.href}
                          startContent={null}>
                          {child.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  item.href && (
                    <Button
                      as={NextLink}
                      className={`font-medium text-sm transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-primary border-b-2 border-primary rounded-none hover:rounded-xl"
                          : "text-[#797B92] hover:text-white"
                      }`}
                      href={item.href}
                      variant="light">
                      {item.label}
                    </Button>
                  )
                )}
              </NavbarItem>
            )
        )}
      </NavbarContent>

      {/* Right side content */}
      <NavbarContent justify="end">
        {/* Stats Button - Desktop only */}
        {/*        <NavbarItem className="hidden lg:flex">
          <NextLink href="/stats">
            <Button className="text-gray-300 hover:text-white transition-colors duration-200" variant="light">
              Stats
            </Button>
          </NextLink>
        </NavbarItem>*/}

        {/* Launch App Button - Desktop only */}
        <NavbarItem className="hidden lg:flex">
          <Button
            as={Link}
            className="text-sm font-medium text-black bg-white hover:bg-gray-100 transition-colors duration-200"
            endContent={isMounted ? <ArrowRight size={14} /> : null}
            href={siteConfig.links.app}
            radius="full"
            variant="flat">
            Launch App
          </Button>
        </NavbarItem>

        {/* Mobile menu toggle - Right side */}
        <NavbarItem className="lg:hidden">
          <Button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-primary bg-transparent hover:bg-white/10 p-2"
            variant="light"
            onPress={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="flex flex-col gap-1">
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/90 backdrop-blur-md border-t border-white/10">
        <div className="flex flex-col">
          {siteConfig.navMenuItems.map(
            (item, index) =>
              item.show && (
                <NavbarMenuItem key={`${item.label}-${index}`}>
                  {item.navItems ? (
                    <div className="space-y-2">
                      <div className={`text-lg font-semibold px-4 py-2 ${hasActiveChild(item.navItems) ? "text-white" : "text-gray-400"}`}>
                        {item.label}
                      </div>
                      <div className="space-y-1">
                        {item.navItems.map((child) => (
                          <NextLink
                            key={child.href}
                            className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                              isActive(child.href)
                                ? "text-white bg-white/20 font-semibold border-l-4 border-white"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                            href={child.href}
                            onClick={() => setIsMenuOpen(false)}>
                            {child.label}
                          </NextLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    item.href && (
                      <NextLink
                        className={`block py-3 text-lg transition-colors duration-200 ${
                          isActive(item.href)
                            ? "text-primary bg-white/20 font-semibold border-l-4 border-primary pl-4"
                            : "text-gray-300 hover:text-white hover:bg-white/10 pl-4"
                        }`}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}>
                        {item.label}
                      </NextLink>
                    )
                  )}
                </NavbarMenuItem>
              )
          )}

          {/* Mobile Stats Button */}
          {/*          <NavbarMenuItem>
            <NextLink
              className={`block py-3 text-lg transition-colors duration-200 ${
                isActive("/stats")
                  ? "text-white bg-white/20 font-semibold border-l-4 border-white pl-4"
                  : "text-gray-300 hover:text-white hover:bg-white/10 pl-0"
              }`}
              href="/stats"
              onClick={() => setIsMenuOpen(false)}>
              Stats
            </NextLink>
          </NavbarMenuItem>*/}

          {/* Mobile Launch App Button */}
          <div className="pt-4">
            <Button
              as={Link}
              className="w-full text-sm font-medium text-black bg-white hover:bg-gray-100 transition-colors duration-200"
              endContent={isMounted ? <ArrowRight size={14} /> : null}
              href={siteConfig.links.app}
              radius="full"
              variant="flat"
              onPress={() => setIsMenuOpen(false)}>
              Launch App
            </Button>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
