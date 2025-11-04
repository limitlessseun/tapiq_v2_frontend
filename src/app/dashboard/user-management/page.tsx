"use client"

import { useState } from 'react'
import { Search, Eye, Edit, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const users = Array(10).fill(null).map(() => ({
    userId: 'user_009832',
    firstName: 'Dan',
    lastName: 'Chris',
    email: 'xyz@gmail.com',
    phone: '09084905012',
    reportsSubmitted: 12,
    scansUsed: 38,
    watchlistCount: 5,
    status: 'Active'
}))
users[0].status = 'Banned'

export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-indigo font-manrope">User Management</h1>
            </div>

            <div className="bg-white rounded-lg p-6 font-satoshi overflow-hidden">
                <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-6">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search By Full Name"
                            className="pl-2 border-[#E7EFFE] text-gray text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src="/assets/search-Icon.svg" alt="" className=" absolute right-3 top-3 h-4 w-4" />
                    </div>
                    <Select>
                        <SelectTrigger className="w-48 text-gray text-sm border-[#E7EFFE] bg-white">
                            <SelectValue placeholder="Filter By Role" />
                        </SelectTrigger>
                        <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-48 text-gray text-sm border-[#E7EFFE]">
                            <SelectValue placeholder="Filter By Status" />
                        </SelectTrigger>
                        <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full overflow-x-auto noscrollbar-hidden">
                    <Table className="min-w-[800px] w-full">
                        <TableHeader>
                            <TableRow className='text-gray text-sm font-normal border-none'>
                                <TableHead>USER ID</TableHead>
                                <TableHead>FIRST NAME</TableHead>
                                <TableHead>LAST NAME</TableHead>
                                <TableHead>EMAIL</TableHead>
                                <TableHead>PHONE</TableHead>
                                <TableHead>REPORTS SUBMITTED</TableHead>
                                <TableHead>SCANS USED</TableHead>
                                <TableHead>WATCHLIST COUNT</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead className='text-center'>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, i) => (
                                <TableRow key={i} className={`text-gray text-sm border-none ${i % 2 === 0 ? 'bg-cloudwhite' : 'bg-white'}`}>
                                    <TableCell className="text-blue-600">{user.userId}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.reportsSubmitted}</TableCell>
                                    <TableCell>{user.scansUsed}</TableCell>
                                    <TableCell>{user.watchlistCount}</TableCell>
                                    <TableCell>
                                        <p
                                            className={
                                                user.status === 'Active'
                                                    ? 'text-teal text-sm'
                                                    : 'text-red-700 text-sm'
                                            }
                                        >
                                            {user.status}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-center">
                                            <Button variant="ghost" size="sm" className="text-gray">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-gray">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-gray">
                                                <User className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-500">1-10 from 100</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">←</Button>
                        <Button variant="default" className='bg-primary text-white' size="sm">1</Button>
                        <Button variant="outline" size="sm">2</Button>
                        <Button variant="outline" size="sm">...</Button>
                        <Button variant="outline" size="sm">10</Button>
                        <Button variant="outline" size="sm">→</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}