"use client"
import Image from 'next/image'
import { useState } from 'react'
import { Search, FileText, Gavel } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, AreaChart, Area } from 'recharts'

const reportsData = [
    { month: 'Jan', value: 42 },
    { month: 'Feb', value: 18 },
    { month: 'Mar', value: 65 },
    { month: 'Apr', value: 28 },
    { month: 'May', value: 43 },
    { month: 'Jun', value: 18 },
    { month: 'Jul', value: 32 },
    { month: 'Aug', value: 88 },
    { month: 'Sep', value: 31 },
    { month: 'Oct', value: 53 },
    { month: 'Dec', value: 21 },
]

const watchlistData = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 20 },
    { month: 'Mar', value: 28 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 18 },
    { month: 'Jun', value: 32 },
    { month: 'Jul', value: 50 },
    { month: 'Aug', value: 68 },
    { month: 'Sep', value: 35 },
    { month: 'Oct', value: 42 },
    { month: 'Dec', value: 20 },
]

const StatCard = ({ title, value, img }: { title: string; value: string | number; img: string }) => (
    <Card className='border-none bg-cloudwhite shadow-none font-satoshi'>
        <CardContent className="p-4">
            <div className="flex flex-col items-start gap-2 justify-between">
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <div className='flex items-center justify-between min-w-1/2'>
                    <div className="text-primary bg-white p-2 rounded-full">
                        <Image src={img} alt={img} width={24} height={24} />
                    </div>
                    <p className="text-3xl font-semibold text-indigo">{value}</p>

                </div>

            </div>
        </CardContent>
    </Card>
)

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-semibold mb-8 font-manrope">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 font-satoshi">
                <StatCard title="New Reports Today" value="86" img="/assets/doc.svg" />
                <StatCard title="Reports Awaiting Review" value="12" img="/assets/edit.svg" />
                <StatCard title="Total Reports Approved" value="5900" img="/assets/uploadb.svg" />
                <StatCard title="Scan Requests (24h)" value="541" img="/assets/foldersearch.svg" />
                <StatCard title="Total Scan Request" value="475888" img="/assets/foldercheck.svg" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 font-satoshi">
                <StatCard title="Flagged Messages" value="27" img="/assets/flagged.svg" />
                <StatCard title="New Disputes Raised" value="4" img="/assets/megaphone.svg" />
                <StatCard title="Dispute Resolved" value="3" img="/assets/checked.svg" />
                <StatCard title="Pending Dispute" value="1" img="/assets/dispute.svg" />
                <Card className='border-none bg-cloudwhite shadow-none font-satoshi'>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 mb-1">Top Trending Scam Type</p>
                        <div className='flex items-center justify-between w-full mt-2 gap-2'>
                            <div className="text-primary bg-white p-2 rounded-full">
                                <Image src="/assets/fire.svg" alt="fire" width={24} height={24} />
                            </div>
                            <p className="text-sm font-bold text-indigo">No delivery after payment.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Heatmap */}
            <Card className="mb-8 border-none  shadow-none font-satoshi">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                        Heatmap of Scam Reports by Industry
                        <Select defaultValue="fashion" >
                            <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm focus:none outline:none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="tech">Tech</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-24 gap-0 shadow-[0px_4px_12px_0px_#E0E8F7AD]">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className="flex-1 gap-0"
                                style={{
                                    backgroundColor: `rgba(12, 85, 83, ${0.9 - i * 0.1})`
                                }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className='border-none shadow-[0px_4px_12px_0px_#E0E8F7AD] font-satoshi'>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                            Reports Over Time
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm focus:none outline:none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={reportsData}>
                                <defs>
                                    <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3381F0" />
                                        <stop offset="100%" stopColor="#282D99" />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="url(#gradientFill)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className='border-none shadow-[0px_4px_12px_0px_#E0E8F7AD] font-satoshi'>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                            Watchlist Alert Volume
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm focus:none outline:none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={watchlistData}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#185CBC" />
                                        <stop offset="100%" stopColor="rgba(24, 92, 188, 0)" />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    fill="url(#areaGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}