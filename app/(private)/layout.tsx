import "../globals.css";
import Providers from "../providers";
import Sidebar from "@/src/components/Sidebar";


export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="antialiased min-h-screen">
        <Sidebar />
        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}
