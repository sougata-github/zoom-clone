"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="hamburger-menu"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="Yoom logo"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-white">Yoom</p>
          </Link>
          <ul className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <section className="flex h-full flex-col gap-6 pt-16 text-white">
              {sidebarLinks.map((link) => {
                const isActive =
                  pathname === link.route ||
                  (link.route !== "/" && pathname.startsWith(link.route));
                return (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.route}
                      className={cn(
                        "flex gap-4 items-center p-4 rounded-lg w-full max-w-60 transition-all",
                        isActive && "bg-blue-1"
                      )}
                    >
                      <Image
                        src={link.imgUrl}
                        alt={link.label}
                        width={20}
                        height={20}
                      />
                      <p className="text-base font-semibold">{link.label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </section>
          </ul>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
