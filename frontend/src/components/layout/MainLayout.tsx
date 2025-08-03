import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { Header } from './Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Header />
            <main className="flex-grow pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
        </div>
    );
}
