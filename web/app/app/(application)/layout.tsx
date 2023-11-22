import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="sm:ml-64 pt-20 dark:bg-gray-800">{children}</div>
    </>
  );
}
