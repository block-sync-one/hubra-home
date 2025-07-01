"use client"
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
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";

export const Navbar = () => {
  const navItems = siteConfig.navItems.filter((item) => item.label !== "Stats" && item.label !== "Home");
  console.log(navItems);
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" 
    className="bg-transparent backdrop-filter-none"
    classNames={{
      menuItem:" text-[#797B92]",
      menu:" text-[#797B92]",
      item:" text-[#797B92]"
    }} >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
          <Logo className="text-primary" height={28} width={28} />  
            <p className="font-bold text-inherit">Hubra</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navItems.map((item) => (
            item.navItems ? (
              <NavbarItem key={item.label} className="relative">
                <Dropdown>
                  <DropdownTrigger>
                    <button
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "flex items-center gap-1 data-[active=true]:text-primary data-[active=true]:font-medium"
                      )}
                    >
                      {item.label}
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu >
                    {item.navItems.map((child) => (
                      <DropdownItem key={child.href} href={child.href} startContent={child.icon ? <Icon icon={`mdi:${child.icon}`} className="w-4 h-4 mr-2" /> : null}>
                        {child.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            ) : (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href || ""}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            )
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        
        <NavbarItem className="hidden md:flex">
          <Button
          variant="light"
          radius="full"
            isExternal
            as={Link}
            className="text-sm font-normal "
            href={siteConfig.links.sponsor}
            startContent={<Icon icon="hugeicons:chart-02" width="16" height="16" />}
            
          >
            Stats
           
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
          radius="full"
            isExternal
            as={Link}
            className="text-sm font-normal text-black bg-white"
            href={siteConfig.links.sponsor}
            endContent={<Icon icon="solar:alt-arrow-right-outline" width="14" height="14" />}
            variant="flat"
          >
            Launch App 
           
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
