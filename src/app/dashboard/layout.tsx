"use client"

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: "/assets/overview.svg", href: "/dashboard" },
    { id: 'scam-reports', label: 'Scam Report Moderation', icon: "/assets/scam.svg", href: "/dashboard/scam-reports" },
    { id: 'user-management', label: 'User Management', icon: "/assets/user.svg", href: "/dashboard/user-management" },
    { id: 'dispute-resolution', label: 'Dispute Resolution', icon: "/assets/disputer.svg", href: "/dashboard/dispute-resolution" },
    { id: 'analytics', label: 'Analytics & Insights', icon: "/assets/analytics.svg", href: "/dashboard/analytics" },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    return (
        <div className="flex md:min-h-screen bg-white font-satoshi">
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 p-4 flex items-center justify-between">
                <div className="w-16 h-16 relative">
                    <Image
                        src="/assets/logo2.svg"
                        alt="TapIQ Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-600"
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <aside
                className={`
                    w-66 bg-cloudwhite p-2 fixed h-full z-50 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="w-24 h-24 relative ml-4 mb-4">
                    <Image
                        src="/assets/logo2.svg"
                        alt="TapIQ Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const active = isActive(item.href)

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Button
                                    size="lg"
                                    variant={active ? 'default' : 'ghost'}
                                    className={`w-full justify-start transition-colors py-6 my-2 group ${active
                                        ? 'bg-primary text-white hover:bg-primary/80'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className={`mr-3 transition-all duration-200 ${active ? 'filter brightness-0 invert' : 'group-hover:scale-110'
                                        }`}>
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    </div>
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-28 lg:pt-8 lg:ml-64">
                {children}
            </main>
        </div>
    )
}