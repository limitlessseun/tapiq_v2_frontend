// components/Trends/Data.ts
export interface TrendDetail {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    image: string;
    sections: {
        title: string;
        content: string[];
        image?: string; // Optional section images
    }[];
    conclusion: string;
}

export const trendsData: TrendDetail[] = [
    {
        id: 'scam-prevention-guide',
        title: 'Scam Prevention Guide',
        description: 'Highlighting the most dangerous scam of the week to stay alert.',
        shortDescription: 'Learn to identify and avoid the latest scam tactics',
        image: '/assets/scam-prevention-hero.jpg',
        sections: [
            {
                title: 'Recognize the Red flags',
                content: [
                    'The first step in scam prevention is to identify the signs of fraud. Some common red flags include:',
                    'Unsolicited offers: Be cautious of emails, messages, or phone calls offering deals that sound too good to be true.',
                    'Requests for personal information: Never share sensitive data like passwords or bank account details with unknown sources.',
                    'Urgency and pressure: Scammers often create a sense of urgency to get you to act quickly without thinking.'
                ],
                image: '/assets/red-flags.jpg'
            },
            {
                title: 'Always Verify the Source',
                content: [
                    'Before responding to a message or engaging with a website, always verify the source:',
                    'Check the URL: Look for "https://" and a secure connection.',
                    'Search for reviews: Look up any company or vendor to see what other users have experienced.',
                    'Contact the organization directly: If you receive a suspicious email or phone call from a company, contact them through official channels to verify the message.'
                ],
                image: '/assets/verify-source.jpg'
            },
            // ... more sections
        ],
        conclusion: 'Scams are constantly evolving...'
    },
    // ... more trends
];