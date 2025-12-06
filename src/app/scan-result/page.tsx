"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { Notification } from "@/components/Reusable/Notification";
import Indicators from "@/components/ui/ScanReportComponent/Indicators";
import type { ScanMessageResponse } from '@/lib/api/verification.api';

export default function ScanResultPage() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [scanData, setScanData] = useState<ScanMessageResponse | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    // Load scan results from session storage
    const storedResults = sessionStorage.getItem('scanResults');
    const storedMessage = sessionStorage.getItem('scanMessage');

    if (!storedResults) {
      showNotification('No scan data available. Please scan a message first.', 'error');
      setTimeout(() => {
        router.push('/scan');
      }, 2000);
      return;
    }

    try {
      const results = JSON.parse(storedResults);
      setScanData(results);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing scan results:', error);
      showNotification('Error loading scan results', 'error');
      setIsLoading(false);
    }
  }, [router]);

  const handleNewScan = () => {
    // Clear session storage and redirect to scan page
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('scanResults');
      sessionStorage.removeItem('scanMessage');
    }
    router.push('/scan');
  };

  const handleShare = () => {
    if (!scanData) return;

    const shareText = `⚠️ Scam Alert ⚠️\n\nI just scanned a suspicious message with TapIQ. Risk Level: ${scanData.riskAssessment.riskLevel}\n\nVerdict: ${scanData.verdict}\n\nStay safe from online scams!`;

    if (navigator.share) {
      navigator.share({
        title: 'TapIQ Scan Results',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        showNotification('Results copied to clipboard!', 'success');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showNotification('Results copied to clipboard!', 'success');
    }
  };

  const handleReport = () => {
    if (!session) {
      showNotification('Please sign in to report this message', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/scan/result')}`);
      return;
    }

    // Pre-fill report form with message data
    if (scanData && typeof window !== 'undefined') {
      const messageData = {
        messageText: scanData.messageContent.text,
        messagePlatform: scanData.messageContent.platform || 'Web Input',
        scamType: scanData.scamPredictions[0]?.type || 'Unknown',
        riskLevel: scanData.riskAssessment.riskLevel,
        redFlags: scanData.redFlags.map(flag => flag.flag)
      };
      sessionStorage.setItem('messageScanData', JSON.stringify(messageData));
    }

    router.push('/report?type=message');
  };

  const isHighRisk = scanData?.riskAssessment.riskLevel === 'High' ||
    scanData?.riskAssessment.riskLevel === 'Very High' ||
    scanData?.riskAssessment.riskLevel === 'Critical';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
        <p className="text-gray-600 mt-4">Loading scan results...</p>
      </div>
    );
  }

  if (!scanData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Scan Data Available</h2>
          <p className="text-gray-500 mb-4">Please scan a message first.</p>
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs"
            onClick={() => router.push('/scan')}
          >
            Scan a Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <div className="space-y-6">
        {/* Message Preview */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">Scanned Message:</h3>
          <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
            {scanData.messageContent.text}
          </div>
          {scanData.messageContent.platform && (
            <div className="text-xs text-gray-500 mt-2">
              Platform: {scanData.messageContent.platform}
            </div>
          )}
        </div>

        {/* Risk Indicators */}
        <Indicators genuine={!isHighRisk} />

        {/* Results Content */}
        {!isHighRisk ? (
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-start gap-4">
              <img src="/assets/light-bulb.svg" className="h-8 w-8 flex-shrink-0" />
              <div className="">
                <p className="text-primary font-medium ">Concerns:</p>
                <p className="text-indigo font-medium mt-2 ">
                  {scanData.redFlags.length === 0
                    ? "None detected"
                    : `${scanData.redFlags.length} minor concern(s) detected`}
                </p>
                {scanData.redFlags.length > 0 && (
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    {scanData.redFlags.slice(0, 3).map((flag, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1">•</span>
                        <span>{flag.flag}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <img src="/assets/mega-phone.svg" className="h-8 w-8 flex-shrink-0" />
              <div className="">
                <p className="text-primary font-medium ">Recommendation:</p>
                <p className="text-indigo font-medium mt-2 ">
                  {scanData.verdict}
                </p>
                <div className="mt-2">
                  {scanData.recommendedActions.slice(0, 3).map((action, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start mb-1">
                      <span className="mr-2 mt-1">✓</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-start gap-4">
              <img src="/assets/light-bulb.svg" className="h-8 w-8 flex-shrink-0" />
              <div className="">
                <p className="text-primary font-medium ">Immediate actions:</p>
                <ul className="text-sm font-bold text-indigo flex flex-col gap-2">
                  {scanData.recommendedActions.slice(0, 3).map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Red Flags Detected */}
            {scanData.redFlags.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h4 className="font-semibold text-red-800 mb-2">Red Flags Detected:</h4>
                <div className="space-y-2">
                  {scanData.redFlags.slice(0, 5).map((flag, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-red-600 mr-2 mt-1">⚠️</span>
                      <div>
                        <span className="font-medium text-red-700">{flag.flag}</span>
                        <p className="text-sm text-red-600">{flag.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scam Type Predictions */}
            {scanData.scamPredictions.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Likely Scam Type:</h4>
                <div className="space-y-1">
                  {scanData.scamPredictions.slice(0, 3).map((prediction, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{prediction.type}</span>
                      <span className="font-bold text-red-600">
                        {Math.round(prediction.likelihood * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-xl font-bold text-gray-900">
              {Math.round(scanData.riskAssessment.riskScore * 100)}%
            </div>
            <div className="text-xs text-gray-500">Risk Score</div>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-xl font-bold text-gray-900">
              {scanData.redFlags.length}
            </div>
            <div className="text-xs text-gray-500">Red Flags</div>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-xl font-bold text-gray-900">
              {Math.round(scanData.riskAssessment.confidence * 100)}%
            </div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-xl font-bold text-gray-900">
              {scanData.scamPredictions.length}
            </div>
            <div className="text-xs text-gray-500">Scam Types</div>
          </div>
        </div>

        {/* Action Buttons */}


        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="uppercase text-xs flex-1"
            onClick={handleShare}
          >
            Share Results
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-full"
            onClick={handleNewScan}
          >
            NEW SCAN
          </Button>
        </div>


        {/* Safety Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Safety Tips:</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Never share personal information like passwords or PINs
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Be cautious of urgent requests for money or personal details
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Verify suspicious messages through official channels
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Use secure payment methods with buyer protection
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}