import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="min-h-screen flex bg-warm-100">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0 pb-24 md:pb-10">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-5">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
