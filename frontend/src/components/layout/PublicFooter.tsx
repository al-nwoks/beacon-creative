'use client'

import Link from 'next/link'

export default function PublicFooter() {
    return (
        <footer className="bg-neutral-900 text-neutral-400 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <h3 className="text-white text-xl font-bold mb-4">B3ACON</h3>
                        <p className="mb-4 max-w-xs">
                            Connecting creative talent with opportunities worldwide.
                        </p>
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} B3ACON Creative Connect. All rights reserved.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">For Clients</h3>
                        <ul className="space-y-2">
                            <li><Link href="/how-to-hire" className="hover:text-white transition-colors">How to Hire</Link></li>
                            <li><Link href="/talent-marketplace" className="hover:text-white transition-colors">Talent Marketplace</Link></li>
                            <li><Link href="/client-success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                            <li><Link href="/client-resources" className="hover:text-white transition-colors">Resources</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">For Creatives</h3>
                        <ul className="space-y-2">
                            <li><Link href="/find-work" className="hover:text-white transition-colors">Find Work</Link></li>
                            <li><Link href="/creative-resources" className="hover:text-white transition-colors">Resources</Link></li>
                            <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                            <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <ul className="flex flex-wrap justify-center md:justify-start gap-6">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                                <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
                            </ul>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </Link>
                            <Link href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="LinkedIn">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}