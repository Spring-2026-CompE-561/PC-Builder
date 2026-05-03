"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Cpu, LogOut, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/parts", label: "Parts" },
  { href: "/builds", label: "Builds" },
];

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === link.href
              ? "text-foreground bg-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const AuthButtons = ({ onClick }: { onClick?: () => void }) => {
    if (isLoading) return null;
    if (user) {
      return (
        <>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {user.username}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleLogout();
              onClick?.();
            }}
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sign-in" onClick={onClick}>
            Sign In
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up" onClick={onClick}>
            Sign Up
          </Link>
        </Button>
      </>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg shrink-0"
          >
            <Cpu className="w-5 h-5 text-primary" />
            <span>PC Builder</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLinks />
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <AuthButtons />
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-1">
                  <NavLinks onClick={() => setMobileOpen(false)} />
                </nav>
                <div className="border-t pt-4 flex flex-col gap-2">
                  <AuthButtons onClick={() => setMobileOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}