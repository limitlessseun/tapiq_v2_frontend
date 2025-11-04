// ==================== FILE: app/(dashboard)/analytics/page.tsx ====================
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

// Sample data for charts
const reportTrendsData = [
    { month: 'Jan', value: 42 },
    { month: 'Feb', value: 58 },
    { month: 'Mar', value: 65 },
    { month: 'Apr', value: 48 },
    { month: 'May', value: 73 },
    { month: 'Jun', value: 88 },
    { month: 'Jul', value: 92 },
    { month: 'Aug', value: 105 },
    { month: 'Sep', value: 98 },
    { month: 'Oct', value: 112 },
    { month: 'Nov', value: 125 },
    { month: 'Dec', value: 118 },
]

const scamTypeData = [
    { month: 'Jan', value: 35 },
    { month: 'Feb', value: 42 },
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 51 },
    { month: 'May', value: 48 },
    { month: 'Jun', value: 62 },
    { month: 'Jul', value: 58 },
    { month: 'Aug', value: 71 },
    { month: 'Sep', value: 65 },
    { month: 'Oct', value: 78 },
    { month: 'Nov', value: 82 },
    { month: 'Dec', value: 76 },
]

const userActivityData = [
    { month: 'Jan', value: 1250 },
    { month: 'Feb', value: 1380 },
    { month: 'Mar', value: 1520 },
    { month: 'Apr', value: 1650 },
    { month: 'May', value: 1820 },
    { month: 'Jun', value: 2010 },
    { month: 'Jul', value: 2180 },
    { month: 'Aug', value: 2450 },
    { month: 'Sep', value: 2620 },
    { month: 'Oct', value: 2890 },
    { month: 'Nov', value: 3120 },
    { month: 'Dec', value: 3380 },
]

const responseTimeData = [
    { month: 'Jan', value: 24 },
    { month: 'Feb', value: 22 },
    { month: 'Mar', value: 20 },
    { month: 'Apr', value: 18 },
    { month: 'May', value: 16 },
    { month: 'Jun', value: 15 },
    { month: 'Jul', value: 14 },
    { month: 'Aug', value: 13 },
    { month: 'Sep', value: 12 },
    { month: 'Oct', value: 11 },
    { month: 'Nov', value: 10 },
    { month: 'Dec', value: 9 },
]

const topCategoriesData = [
    { name: 'Online Shopping Scams', value: 40, color: '#2E5CDB' },
    { name: 'Fake Job Offers', value: 25, color: '#4A7AE8' },
    { name: 'Phishing and Identity Theft', value: 20, color: '#1DA8A8' },
    { name: 'Tech Support Scams', value: 15, color: '#4CD2D2' },
]

const scanSourcesData = [
    { name: 'Website', value: 45, color: '#5F5EBB' },
    { name: 'Email or Messaging Platforms', value: 30, color: '#8560B8' },
    { name: 'API Requests', value: 15, color: '#A164B3' },
    { name: 'Mobile App', value: 10, color: '#B86BAD' },
]

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('12months')

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold font-manrope">Analytics & Insights</h1>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-48 bg-cloudwhite text-gray font-normal text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className=' text-gray text-sm border-[#E7EFFE] bg-white'>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="12months">Last 12 Months</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Charts Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Chart 1: Report Trends */}
                <Card className='border-none shadow-[0px_4px_12px_0px_#E0E8F7AD] font-satoshi'>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                            Report Trends Over Time
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm">
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
                            <BarChart data={reportTrendsData}>
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

                {/* Chart 2: Scam Types Distribution */}
                <Card className='border-none shadow-[0px_4px_12px_0px_#E0E8F7AD] font-satoshi'>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                            Scam Types Distribution
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm">
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
                            <AreaChart data={scamTypeData}>
                                <defs>
                                    <linearGradient id="areaGradient1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00B9AD" />
                                        <stop offset="100%" stopColor="rgba(0, 185, 173, 0)" />
                                    </linearGradient>

                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    fill="url(#areaGradient1)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Chart 3: Top Reported Categories */}
                <Card className='border-none shadow-[0px_4px_12px_0px_#E0E8F7AD] font-satoshi'>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                            Top Reported Categories
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm">
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
                        <div className="flex items-center justify-between h-[400px]">
                            <div className="w-1/2 h-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topCategoriesData}
                                            cx="50%"
                                            cy="50%"
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {topCategoriesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-4 pl-8">
                                {topCategoriesData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-gray-700">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart 4: Scan Requests by Source */}
                <Card className='border-none shadow-[0px_4px_12px_0px_#E0E8F7AD] font-satoshi'>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center font-manrope font-bold text-indigo">
                            Scan Requests by Source
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-32 bg-cloudwhite text-gray font-normal text-sm">
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
                        <div className="flex items-center justify-between h-[400px]">
                            <div className="w-1/2 h-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={scanSourcesData}
                                            cx="50%"
                                            cy="50%"
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {scanSourcesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-4 pl-8">
                                {scanSourcesData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-gray-700">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}