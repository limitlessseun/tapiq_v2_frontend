"use client"
import Image from 'next/image'
import { useState } from 'react'
import { Search, MoreVertical } from 'lucide-react'
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const disputes = Array(8).fill(null).map((_, i) => ({
    id: '#3009',
    vendor: '@real_cakesbyzainab',
    raisedBy: 'Claimed Business',
    reportedBy: 'Dan',
    reportId: '37467',
    type: 'Impersonation',
    status: i === 0 ? 'Escalated' : i % 3 === 0 ? 'Pending' : 'Resolved'
}))

export default function DisputeResolutionPage() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-indigo font-manrope">Dispute Resolution</h1>
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
                            <SelectValue placeholder="Filter By Date" />
                        </SelectTrigger>
                        <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                            <SelectItem value="recent">Recent</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-48 text-gray text-sm border-[#E7EFFE]">
                            <SelectValue placeholder="Filter By Status" />
                        </SelectTrigger>
                        <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="escalated">Escalated</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-48 text-gray text-sm border-[#E7EFFE]">
                            <SelectValue placeholder="Filter By Reason" />
                        </SelectTrigger>
                        <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="impersonation">Impersonation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full overflow-x-auto noscrollbar-hidden">
                    <Table className="min-w-[800px] w-full">
                        <TableHeader>
                            <TableRow className='text-gray text-sm font-normal border-none'>
                                <TableHead>DISPUTE ID</TableHead>
                                <TableHead>VENDOR</TableHead>
                                <TableHead>RAISED BY</TableHead>
                                <TableHead>REPORTED BY</TableHead>
                                <TableHead>REPORT ID</TableHead>
                                <TableHead>DISPUTE TYPE</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead className='text-left'>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disputes.map((dispute, i) => (
                                <TableRow key={i} className={`text-gray text-sm border-none ${i % 2 === 0 ? 'bg-cloudwhite' : 'bg-white'}`}>
                                    <TableCell className="font-medium">{dispute.id}</TableCell>
                                    <TableCell>{dispute.vendor}</TableCell>
                                    <TableCell className="text-blue-600">{dispute.raisedBy}</TableCell>
                                    <TableCell>{dispute.reportedBy}</TableCell>
                                    <TableCell>{dispute.reportId}</TableCell>
                                    <TableCell>{dispute.type}</TableCell>
                                    <TableCell>
                                        <p
                                            className={
                                                dispute.status === 'Resolved'
                                                    ? 'text-teal text-sm'
                                                    : dispute.status === 'Pending'
                                                        ? 'text-yellow-500 text-sm'
                                                        : 'text-red-700 text-sm'
                                            }
                                        >
                                            {dispute.status}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-center">
                                            <Button variant="outline" size="sm" className="text-teal text-xs border-teal">
                                                RESOLVE
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-600 text-xs">
                                                ESCALATE
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                                                    <DropdownMenuItem>
                                                        <Image src="/assets/eye.svg" alt="fire" width={24} height={24} />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Image src="/assets/tag.svg" alt="fire" width={24} height={24} />
                                                        Tag Scam Type
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Image src="/assets/dcheck.svg" alt="fire" width={24} height={24} />
                                                        Approve Report
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Image src="/assets/clear.svg" alt="fire" width={24} height={24} />
                                                        Reject & Archive
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Image src="/assets/que.svg" alt="fire" width={24} height={24} />
                                                        Request More Info
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Image src="/assets/link.svg" alt="fire" width={24} height={24} />
                                                        Link to Existing Vendor
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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