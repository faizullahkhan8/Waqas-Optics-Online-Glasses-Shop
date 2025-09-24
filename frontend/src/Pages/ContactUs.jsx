import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";

export default function ContactPage() {
    return (
        <main>
            <Helmet>
                <title>Contact — GlassesShop</title>
            </Helmet>
            {/* Header Section */}
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl font-serif font-bold text-gray-900">
                            Get in Touch
                        </h1>
                        <p className="mt-4 text-xl text-gray-600">
                            We're here to help with any questions about our
                            products or services
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div>
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-serif text-gray-900 mb-6">
                                    Send Us a Message
                                </h2>
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Smith"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors">
                                            <option value="">
                                                Select a topic
                                            </option>
                                            <option value="product">
                                                Product Inquiry
                                            </option>
                                            <option value="order">
                                                Order Status
                                            </option>
                                            <option value="returns">
                                                Returns & Exchanges
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            rows="5"
                                            placeholder="How can we help you?"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                        ></textarea>
                                    </div>
                                    <Button className="w-full px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Quick Contact */}
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h3 className="text-xl font-serif text-gray-900 mb-6">
                                    Quick Contact
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Email Us
                                            </h4>
                                            <p className="text-gray-600">
                                                support@glassesshop.com
                                            </p>
                                            <p className="text-gray-600">
                                                sales@glassesshop.com
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Call Us
                                            </h4>
                                            <p className="text-gray-600">
                                                +92 3xx xxxxxxx
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                24 / 7
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Visit Us
                                            </h4>
                                            <p className="text-gray-600">
                                                dummy location
                                            </p>
                                            <p className="text-gray-600">
                                                KPK, Pakistan
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQs */}
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h3 className="text-xl font-serif text-gray-900 mb-6">
                                    Frequently Asked Questions
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            q: "What's your return policy?",
                                            a: "We offer a 30-day return policy for all unused items in original condition.",
                                        },
                                        {
                                            q: "How long does shipping take?",
                                            a: "Standard shipping takes 3-5 business days within the continental US.",
                                        },
                                        {
                                            q: "Do you offer prescription lenses?",
                                            a: "Yes, we can fulfill most prescriptions. Upload your prescription during checkout.",
                                        },
                                    ].map((faq, index) => (
                                        <div
                                            key={index}
                                            className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                        >
                                            <h4 className="font-medium text-gray-900 mb-2">
                                                {faq.q}
                                            </h4>
                                            <p className="text-gray-600">
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
