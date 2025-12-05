import AuthGuard from "@/components/Reusable/AuthGuard";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>

            {children}

        </div>
    );
};

export default Layout;