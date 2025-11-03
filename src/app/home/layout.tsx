import { Navbar, Footer, BottomNavigation } from "@/components/Reusable";



export default function Layout({ children }: any) {

    return (
        <div className="">
            <Navbar />
            {children}
            <Footer />
            <BottomNavigation />
        </div>
    );
}
