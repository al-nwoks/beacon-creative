import { Briefcase, Home, MessageSquare, Search, User } from 'lucide-react';
import Link from 'next/link';

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden">
            <div className="flex justify-around h-16 items-center">
                <Link href="/" className="flex flex-col items-center text-beacon-purple">
                    <Home className="h-6 w-6" />
                    <span className="text-xs font-medium">Home</span>
                </Link>
                <Link href="/jobs" className="flex flex-col items-center text-neutral-600 hover:text-beacon-purple">
                    <Briefcase className="h-6 w-6" />
                    <span className="text-xs font-medium">Jobs</span>
                </Link>
                <Link href="/search" className="flex flex-col items-center text-neutral-600 hover:text-beacon-purple">
                    <Search className="h-6 w-6" />
                    <span className="text-xs font-medium">Search</span>
                </Link>
                <Link href="/messages" className="flex flex-col items-center text-neutral-600 hover:text-beacon-purple">
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-xs font-medium">Messages</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center text-neutral-600 hover:text-beacon-purple">
                    <User className="h-6 w-6" />
                    <span className="text-xs font-medium">Profile</span>
                </Link>
            </div>
        </nav>
    );
}
