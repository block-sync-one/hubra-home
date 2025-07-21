"use client"
import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {Image} from "@heroui/image";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";

import { Icon } from "@iconify/react";
import { Badge } from "@heroui/badge";

export const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = siteConfig.navItems.filter((item) => item.label !== "Stats" && item.label !== "Home");
  return (
    <HeroUINavbar maxWidth="2xl" position="sticky"
      className=" backdrop-filter-none"
      classNames={{
        menuItem: " text-white",
        menu: " text-white",
        item: " text-white"
      }} >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Image src="/logo.png" alt="Hubra"  className="rounded-none w-4 h-4 md:w-6 md:h-6" />
            <p className="font-bold text-white">Hubra</p>
          </NextLink>
        </NavbarBrand>
        {/* <ul className=" lg:flex gap-4 justify-start items-center ml-4">
          {navItems.map((item) => (
            item.navItems ? (
              <NavbarItem key={item.label} className="relative">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "flex items-center gap-1 data-[active=true]:text-primary data-[active=true]:font-medium"
                      )}
                    >
                      {item.label}
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu >
                    {item.navItems.map((child) => (
                      <DropdownItem key={child.href} href={child.href} startContent={child.icon && isMounted ? <Icon icon={`mdi:${child.icon}`} className="w-4 h-4 mr-2" /> : null}>
                        {child.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            ) : (
              <NavbarItem key={item.href}>
                <Button
                  variant="light"
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "flex items-center gap-1 data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  href={item.href}
                >
                  {item.label}
                </Button>
              </NavbarItem>
            )
          ))}
        </ul> */}
      </NavbarContent>

      <NavbarContent
        className=" sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >

        <NavbarItem className="hidden lg:flex">
          <Button
            variant="light"
            radius="full"
            isExternal
            as={Link}
            disabled
            className="text-sm font-normal "
           
            startContent={isMounted ? <Icon icon="hugeicons:chart-02" width="16" height="16" /> : null}

          >
            Stats 

          </Button>
        </NavbarItem>
        <NavbarItem className=" lg:flex">
          <Button
            radius="full"
            
            isExternal
            as={Link}
            className="text-sm font-normal text-black bg-white"
            href={siteConfig.links.sponsor}
            endContent={isMounted ? <Icon icon="solar:alt-arrow-right-outline" width="14" height="14" /> : null}
            variant="flat"
          >
            Launch App

          </Button>
        </NavbarItem>
      </NavbarContent>

 

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              {item.href ? (
                <NextLink href={item.href} passHref legacyBehavior>
                  <Button
                    as="a"
                    variant="light"
                    className="w-full justify-start text-left"
                    size="lg"
                  >
                    {item.label}
                  </Button>
                </NextLink>
              ) : (
                <span className="text-lg">{item.label}</span>
              )}
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
