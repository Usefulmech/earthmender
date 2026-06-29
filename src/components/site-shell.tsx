"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { AuthModal } from "@/components/auth-modal";
import { BrandMark } from "@/components/brand-mark";
import { NavIcon } from "@/components/nav-icon";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/components/auth-provider";
import { baseNavItems, navItemsByRole } from "@/lib/content";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading, logout } = useAuth();
  const { role } = useUserRole();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (!profile) {
        setIsAuthOpen(true);
      } else {
        const savedRole = window.sessionStorage.getItem("earthmender.pending-role");
        if (savedRole && savedRole !== profile.role) {
          setIsAuthOpen(true);
        }
      }
    }
  }, [isLoading, user, profile]);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      if (profile) {
        const currentRole = profile.role;
        
        // 1. Redirect from landing page `/` to their role home
        if (pathname === "/") {
          router.replace(currentRole === "mender" ? "/mender" : "/operator");
          return;
        }

        // 2. Prevent Menders from accessing Operator-only pages
        if (currentRole === "mender" && (pathname.startsWith("/operator") || pathname.startsWith("/insights"))) {
          router.replace("/mender");
          return;
        }

        // 3. Prevent Operators from accessing Mender-only pages
        if (currentRole === "operator" && (pathname.startsWith("/mender") || pathname.startsWith("/learn"))) {
          router.replace("/operator");
          return;
        }
      }
    } else {
      // 4. Redirect unauthenticated users trying to access protected dashboards
      const protectedPaths = ["/mender", "/operator", "/history", "/insights", "/learn"];
      if (protectedPaths.some(path => pathname.startsWith(path))) {
        router.replace("/");
      }
    }
  }, [isLoading, user, profile, pathname, router]);

  const navItems = role ? navItemsByRole[role] : baseNavItems;
  const homeHref = role === "mender" ? "/mender" : role === "operator" ? "/operator" : "/";

  async function handleSignOut() {
    await logout();
    window.location.href = "/";
  }

  function isActive(current: string, target: string) {
    if (target === "/") return current === target;
    return current.startsWith(target);
  }

  return (
    <div className="relative min-h-screen">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[var(--border)] bg-[rgba(255,255,255,0.95)] backdrop-blur-md">
        <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-12">
          <Link href={homeHref} className="transition-opacity hover:opacity-80">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex items-center gap-2 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? "text-[var(--foreground)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[var(--accent)] after:transition-all after:duration-300"
                  }`}
                >
                  <NavIcon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center">
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--border-light)]" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] text-xs font-bold text-white shadow-sm ring-2 ring-white hover:opacity-90 transition-opacity uppercase"
                  title="Your Profile"
                >
                  {profile ? profile.role.charAt(0) : "U"}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] text-white hover:bg-white hover:text-[var(--foreground)] border border-[var(--foreground)] transition-colors !py-1.5 !px-4 !text-[0.65rem] sm:!text-xs uppercase tracking-wider whitespace-nowrap"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="btn-primary !py-2 !px-5"
              >
                Join
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen w-full flex-1 flex-col px-4 pb-16 pt-24 sm:px-6 sm:pb-12 lg:px-12">
        {children}
      </main>

      <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--background)] px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full flex-col items-center gap-8">
          <BrandMark />
          <div className="flex flex-wrap justify-center gap-8 text-xs font-medium text-[var(--muted)]">
            <a href="#" className="hover:text-[var(--foreground)]">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)]">Terms</a>
            <a href="#" className="hover:text-[var(--foreground)]">Contact</a>
          </div>
          <div className="text-xs text-[var(--muted-light)]">
            © {new Date().getFullYear()} earthmender.
          </div>
        </div>
      </footer>

      {/* Sleek Mobile Nav */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[var(--border)] bg-white/95 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors ${
                active 
                  ? "bg-[var(--foreground)] text-white" 
                  : "text-[var(--muted)] hover:bg-[var(--accent-surface)] hover:text-[var(--foreground)]"
              }`}
            >
              <NavIcon name={item.icon} className="h-5 w-5" />
              <span className="text-[0.65rem] font-bold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
