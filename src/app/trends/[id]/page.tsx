'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { trendsData } from '@/components/Trends/Data';

export default function TrendDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const trend = trendsData.find(item => item.id === id);

    if (!trend) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/trends"
                        className="inline-flex items-center text-[#185CBC] hover:text-[#134a9c] font-medium transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Trends
                    </Link>
                </div>

                {/* Article Header */}
                <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Featured Image */}
                    {trend.image && (
                        <div className="w-full h-64 md:h-80 relative">
                            <Image
                                src={trend.image}
                                alt={trend.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {trend.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {trend.description}
                        </p>

                        <div className="w-20 h-1 bg-[#185CBC] rounded-full mb-8"></div>

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            {trend.sections.map((section, index) => (
                                <div key={index} className="mb-10">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                        {section.title}
                                    </h2>
                                    {section.image && (
                                        <div className="mb-6 rounded-lg overflow-hidden">
                                            <Image
                                                src={section.image}
                                                alt={section.title}
                                                width={800}
                                                height={400}
                                                className="w-full h-auto rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        {section.content.map((paragraph, pIndex) => (
                                            <p key={pIndex}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Conclusion */}
                            <div className="bg-blue-50 rounded-xl p-6 mt-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Stay Alert, Stay Safe</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {trend.conclusion}
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}