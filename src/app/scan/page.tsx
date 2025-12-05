"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import TextArea from "@/components/ui/TextArea";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { scanMessage } from "@/lib/api/verification.api";
import { Notification } from "@/components/Reusable/Notification";

export default function ScanMessagePage() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [showModal, setShowModal] = useState(false);
  const [scanText, setScanText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // Check for stored scan message from VerificationInterface
  useEffect(() => {
    const storedMessage = sessionStorage.getItem('scanMessage');
    const storedResults = sessionStorage.getItem('scanResults');

    if (storedMessage && storedResults) {
      setScanText(storedMessage);
      // Clear storage to avoid showing same message on refresh
      sessionStorage.removeItem('scanMessage');
      sessionStorage.removeItem('scanResults');
    }
  }, []);

  const handleScan = async () => {
    // Check if user is signed in
    if (!session) {
      showNotification('Please sign in to scan messages', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/scan')}`);
      return;
    }

    if (!scanText.trim()) {
      showNotification('Please enter a message to scan', 'error');
      return;
    }

    setIsLoading(true);
    setShowModal(true);

    try {
      const scanResults = await scanMessage({
        messageContent: {
          text: scanText.trim(),
          platform: "Web Input"
        },
        analysisParameters: {
          language: "en",
          countryCode: "US"
        }
      });

      // Store results in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('scanResults', JSON.stringify(scanResults));
        sessionStorage.setItem('scanMessage', scanText.trim());
      }

      showNotification('Message scanned successfully! Redirecting...', 'success');

      // Redirect to results page after a delay
      setTimeout(() => {
        router.push('/scan-result');
      }, 1500);

    } catch (error: any) {
      console.error('Scan error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during scanning';
      showNotification(errorMessage, 'error');
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setScanText("");
  };

  const handleExampleClick = (example: string) => {
    setScanText(prev => prev + (prev ? "\n\n" : "") + example);
  };

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan a Message</h1>
          <p className="text-gray-600 mb-6">
            Paste or type any suspicious message to analyze for potential scams
          </p>
        </div>

        <TextArea
          placeholder="Type or paste message here for analysis..."
          value={scanText}
          onChange={(e) => setScanText(e.target.value)}
          rows={8}
          maxLength={5000}
          disabled={isLoading}
        />

        <div className="text-sm text-gray-500 text-right">
          {scanText.length}/5000 characters
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg mb-4">Examples:</h3>
          <div className="flex flex-wrap gap-3">
            {[
              "Congratulations! You've won $10,000. Click here to claim your prize!",

              "This is your bank. We need to confirm your identity. Send us your PIN.",
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="text-gray-600 px-4 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-sm font-medium transition-colors border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example.length > 50 ? example.substring(0, 50) + "..." : example}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="uppercase text-xs w-1/2"
            onClick={handleClear}
            disabled={isLoading || !scanText.trim()}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-1/2"
            onClick={handleScan}
            disabled={isLoading || !scanText.trim()}
          >
            {isLoading ? "Scanning..." : "SCAN"}
          </Button>
        </div>

        {/* Sign in prompt for non-authenticated users */}
        {!session && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="text-yellow-800 font-medium">
              🔒 Sign in required: Create an account to scan messages and access verification features
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="bg-gray-50 p-5 rounded-lg mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Safety Tips:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Never share personal information like passwords or PINs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Be cautious of urgent requests for money or personal details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Verify suspicious messages through official channels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Use secure payment methods with buyer protection</span>
            </li>
          </ul>
        </div>

        {showModal && (
          <AnimatedModalLayout>
            <ScanModal
              closeModal={() => setShowModal(false)}
              isScanning={isLoading}
            />
          </AnimatedModalLayout>
        )}
      </div>
    </>
  );
}

interface ScanModalProps {
  closeModal: () => void;
  isScanning?: boolean;
}

const ScanModal: React.FC<ScanModalProps> = ({
  closeModal,
  isScanning = true,
}) => {
  return (
    <div className="p-8 text-center flex flex-col items-center gap-6">
      <h3 className="font-bold text-2xl text-[#1D1F4D]">
        {isScanning ? "Scanning your message..." : "Scan Complete!"}
      </h3>

      <div className="flex justify-center items-center my-4 min-h-[120px]">
        {isScanning ? (
          <div className="flex space-x-2 gap-4">
            <div
              className="w-4 h-4 bg-[#1DADB0] rounded-full animate-ping"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#00B9AD] rounded-full animate-ping"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#1D1F4D] rounded-full animate-ping"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        ) : (
          <div className="text-4xl text-green-500">✓</div>
        )}
      </div>

      <p className="text-gray-600 text-sm">
        {isScanning
          ? "Analyzing message for scam patterns and red flags..."
          : "Message scanned successfully! Redirecting to results..."
        }
      </p>

      {!isScanning && (
        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs font-semibold py-3"
            onClick={() => router.push('/scan/message')}
          >
            View Results
          </Button>
        </div>
      )}
    </div>
  );
};