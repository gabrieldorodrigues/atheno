import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 transition-all duration-300 p-8">
        {children}
      </main>
    </div>
  );
}
