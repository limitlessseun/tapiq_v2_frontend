import Link from "next/link";
import Image from "next/image";

interface TrendCard {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
}

const trendCards: TrendCard[] = [
  {
    id: "scam-prevention-guide",
    title: "Scam Prevention Guide",
    description:
      "Highlighting the most dangerous scam of the week to stay alert.",
    shortDescription: "Learn to identify and avoid the latest scam tactics",
    image: "/assets/1.png",
  },
  {
    id: "safe-payment-methods",
    title: "Safe Payment Methods",
    description:
      "Highlighting the most dangerous scam of the week to stay alert.",
    shortDescription: "Secure your financial transactions online",
    image: "/assets/2.png",
  },
  {
    id: "fraud-prevention-tips",
    title: "Fraud Prevention Tips",
    description:
      "Highlighting the most dangerous scam of the week to stay alert.",
    shortDescription: "Essential tips to protect yourself from fraud",
    image: "/assets/3.png",
  },
];

export default function LatestTrends() {
  return (
    <section className="py-12 bg-cloudwhite font-manrope">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
            Latest Trends
          </h2>
          <p className="text-base md:text-lg text-indigo leading-relaxed">
            Explore the newest trends, insights, and developments in the world
            of online security and fraud prevention.
          </p>
        </div>

        {/* Trend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl p-6">
              {/* Image */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover "
                />
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-indigo mb-3">
                {card.title}
              </h3>
              <p className="text-gray md:text-lg mb-4 leading-relaxed">
                {card.description}
              </p>
              <Link
                href={`/trends/${card.id}`}
                className="inline-flex items-center underline text-[#185CBC] font-medium hover:text-[#134a9c] transition-colors"
              >
                Read now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
