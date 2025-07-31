import { BottomNav } from './BottomNav';
import { Header } from './Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-50">
            <Header />
            <main className="pb-16 md:pb-0">{children}</main>
            <BottomNav />
        </div>
    );
}
