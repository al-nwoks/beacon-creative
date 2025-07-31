import { AnimatedIcon } from '@/components/icons/AnimatedIcons';
import { useEffect, useState } from 'react';

export function AnimatedIconsDemo() {
    const [progress, setProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // Show success after progress completes
                    setTimeout(() => setShowSuccess(true), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    const handleReset = () => {
        setProgress(0);
        setShowSuccess(false);
        setShowError(false);
    };

    const handleError = () => {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Animated SVG Icons Demo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Loading Animation</h3>
                    <AnimatedIcon type="loading" className="w-12 h-12 text-beacon-purple" />
                    <p className="mt-2 text-neutral-600">Indeterminate loading state</p>
                </div>

                <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Progress Indicator</h3>
                    <AnimatedIcon type="progress" progress={progress} className="w-12 h-12 text-beacon-purple" />
                    <p className="mt-2 text-neutral-600">Progress: {progress}%</p>
                </div>

                <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Success Animation</h3>
                    {showSuccess ? (
                        <AnimatedIcon type="success" className="w-12 h-12 text-green-500" />
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-neutral-400">
                            <span>Waiting...</span>
                        </div>
                    )}
                    <p className="mt-2 text-neutral-600">Success state</p>
                </div>

                <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Error Animation</h3>
                    {showError ? (
                        <AnimatedIcon type="error" className="w-12 h-12 text-red-500" />
                    ) : (
                        <button
                            onClick={handleError}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Show Error
                        </button>
                    )}
                    <p className="mt-2 text-neutral-600">Error state</p>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-beacon-purple text-white rounded-md hover:bg-beacon-purple-dark transition-colors"
                >
                    Reset Demo
                </button>
            </div>
        </div>
    );
}