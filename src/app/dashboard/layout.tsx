import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PageTransition } from "@/components/ui/PageTransition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative" style={{ background: "var(--background)" }}>
      {/* 
        Animated background (blobs + particles) is already rendered globally
        by <AnimatedBackground /> in the root layout.tsx.
        No duplicate needed here.
      */}

      {/* Content layer */}
      <div className="relative z-10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          {/* Main content — add bottom padding on mobile for the MobileNav bar */}
          <main className="flex-1 min-h-[calc(100vh-64px)] max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation — only visible on < lg screens */}
      <MobileNav />
    </div>
  );
}
