import Link from "next/link";

import MobileNav from "./MobileNav";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { Video } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-1">
        <Video className="text-white h-8 w-8 mr-2 max-sm:hidden" />
        <p className="text-[28px] font-extrabold text-blue-1 ">Yoom</p>
      </Link>

      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
