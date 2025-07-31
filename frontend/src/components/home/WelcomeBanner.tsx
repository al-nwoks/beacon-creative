import Button from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export function WelcomeBanner() {
    return (
        <div className="bg-gradient-to-r from-beacon-purple to-beacon-blue-light p-8 rounded-lg text-white">
            <div className="flex items-center space-x-4">
                <Sparkles className="h-10 w-10" />
                <div>
                    <h1 className="text-2xl font-bold">Welcome to B3ACON</h1>
                    <p className="mt-1">Connect with top creative talent and exciting opportunities worldwide.</p>
                </div>
            </div>
            <Button variant="secondary" className="mt-6">
                Complete Your Profile
            </Button>
        </div>
    );
}
