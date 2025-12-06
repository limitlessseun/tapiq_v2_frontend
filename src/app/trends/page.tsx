// app/trends/page.tsx
import { Suspense } from 'react';
import Loader from '@/components/ui/Loader';
import TrendsContent from './TrendsContent';

export default function TrendsPage() {
    return (
        <Suspense fallback={<Loader />}>
            <TrendsContent />
        </Suspense>
    );
}