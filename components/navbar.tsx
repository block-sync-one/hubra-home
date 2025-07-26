"use client";
import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Icon } from "@iconify/react";

import { useWindowSize } from "../lib/useWindowSize";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useWindowSize();

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = siteConfig.navItems.filter(
    (item) => item.label !== "Stats" && item.label !== "Home",
  );

  return (
    <HeroUINavbar
      className="backdrop-filter-none"
      classNames={{
        menuItem: "text-white",
        menu: " text-white",
        item: " text-white",
      }}
      maxWidth="2xl"
      position="sticky"
    >
      <div className="flex flex-row items-center justify-between lg:justify-start w-full">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Image
              alt="Hubra"
              className="rounded-none w-[22px] h-[22px] md:w-6 md:h-6"
              src="/logo.png"
            />
            <p className="font-bold text-white text-lg">Hubra</p>
          </NextLink>
        </NavbarBrand>
        {/* <ul className="hidden lg:flex gap-4 justify-start items-center ml-4">
          {navItems.map((item) =>
            item.navItems ? (
              <NavbarItem key={item.label} className="relative">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "flex items-center gap-1 data-[active=true]:text-primary data-[active=true]:font-medium text-[#797B92] hover:text-white",
                      )}
                      variant="light"
                    >
                      {item.label}
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {item.navItems.map((child) => (
                      <DropdownItem
                        key={child.href}
                        href={child.href}
                        startContent={
                          child.icon && isMounted ? (
                            <Icon
                              className="w-4 h-4 mr-2"
                              icon={`mdi:${child.icon}`}
                            />
                          ) : null
                        }
                      >
                        {child.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            ) : (
              <NavbarItem key={item.href}>
                <Button
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "flex items-center gap-1 data-[active=true]:text-primary data-[active=true]:font-medium text-[#797B92] hover:text-white",
                  )}
                  href={item.href}
                  variant="light"
                >
                  {item.label}
                </Button>
              </NavbarItem>
            ),
          )}
        </ul> */}
        {/* Mobile menu toggle button */}
      
      </div>

      <NavbarContent
        className=" lg:flex basis-1/5 lg:basis-full"
        justify="end"
      >
        {/* <NavbarItem>
          <Button
            disabled
            isExternal
            as={Link}
            className="text-sm font-normal "
            radius="full"
            startContent={
              isMounted ? (
                <Icon height="16" icon="hugeicons:chart-02" width="16" />
              ) : null
            }
            variant="light"
          >
            Stats
          </Button>
        </NavbarItem> */}
        <NavbarItem>
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-black bg-white"
            endContent={
              isMounted ? (
                <Icon
                  height="14"
                  icon="solar:alt-arrow-right-outline"
                  width="14"
                />
              ) : null
            }
            href={siteConfig.links.app}
            radius="full"
            variant="flat"
          >
            Launch App
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu Overlay */}
      {/* {menuOpen && (
        <div
          className="fixed left-0 right-0 top-16 z-50 bg-black bg-opacity-90 flex flex-col transition-all duration-300 lg:hidden"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Image
                alt="Hubra"
                className="rounded-none w-6 h-6"
                src="/logo.png"
              />
              <span className="font-bold text-white text-lg">Hubra</span>
            </div>
            <button
              aria-label="Close menu"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setMenuOpen(false)}
            >
              <Icon
                className="text-white"
                height="28"
                icon="mdi:close"
                width="28"
              />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 py-6 flex-1">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.label}-${index}`}>
                {item.href ? (
                  <NextLink legacyBehavior passHref href={item.href}>
                    <Button
                      as="a"
                      className="justify-start text-left text-white text-lg px-0 bg-transparent hover:bg-white/10"
                      size="lg"
                      variant="light"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </NextLink>
                ) : (
                  <span className="text-lg text-white">{item.label}</span>
                )}
              </NavbarMenuItem>
            ))}
           
            <Button
              isExternal
              as={Link}
              className="mt-8 text-sm font-normal text-black bg-white w-full"
              endContent={
                isMounted ? (
                  <Icon
                    height="14"
                    icon="solar:alt-arrow-right-outline"
                    width="14"
                  />
                ) : null
              }
              href={siteConfig.links.sponsor}
              radius="full"
              variant="flat"
              onClick={() => setMenuOpen(false)}
            >
              Launch App
            </Button>
          </div>
        </div>
      )} */}
      {/* End Mobile Menu Overlay */}

      {/* Desktop NavbarMenu (for accessibility, but hidden on mobile) */}
      <NavbarMenu  />
    </HeroUINavbar>
  );
};
