'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    const menuItems = [
        { href: '/about', label: 'About Us' },
        { href: '/how-it-works', label: 'How It Works' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/support', label: 'Support' },
        { href: '/dispute', label: 'Raise a Dispute' },
        { href: '/terms-privacy', label: 'Terms & Privacy' },
    ]

    return (
        <div></div>
    )
}