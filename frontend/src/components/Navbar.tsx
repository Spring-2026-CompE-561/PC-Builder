"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Cpu, LogOut, Menu, User, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/parts", label: "Parts" },
  { href: "/builds", label: "Builds" },
];

export function Navbar() {
  const { user, isLoading, logout, deleteAccount } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDarkMode(false);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteAccount();
      router.push("/");
    } catch {
      alert("Could not delete account.");
    }
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
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {user.username}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await handleDeleteAccount();
              onClick?.();
            }}
          >
            Delete Account
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleLogout();
              onClick?.();
            }}
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            router.push("/sign-in");
            onClick?.();
          }}
        >
          Sign In
        </Button>
        <Button
          size="sm"
          onClick={() => {
            router.push("/sign-up");
            onClick?.();
          }}
        >
          Sign Up
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

          {/* Desktop auth + theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <AuthButtons />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-1">
                  <NavLinks onClick={() => setMobileOpen(false)} />
                </nav>
                <div className="border-t pt-4 flex flex-col gap-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {darkMode ? "Light mode" : "Dark mode"}
                  </button>
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