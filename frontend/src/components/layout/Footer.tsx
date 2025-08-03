import { B3aconLogo } from '@/components/icons/B3aconLogo';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-white border-t border-neutral-200">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <B3aconLogo className="h-8 w-auto" />
                            <span className="font-bold text-xl text-neutral-900">B3ACON</span>
                        </div>
                        <p className="text-neutral-600 mb-4 max-w-md">
                            Connecting creative talent with clients through a seamless platform for project management, collaboration, and discovery.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-neutral-500 hover:text-beacon-purple">
                                <span className="sr-only">Twitter</span>
                                <div className="h-6 w-6 bg-neutral-300 rounded-full"></div>
                            </Link>
                            <Link href="#" className="text-neutral-500 hover:text-beacon-purple">
                                <span className="sr-only">LinkedIn</span>
                                <div className="h-6 w-6 bg-neutral-300 rounded-full"></div>
                            </Link>
                            <Link href="#" className="text-neutral-500 hover:text-beacon-purple">
                                <span className="sr-only">Instagram</span>
                                <div className="h-6 w-6 bg-neutral-300 rounded-full"></div>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Find Talent</Link></li>
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Find Work</Link></li>
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Pricing</Link></li>
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">About</Link></li>
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Careers</Link></li>
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Blog</Link></li>
                            <li><Link href="#" className="text-neutral-600 hover:text-beacon-purple">Press</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-neutral-500 text-sm">
                        &copy; {new Date().getFullYear()} B3ACON Creative Connect. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="text-neutral-500 hover:text-beacon-purple text-sm">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-neutral-500 hover:text-beacon-purple text-sm">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-neutral-500 hover:text-beacon-purple text-sm">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}