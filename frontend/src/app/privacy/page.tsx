'use client'


export default function PrivacyPolicy() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-xl md:text-2xl max-w-3xl text-beacon-purple-light">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        <strong>Transparency:</strong> We are committed to protecting your privacy and being transparent about how we collect and use your information.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">1. Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">Personal Information</h3>
                        <p className="text-neutral-700 mb-4">
                            When you register for an account, we collect information that can identify you, including:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Name and contact information (email address, phone number)</li>
                            <li>Professional information (portfolio, skills, experience)</li>
                            <li>Payment information (processed securely through our payment partners)</li>
                            <li>Profile information (bio, location, preferences)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">Usage Information</h3>
                        <p className="text-neutral-700 mb-4">
                            We automatically collect information about how you use our Service, including:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Device information (IP address, browser type, operating system)</li>
                            <li>Usage data (pages visited, features used, time spent on the Service)</li>
                            <li>Log information (access times, error logs)</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">2. How We Use Your Information</h2>
                        <p className="text-neutral-700 mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Provide, maintain, and improve our Service</li>
                            <li>Process transactions and send transaction-related information</li>
                            <li>Communicate with you about your account and our Service</li>
                            <li>Personalize your experience and recommend relevant content</li>
                            <li>Monitor and analyze usage patterns and trends</li>
                            <li>Detect, prevent, and address technical issues or security breaches</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">3. Information Sharing and Disclosure</h2>
                        <p className="text-neutral-700 mb-4">
                            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>With your consent or at your direction</li>
                            <li>To comply with legal obligations or respond to legal processes</li>
                            <li>To protect our rights, property, or safety, or that of our users or others</li>
                            <li>In connection with a merger, acquisition, or sale of assets</li>
                            <li>With service providers who assist us in operating our Service (under strict confidentiality agreements)</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">4. Data Security</h2>
                        <p className="text-neutral-700 mb-4">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">5. Data Retention</h2>
                        <p className="text-neutral-700 mb-4">
                            We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">6. Your Rights</h2>
                        <p className="text-neutral-700 mb-4">
                            Depending on your location, you may have certain rights regarding your personal information, including:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>The right to access, update, or delete your personal information</li>
                            <li>The right to object to or restrict processing of your personal information</li>
                            <li>The right to data portability</li>
                            <li>The right to withdraw consent where processing is based on consent</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">7. Cookies and Tracking Technologies</h2>
                        <p className="text-neutral-700 mb-4">
                            We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">8. Children's Privacy</h2>
                        <p className="text-neutral-700 mb-4">
                            Our Service does not address anyone under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">9. Changes to This Privacy Policy</h2>
                        <p className="text-neutral-700 mb-4">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">10. Contact Us</h2>
                        <p className="text-neutral-700 mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-neutral-700 mb-4">
                            B3ACON Creative Connect<br />
                            Email: privacy@b3acon.com<br />
                            Phone: +1 (555) 123-4567
                        </p>

                        <div className="border-t border-neutral-200 pt-8 mt-12">
                            <p className="text-neutral-700">
                                By using our Service, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}