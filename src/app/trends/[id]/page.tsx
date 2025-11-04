'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { trendsData } from '@/components/Trends/Data';
import { Button } from '@/components/ui/button';
export default function TrendDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const trend = trendsData.find(item => item.id === id);

    if (!trend) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-cloudwhite font-manrope py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Article Header */}
                <article className=" ">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                            {trend.title}
                        </h2>
                        <p className="text-base md:text-lg text-indigo leading-relaxed">
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
                            {trend.sections.map((section, index) => (
                                <div key={index} className="mb-10">
                                    <h2 className=" md:text-lg font-bold text-indigo">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-2 text-gray md:text-lg leading-relaxed">
                                        {section.content.map((paragraph, pIndex) => (
                                            <p key={pIndex}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <h2 className=" md:text-lg font-bold text-indigo mb-2">
                                Stay Alert, Stay Safe
                            </h2>
                            <p className='text-gray md:text-lg leading-relaxed mb-4'>{trend.conclusion}</p>
                        </div>
                    </div>
                </article>

                <Link href="/trends">
                    <Button
                        className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-lg w-full py-6 complex-gradient-border text-white mt-6"
                    >
                        BACK
                    </Button>
                </Link>
            </div>
        </div>
    );
}