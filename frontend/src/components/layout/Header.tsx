import { B3aconLogo } from '@/components/icons/B3aconLogo';
import { NavigationIcon } from '@/components/icons/NavigationIcons';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
    showSearch?: boolean;
    showFilter?: boolean;
    onSearch?: (query: string) => void;
    onFilter?: () => void;
    searchPlaceholder?: string;
    userType?: 'creative' | 'client' | 'admin';
}

export function Header({
    showSearch = false,
    showFilter = false,
    onSearch,
    onFilter,
    searchPlaceholder = 'Search...',
    userType = 'creative'
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <B3aconLogo className="h-8 w-auto" />
                            <span className="font-bold text-xl text-neutral-900">B3ACON</span>
                        </Link>
                    </div>

                    {showSearch ? (
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-full h-10 px-4 pr-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                />
                                {searchQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                ) : null}
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-neutral-500 hover:text-beacon-purple"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    ) : null}

                    <div className="flex items-center space-x-4">
                        {showFilter ? (
                            <button
                                onClick={onFilter}
                                className="p-2 rounded-full hover:bg-neutral-100"
                            >
                                <NavigationIcon type="filter" className="h-6 w-6 text-neutral-600" />
                            </button>
                        ) : null}
                        <button className="p-2 rounded-full hover:bg-neutral-100">
                            <NavigationIcon type="messages" className="h-6 w-6 text-neutral-600" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-neutral-100">
                            <NavigationIcon type="notifications" className="h-6 w-6 text-neutral-600" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-neutral-100">
                            <NavigationIcon type="profile" className="h-6 w-6 text-neutral-600" />
                        </button>
                        <Link href="/login" className="p-2 rounded-full hover:bg-neutral-100">
                            <NavigationIcon type="login" className="h-6 w-6 text-neutral-600" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
