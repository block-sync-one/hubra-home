"use client";
import { useState, useEffect } from "react";
import { Navbar as HeroUINavbar, NavbarContent, NavbarMenu, NavbarBrand, NavbarItem, NavbarMenuItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import NextLink from "next/link";
import { Icon } from "@iconify/react";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      <NavbarBrand as="li" className="gap-3 max-w-fit">
        <NextLink className="flex justify-start items-center gap-2" href="/">
          <Image alt="Hubra" className="rounded-none w-[22px] h-[22px] md:w-6 md:h-6" src="/logo.png" />
          <p className="font-bold text-white text-lg">Hubra</p>
        </NextLink>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden lg:flex gap-6" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.label}>
            {item.navItems ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                    endContent={<Icon icon="mdi:chevron-down" width={16} />}
                    variant="light">
                    {item.label}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label={`${item.label} menu`} className="bg-black/90 backdrop-blur-md border border-white/10">
                  {item.navItems.map((child) => (
                    <DropdownItem
                      key={child.href}
                      className="text-white hover:bg-white/10"
                      href={child.href}
                      startContent={child.icon && isMounted ? <Icon className="w-4 h-4" icon={child.icon} /> : null}>
                      {child.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <NextLink href={item.href}>
                <Button className="text-gray-300 hover:text-white transition-colors duration-200" variant="light">
                  {item.label}
                </Button>
              </NextLink>
            )}
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side content */}
      <NavbarContent justify="end">
        {/* Stats Button - Desktop only */}
        <NavbarItem className="hidden lg:flex">
          <NextLink href="/stats">
            <Button className="text-gray-300 hover:text-white transition-colors duration-200" variant="light">
              Stats
            </Button>
          </NextLink>
        </NavbarItem>

        {/* Launch App Button - Desktop only */}
        <NavbarItem className="hidden lg:flex">
          <Button
            as={Link}
            className="text-sm font-medium text-black bg-white hover:bg-gray-100 transition-colors duration-200"
            endContent={isMounted ? <Icon icon="solar:alt-arrow-right-outline" width={14} /> : null}
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
            className="text-white bg-transparent hover:bg-white/10 p-2"
            variant="light"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
        <div className="flex flex-col gap-4 py-6">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              {item.navItems ? (
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-white px-4 py-2">{item.label}</div>
                  <div className="space-y-1">
                    {item.navItems.map((child) => (
                      <NextLink
                        key={child.href}
                        className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        href={child.href}
                        onClick={() => setIsMenuOpen(false)}>
                        {child.icon && isMounted && <Icon className="w-5 h-5" icon={child.icon} />}
                        {child.label}
                      </NextLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NextLink
                  className="block px-4 py-3 text-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </NextLink>
              )}
            </NavbarMenuItem>
          ))}

          {/* Mobile Stats Button */}
          <NavbarMenuItem>
            <NextLink
              className="block px-4 py-3 text-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              href="/stats"
              onClick={() => setIsMenuOpen(false)}>
              Stats
            </NextLink>
          </NavbarMenuItem>

          {/* Mobile Launch App Button */}
          <div className="px-4 pt-4">
            <Button
              as={Link}
              className="w-full text-sm font-medium text-black bg-white hover:bg-gray-100 transition-colors duration-200"
              endContent={isMounted ? <Icon icon="solar:alt-arrow-right-outline" width={14} /> : null}
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
