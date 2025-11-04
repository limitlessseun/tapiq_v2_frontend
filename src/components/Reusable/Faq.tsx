import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "HOW CAN I VERIFY IF A VENDOR IS TRUSTWORTHY?",
    answer:
      "You can verify a vendor by using the 'Verify a Vendor' tool. Enter the vendor's name or website, and our system will check for any reported scams or suspicious activity associated with them.",
  },
  {
    question: "HOW DO I REPORT A SUSPICIOUS VENDOR?",
    answer:
      "Use our reporting feature to submit details about suspicious vendors.",
  },
  {
    question: "WHAT SHOULD I DO IF I RECEIVE A SUSPICIOUS MESSAGE?",
    answer:
      "Use our message scanning feature to analyze suspicious communications.",
  },
  {
    question: "HOW DO I CREATE A WATCH LIST?",
    answer:
      "Create custom watchlists in your account settings to monitor specific vendors.",
  },
];

export function FAQSection({ p }: any) {
  return (
    <section className="py-16 px-6 bg-cloudwhite font-manrope">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">FAQ</h2>
          {p && <p className="text-indigo md:text-lg text-center font-satoshi">
            {p}
          </p>}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-0 bg-white p-2 m-4 rounded-lg shadow-[0px_4px_12px_0px_#E0E8F7AD]"
            >
              <AccordionTrigger className="text-left bg-cloudwhite rounded-lg p-4 text-indigo text-sm lg:text-base font-medium hover:no-underline [&[data-state=open]]:no-underline group">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-4 px-4 text-gray md:text-base text-sm bg-cloudwhite rounded-b-lg font-satoshi">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
