// ==================== FILE: app/(dashboard)/layout.tsx ====================
"use client"

import { useState } from 'react'
import { BarChart3, Shield, Users, Gavel, FileText, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Page = 'dashboard' | 'scam-reports' | 'user-management' | 'dispute-resolution' | 'analytics'

const menuItems = [
    { id: 'dashboard/' as Page, label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'dashboard/scam-reports' as Page, label: 'Scam Report Moderation', icon: Shield },
    { id: 'dashboard/user-management/' as Page, label: 'User Management', icon: Users },
    { id: 'dashboard/dispute-resolution/' as Page, label: 'Dispute Resolution', icon: Gavel },
    { id: 'dashboard/analytics/' as Page, label: 'Analytics & Insights', icon: FileText },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const currentPage = pathname.split('/').pop() as Page || 'dashboard'

    return (
        <div className="flex md:min-h-screen bg-white font-satoshi">
            {/* Mobile Menu Button */}
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

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    w-64 bg-cloudwhite p-4 fixed h-full z-50 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="w-24 h-24 relative mb-8">
                    <Image
                        src="/assets/logo2.svg"
                        alt="TapIQ Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPage === item.id

                        return (
                            <Link
                                key={item.id}
                                href={`/${item.id === 'dashboard' ? '' : item.id}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Button
                                    size="lg"
                                    variant={isActive ? 'default' : 'ghost'}
                                    className={`w-full justify-start transition-colors py-6 my-2 ${isActive
                                        ? 'bg-primary text-white hover:bg-primary/80'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-24 lg:pt-8 lg:ml-64">
                {children}
            </main>
        </div>
    )
}