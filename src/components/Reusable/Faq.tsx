import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "HOW DO I REPORT A SUSPICIOUS VENDOR?",
    answer:
      "Use our reporting feature to submit details about suspicious vendors.",
  },
  {
    question: "HOW CAN I VERIFY IF A VENDOR IS TRUSTWORTHY?",
    answer: "Scan the vendor's details using our verification tool.",
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

export function FAQSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
