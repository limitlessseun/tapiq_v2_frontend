// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// export function Navbar() {
//     const [isOpen, setIsOpen] = useState(false)

//     const menuItems = [
//         { href: '/about', label: 'About Us' },
//         { href: '/how-it-works', label: 'How It Works' },
//         { href: '/faq', label: 'FAQ' },
//         { href: '/contact', label: 'Contact Us' },
//         { href: '/support', label: 'Support' },
//         { href: '/dispute', label: 'Raise a Dispute' },
//         { href: '/terms-privacy', label: 'Terms & Privacy' },
//     ]

//     return (
//         <>
//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center space-x-6">
//                 {menuItems.map((item) => (
//                     <Link
//                         key={item.href}
//                         href={item.href}
//                         className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//                     >
//                         {item.label}
//                     </Link>
//                 ))}
//                 <Button>
//                     SIGN UP
//                 </Button>
//             </div>

//             {/* Mobile Menu */}
//             <div className="md:hidden">
//                 <Sheet open={isOpen} onOpenChange={setIsOpen}>
//                     <SheetTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                             <MenuIcon className="h-6 w-6" />
//                         </Button>
//                     </SheetTrigger>
//                     <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//                         <nav className="flex flex-col space-y-4 mt-8">
//                             {menuItems.map((item) => (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
//                                     onClick={() => setIsOpen(false)}
//                                 >
//                                     {item.label}
//                                 </Link>
//                             ))}
//                             <Button className="w-full mt-4">
//                                 SIGN UP
//                             </Button>
//                         </nav>
//                     </SheetContent>
//                 </Sheet>
//             </div>
//         </>
//     )
// }