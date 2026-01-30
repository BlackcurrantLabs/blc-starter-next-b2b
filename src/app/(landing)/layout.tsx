import LandingFooter from "./components/footer";
import LandingNavbar from "./components/navbar";

export default function PublicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        {children}
        {/* <div className="grow bg-muted" /> */}
      </main>
      <LandingFooter />
    </>
  );
}
