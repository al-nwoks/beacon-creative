'use client'


export default function AccessibilityStatement() {
    return (
        <div className="min-h-screen bg-neutral-50">

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Accessibility Statement</h1>
                    <p className="text-xl md:text-2xl max-w-3xl text-beacon-purple-light">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Accessibility Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        <strong>Commitment:</strong> We are committed to ensuring digital accessibility for people with disabilities.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">1. Our Commitment</h2>
                        <p className="text-neutral-700 mb-4">
                            B3ACON Creative Connect is committed to making our website and platform accessible to all users, including those with disabilities. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">2. Accessibility Features</h2>
                        <p className="text-neutral-700 mb-4">
                            Our platform includes several accessibility features:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li><strong>Semantic HTML:</strong> Proper use of headings, lists, and other semantic elements</li>
                            <li><strong>Keyboard Navigation:</strong> Full functionality using keyboard controls only</li>
                            <li><strong>Screen Reader Support:</strong> Compatibility with popular screen readers</li>
                            <li><strong>Color Contrast:</strong> Sufficient contrast ratios for text and background colors</li>
                            <li><strong>Alternative Text:</strong> Descriptive alt text for images and graphics</li>
                            <li><strong>Resizable Text:</strong> Text that can be resized up to 200% without loss of content or functionality</li>
                            <li><strong>Focus Indicators:</strong> Visible focus indicators for interactive elements</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">3. Technical Standards</h2>
                        <p className="text-neutral-700 mb-4">
                            We follow these technical standards to ensure accessibility:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>WCAG 2.1 Level AA guidelines</li>
                            <li>Section 508 compliance</li>
                            <li>WAI-ARIA standards for dynamic content</li>
                            <li>Mobile accessibility best practices</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">4. Browser and Assistive Technology Support</h2>
                        <p className="text-neutral-700 mb-4">
                            Our platform is designed to work with the following browsers and assistive technologies:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Chrome, Firefox, Safari, and Edge (latest versions)</li>
                            <li>JAWS, NVDA, and VoiceOver screen readers</li>
                            <li>ZoomText and other magnification software</li>
                            <li>Speech recognition software</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">5. Limitations and Areas for Improvement</h2>
                        <p className="text-neutral-700 mb-4">
                            Despite our best efforts to ensure accessibility, there may be some limitations. Below is a description of known limitations and potential solutions:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Some third-party plugins may not fully meet accessibility standards</li>
                            <li>Complex data visualizations may require additional alternative formats</li>
                            <li>Video content may require additional captioning or audio description</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">6. Feedback and Contact</h2>
                        <p className="text-neutral-700 mb-4">
                            We welcome your feedback on the accessibility of our platform. If you encounter any accessibility barriers, please let us know:
                        </p>
                        <p className="text-neutral-700 mb-4">
                            <strong>Email:</strong> accessibility@b3acon.com<br />
                            <strong>Phone:</strong> +1 (555) 123-4567<br />
                            <strong>Mail:</strong> B3ACON Creative Connect, Accessibility Team, 123 Creative Street, New York, NY 10001
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">7. Formal Complaints</h2>
                        <p className="text-neutral-700 mb-4">
                            If you are not satisfied with our response to your accessibility feedback, you may file a formal complaint with:
                        </p>
                        <p className="text-neutral-700 mb-4">
                            Federal Communications Commission<br />
                            445 12th Street, S.W.<br />
                            Washington, DC 20554<br />
                            Phone: 1-888-225-5322
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">8. Continuous Improvement</h2>
                        <p className="text-neutral-700 mb-4">
                            We are committed to continuous improvement of our platform's accessibility. Our efforts include:
                        </p>
                        <ul className="list-disc pl-8 text-neutral-700 mb-4 space-y-2">
                            <li>Regular accessibility audits and testing</li>
                            <li>Staff training on accessibility best practices</li>
                            <li>Integration of accessibility into our development process</li>
                            <li>Ongoing user feedback collection and implementation</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">9. Third-Party Content</h2>
                        <p className="text-neutral-700 mb-4">
                            Our platform may contain links to third-party websites or content that are not operated by us. While we strive to only link to sites that meet accessibility standards, we have no control over the content or accessibility of these third-party sites.
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">10. Updates to This Statement</h2>
                        <p className="text-neutral-700 mb-4">
                            We may update this Accessibility Statement from time to time. We will notify you of any changes by posting the new Accessibility Statement on this page and updating the "Last updated" date.
                        </p>

                        <div className="border-t border-neutral-200 pt-8 mt-12">
                            <p className="text-neutral-700">
                                This Accessibility Statement is based on the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and is designed to be fully compliant with Section 508 of the Rehabilitation Act.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}