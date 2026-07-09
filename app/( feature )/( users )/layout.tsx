import Navbar from "./components/navbar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Account-focused Navbar */}
      <Navbar />
      
      {/* Dashboard Main Content */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
