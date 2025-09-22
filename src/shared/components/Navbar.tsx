import Image from "next/image";
import React from "react";
import { User } from "@/features/users/types/user";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { ROUTES } from "../constants";
import UserProfileDropdown from "./UserProfileDropdown";

interface NavbarProps {
  user: User | null;
  loading: boolean;
  onGetStarted: () => void; // prop for handling "Get Started" button click
  onLogout?: () => void; // Optional logout handler
}
export default function Navbar({user, loading, onGetStarted, onLogout}: NavbarProps) {

  /**
   * Helper function to render action-side of the navbar
   */
  function renderActions() {
    if (loading) {
      return ( // loading skeleton
        <Skeleton className="w-20 h-8 rounded-full" />
      );
    }
    else {
      if (user) {
        return ( // dashboard button and user profile
          <div className="flex items-center gap-2">
            <Link href={ROUTES.DASHBOARD}>
              <Button>Dashboard</Button>
            </Link>
            <UserProfileDropdown user={user} onLogout={onLogout} />
          </div>
        );
      }
      else {
        return ( // CTA button
          <Button
            onClick={onGetStarted}
          >Get started</Button>
        )
      }
    }
  }

  return (
    <nav className="flex-col">
      <div className="flex flex-1 justify-between items-center px-16 py-4 max-md:px-8 max-sm:px-6">
        {/* logo */}
        <div className="flex gap-2 items-center">
          <Image src="/brand/logo.svg" alt="Logo" width={30} height={30} />
          <h1 className="text-2xl font-medium">screw<strong className="text-accent-300 font-bold">it</strong></h1>
        </div>
        
        {/* links (big screens) */}
        <ul className="flex gap-8 items-center list-none max-sm:hidden">
          <li>
            <NavbarLink href={ROUTES.FEATURES} text="Features" />
          </li>
          <li>
            {/* TODO: replace with proper link to extension in the chrome store */}
            <NavbarLink href={ROUTES.EXTENSION} text="Extension" />
          </li>
          <li>
            {/* TODO: replace with proper link to demo page or video */}
            <NavbarLink href={ROUTES.DEMO} text="Demo" />
          </li>
        </ul>

        {/* actions */}
        <div className="flex gap-4 items-center">
          <Link href={ROUTES.GITHUB} target="_blank">
            <Image src="/icons/github.svg" width={20} height={20} className="object-contain" alt="Github" />
          </Link>
          {renderActions()}
        </div>

        {/* burger (mobile) */}

      </div>
    </nav>
  );
}

interface NavbarLinkProps {
  href: string;
  text: string;
  className?: string;
}
function NavbarLink({ href, text, className }: NavbarLinkProps) {
  return (
    <a href={href} className={`text-foreground text-sm no-underline hover:underline cursor-pointer ${className}`}>
      {text}
    </a>
  );
}