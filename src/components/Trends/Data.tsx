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
        image?: string;
    }[];
    conclusion: string;
}

export const trendsData: TrendDetail[] = [
    {
        id: 'scam-prevention-guide',
        title: 'Scam Prevention Guide',
        description: 'Highlighting the most dangerous scam of the week to stay alert.',
        shortDescription: 'Learn to identify and avoid the latest scam tactics',
        image: '/assets/1.png',
        sections: [
            {
                title: 'Recognize the Red flags',
                content: [
                    'The first step in scam prevention is to identify the signs of fraud. Some common red flags include:',
                    '• Unsolicited offers: Be cautious of emails, messages, or phone calls offering deals that sound too good to be true.',
                    '• Requests for personal information: Never share sensitive data like passwords or bank account details with unknown sources.',
                    '• Urgency and pressure: Scammers often create a sense of urgency to get you to act quickly without thinking.'
                ],
                image: '/assets/red-flags.jpg'
            },
            {
                title: 'Always Verify the Source',
                content: [
                    'Before responding to a message or engaging with a website, always verify the source:',
                    '• Check the URL: Look for "https://" and a secure connection.',
                    '• Search for reviews: Look up any company or vendor to see what other users have experienced.',
                    '• Contact the organization directly: If you receive a suspicious email or phone call from a company, contact them through official channels to verify the message.'
                ],
                image: '/assets/verify-source.jpg'
            },
            {
                title: 'Use Strong, Unique Passwords',
                content: [
                    'A strong password is your first line of defense. Use a combination of:',
                    '• Upper and lowercase letters',
                    '• Numbers',
                    '• Special characters',
                    'And always avoid reusing passwords across different sites. Consider using a password manager to securely store and generate unique passwords.'
                ],
                image: '/assets/password-security.jpg'
            }
        ],
        conclusion: 'Scams are constantly evolving, but by staying informed and cautious, you can protect yourself and your information. Always remember, if something feels off, trust your instincts and take the time to verify. The more proactive you are in spotting potential threats, the safer you\'ll be in the online world. By following these simple steps and using tools like TapIO to track scams, you can stay one step ahead of fraudsters and ensure your digital life remains secure.'
    },
    {
        id: 'safe-payment-methods',
        title: 'Safe Payment Methods',
        description: 'Highlighting the most dangerous scam of the week to stay alert.',
        shortDescription: 'Secure your financial transactions online',
        image: '/assets/2.png',
        sections: [
            {
                title: 'Secure Payment Gateways',
                content: [
                    'Always use trusted payment gateways for online transactions:',
                    '• Look for SSL encryption and security badges on payment pages',
                    '• Avoid direct bank transfers to unknown recipients',
                    '• Use credit cards for better fraud protection'
                ],
                image: '/assets/payment-gateways.jpg'
            },
            {
                title: 'Two-Factor Authentication',
                content: [
                    'Enable two-factor authentication on all financial accounts:',
                    '• Adds an extra layer of security beyond passwords',
                    '• Protects against unauthorized access',
                    '• Available on most banking and payment apps'
                ],
                image: '/assets/two-factor.jpg'
            }
        ],
        conclusion: 'Protecting your financial information is crucial in today\'s digital world. By using secure payment methods and following best practices, you can significantly reduce your risk of financial fraud and identity theft.'
    },
    {
        id: 'fraud-prevention-tips',
        title: 'Fraud Prevention Tips',
        description: 'Highlighting the most dangerous scam of the week to stay alert.',
        shortDescription: 'Essential tips to protect yourself from fraud',
        image: '/assets/3.png',
        sections: [
            {
                title: 'Monitor Your Accounts',
                content: [
                    'Regularly check your financial accounts for suspicious activity:',
                    '• Set up transaction alerts',
                    '• Review statements monthly',
                    '• Report unauthorized charges immediately'
                ],
                image: '/assets/account-monitoring.jpg'
            },
            {
                title: 'Secure Your Devices',
                content: [
                    'Keep your devices and software updated:',
                    '• Install security updates promptly',
                    '• Use antivirus software',
                    '• Avoid public Wi-Fi for sensitive transactions'
                ],
                image: '/assets/device-security.jpg'
            }
        ],
        conclusion: 'Staying vigilant and proactive is key to preventing fraud. Regular monitoring and good security habits can help you detect and prevent fraudulent activity before it causes significant damage.'
    }
];