import AuthGuard from "@/components/Reusable/AuthGuard";
import { Suspense } from "react";
interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Suspense>

            {children}

        </Suspense>
    );
};

export default Layout;