"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
  ];

  // Filter out the current page
  const visibleNavItems = navItems.filter((item) => item.href !== pathname);

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <HeartPulse className="h-8 w-8" />
          <span className="text-xl font-semibold">MediChat Assist</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {visibleNavItems.map((item) => (
            <Button key={item.label} variant="outline" className="text-xl font-semibold border-none" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-primary mb-4"
                >
                  <HeartPulse className="h-7 w-7" />
                  <span className="text-lg font-semibold">MediChat Assist</span>
                </Link>
                {visibleNavItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="default"
                    className="w-full justify-start text-lg font-semibold"
                    asChild
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
