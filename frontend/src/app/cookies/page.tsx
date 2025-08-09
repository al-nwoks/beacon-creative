'use client'

import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function CookiesPolicy() {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-beacon-purple">
                            B3ACON
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                            Log in
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" size="sm">
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Cookie Policy</h1>
                    <p className="text-xl md:text-2xl max-w-3xl text-beacon-purple-light">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Cookies Content */}
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
                                        <strong>Transparency:</strong> We use cookies to enhance your experience on our platform and for analytical purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">1. What Are Cookies</h2>
                        <p className="text-neutral-700 mb-4">
                            Cookies are small text files that are stored on your device when you visit websites. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">2. How We Use Cookies</h2>
                        <p className="text-neutral-700 mb-4">
                            We use cookies for various purposes, including:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems.</li>
                            <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                            <li><strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
                            <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">3. Types of Cookies We Use</h2>

                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">Essential Cookies</h3>
                        <p className="text-neutral-700 mb-4">
                            These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.
                        </p>
                        <table className="min-w-full divide-y divide-neutral-200 mb-6">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Cookie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">sessionid</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">Maintain user session</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">Session</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">csrftoken</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">Security protection</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">1 year</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">Performance Cookies</h3>
                        <p className="text-neutral-700 mb-4">
                            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                        </p>
                        <table className="min-w-full divide-y divide-neutral-200 mb-6">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Cookie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">_ga</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">Google Analytics</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">2 years</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">_gid</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">Google Analytics</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">24 hours</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">4. Managing Cookies</h2>
                        <p className="text-neutral-700 mb-4">
                            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">5. Third-Party Cookies</h2>
                        <p className="text-neutral-700 mb-4">
                            We may use third-party services that use cookies to collect information about your online activities across websites. These services include:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Google Analytics for website analytics</li>
                            <li>Google Ads for advertising</li>
                            <li>Social media platforms for sharing functionality</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">6. Updates to This Policy</h2>
                        <p className="text-neutral-700 mb-4">
                            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">7. Contact Us</h2>
                        <p className="text-neutral-700 mb-4">
                            If you have any questions about this Cookie Policy, please contact us at:
                        </p>
                        <p className="text-neutral-700 mb-4">
                            B3ACON Creative Connect<br />
                            Email: privacy@b3acon.com<br />
                            Phone: +1 (555) 123-4567
                        </p>

                        <div className="border-t border-neutral-200 pt-8 mt-12">
                            <p className="text-neutral-700">
                                By using our Service, you acknowledge that you have read and understood this Cookie Policy and agree to the use of cookies as described herein.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}