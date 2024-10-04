import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For certain regions, we also offer payment options like Klarna and Afterpay."
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping times vary depending on your location and chosen shipping method. Typically, domestic orders are delivered within 3-5 business days, while international orders may take 7-14 business days. Expedited shipping options are available at checkout."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. To initiate a return, please log into your account and follow the return instructions, or contact our customer service team."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see the exact shipping cost and estimated delivery time at checkout after entering your address."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a shipping confirmation email with a tracking number. You can use this number to track your package on our website or the carrier's site. You can also view your order status by logging into your account."
  },
  {
    question: "Are your products authentic?",
    answer: "We only sell 100% authentic products sourced directly from the brands or their authorized distributors. We take product authenticity very seriously and have strict measures in place to ensure the genuineness of all items we sell."
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Yes, we offer gift wrapping services for a small additional fee. You can select this option during checkout. We'll beautifully wrap your item and can include a personalized message card upon request."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          FAQ
        </h1>
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-dark-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left py-4 focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-md font-medium">{faq.question}</h2>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="pb-4 text-sm text-gray-400">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}