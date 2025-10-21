import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen pb-24">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-gradient-divine flex items-center justify-center gap-2">
            ✨ Divine Answers
          </h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;
