'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trendsData } from '@/components/Trends/Data';
import { Button } from '@/components/ui/button';
import LatestTrends from "@/components/Trends/LatestTrends";
import { ArrowLeft, Calendar, User, AlertCircle } from 'lucide-react';

export default function TrendsContent() {
    const searchParams = useSearchParams();
    const [trend, setTrend] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const id = searchParams?.get('id');

    useEffect(() => {
        if (id) {
            const foundTrend = trendsData.find(item => item.id === id);
            setTrend(foundTrend);
        } else {
            setTrend(null);
        }
        setIsLoading(false);
    }, [id]);

    const clearSelectedTrend = () => {
        // Create a new URL without the id parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('id');
        window.history.pushState({}, '', url.toString());
        setTrend(null);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-cloudwhite">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray font-satoshi">Loading...</p>
                    </div>
                </div>
            </main>
        );
    }

    // Display single trend detail when ID is in URL
    if (trend) {
        return (
            <div className="min-h-screen bg-cloudwhite font-manrope py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Back button */}
                    <Button
                        onClick={clearSelectedTrend}
                        variant="outline"
                        className="mb-8"
                        style={{
                            border: "1px solid",
                            borderImage: `
                linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                1
              `,
                        }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        BACK TO ALL TRENDS
                    </Button>

                    {/* Article Header */}
                    <article>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                                {trend.title}
                            </h2>
                            <p className="text-base md:text-lg text-indigo leading-relaxed font-satoshi">
                                {trend.description}
                            </p>
                        </div>

                        {/* Featured Image */}
                        {trend.image && (
                            <div className="w-full h-52 md:h-80 relative rounded-lg p-8 md:p-12">
                                <Image
                                    src={trend.image}
                                    alt={trend.title}
                                    fill
                                    className="object-contain rounded-lg"
                                    priority
                                />
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none">
                                {trend.sections?.map((section: any, index: number) => (
                                    <div key={index} className="mb-10">
                                        <h2 className="md:text-lg font-bold text-indigo">
                                            {section.title}
                                        </h2>
                                        <div className="space-y-2 text-gray md:text-lg leading-relaxed font-satoshi">
                                            {section.content?.map((paragraph: string, pIndex: number) => (
                                                <p key={pIndex}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <h2 className="md:text-lg font-bold text-indigo mb-2">
                                    Stay Alert, Stay Safe
                                </h2>
                                <p className='text-gray md:text-lg leading-relaxed mb-4 font-satoshi'>
                                    {trend.conclusion}
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Meta Information */}
                    {trend.date && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-4 text-sm text-gray">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Published: {new Date(trend.date).toLocaleDateString()}
                                </div>
                                {trend.author && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Author: {trend.author}
                                    </div>
                                )}
                                {trend.severity && (
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Severity: {trend.severity}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Display the list of trends when no ID is selected
    return (
        <main className="min-h-screen">
            <LatestTrends />
        </main>
    );
}