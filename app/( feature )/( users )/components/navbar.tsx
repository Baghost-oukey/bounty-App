"use client";

import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User, LogOut, Settings, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Mock user details for premium dashboard display
  const user = {
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@bounty.id",
    role: "Premium Member",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-transparent">
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6">
          <nav
            className={cn(
              "w-full flex items-center h-16 justify-between gap-4 transition-all duration-500",
              sticky
                ? "p-2.5 bg-background/80 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full px-6"
                : "bg-transparent border-transparent"
            )}
          >
            {/* Logo and Brand Name */}
            <Link href="/" className="flex items-center gap-2 select-none">
              <Logo />
              <span className="font-bold text-lg tracking-tight hidden sm:block">Bounty</span>
            </Link>

            {/* Account Details and Actions */}
            <div className="flex items-center gap-4">

              {/* Profile Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="p-1 pr-3 rounded-full hover:bg-muted/80 flex items-center gap-2.5 transition-colors border border-transparent hover:border-border/30 cursor-pointer outline-none"
                    />
                  }
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-md select-none">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden md:flex flex-col items-start text-left select-none">
                    <span className="text-sm font-semibold text-foreground leading-none mb-0.5">
                      {user.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium rounded-full leading-none">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-1.5">
                  <DropdownMenuLabel className="font-normal px-2.5 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-xl cursor-pointer">
                    <User size={16} className="mr-2 opacity-70" />
                    <span>Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl cursor-pointer">
                    <Settings size={16} className="mr-2 opacity-70" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut size={16} className="mr-2 opacity-70" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
