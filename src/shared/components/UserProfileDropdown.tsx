"use client"

import { User } from "@/features/users/types/user";
import Image from "next/image";
import { ROUTES, defaultProfilePicture } from "../constants";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserProfileDropdownProps {
  user: User;
  onLogout?: () => void;
  showDashboardLink?: boolean;
}

export default function UserProfileDropdown({ 
  user, 
  onLogout, 
  showDashboardLink = true 
}: UserProfileDropdownProps) {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push(ROUTES.DASHBOARD);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout logic - you might want to implement this
      console.log("Logout clicked");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <Image 
            src={user.profilePicture || defaultProfilePicture} 
            alt="Profile"
            width={32}
            height={32}
            className="object-cover rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {showDashboardLink && (
          <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
