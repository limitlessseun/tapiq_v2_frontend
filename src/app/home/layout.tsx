import { Footer, BottomNavigation } from "@/components/Reusable";

export default function Layout({ children }: any) {
  return (
    <div className="">
      {children}
      <Footer />
      <BottomNavigation />
    </div>
  );
}
