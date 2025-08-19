'use client'


export default function TermsOfService() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Terms of Service</h1>
                    <p className="text-xl md:text-2xl max-w-3xl text-beacon-purple-light">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Important:</strong> Please read these terms carefully before using our services.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">1. Acceptance of Terms</h2>
                        <p className="text-neutral-700 mb-4">
                            By accessing or using the B3ACON Creative Connect platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">2. Description of Service</h2>
                        <p className="text-neutral-700 mb-4">
                            B3ACON Creative Connect is a platform that connects creative professionals with clients seeking creative services. The Service includes project posting, talent discovery, communication tools, and payment processing.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">3. Account Registration</h2>
                        <p className="text-neutral-700 mb-4">
                            To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">4. User Conduct</h2>
                        <p className="text-neutral-700 mb-4">
                            You are responsible for all activities that occur under your account. You agree not to:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Use the Service for any illegal purpose or in violation of any laws</li>
                            <li>Post content that is false, misleading, or fraudulent</li>
                            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                            <li>Attempt to gain unauthorized access to any portion of the Service</li>
                            <li>Transmit any viruses or malicious code</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">5. Intellectual Property</h2>
                        <p className="text-neutral-700 mb-4">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of B3ACON Creative Connect and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">6. Payments and Fees</h2>
                        <p className="text-neutral-700 mb-4">
                            B3ACON Creative Connect charges service fees for transactions conducted through the platform. All fees are non-refundable unless otherwise specified. You agree to pay all fees associated with your use of the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">7. Termination</h2>
                        <p className="text-neutral-700 mb-4">
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">8. Limitation of Liability</h2>
                        <p className="text-neutral-700 mb-4">
                            In no event shall B3ACON Creative Connect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">9. Changes to Terms</h2>
                        <p className="text-neutral-700 mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">10. Contact Us</h2>
                        <p className="text-neutral-700 mb-4">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="text-neutral-700 mb-4">
                            B3ACON Creative Connect<br />
                            Email: legal@b3acon.com<br />
                            Phone: +1 (555) 123-4567
                        </p>

                        <div className="border-t border-neutral-200 pt-8 mt-12">
                            <p className="text-neutral-700">
                                By using our Service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}