import { Navbar, Footer } from "@/components/Reusable";

export default function Layout({ children }: any) {
  return (
    <div className="">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
